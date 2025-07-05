import Post from "../models/post.model.js";
import Student from "../models/student.model.js";
import Class from "../models/class.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
  throwForbidden,
  throwBadRequest,
} from "../utils/transaction.utils.js";
import { normalizePath } from "../middleware/upload.middleware.js";
import fs from "fs";

// Removed getPosts - use getPaginatedPosts instead

/**
 * Get paginated posts with filtering
 * GET /api/posts/paginated
 * All authenticated users
 * Query params: teacherId, classId, studentId, page, limit
 */
export const getPaginatedPosts = asyncHandler(async (req, res) => {
  const { teacherId, classId, studentId, page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Build query based on filters
  let query = {};

  // Filter by teacher
  if (teacherId) {
    query.teacherId = teacherId;
  }

  // Filter by class - posts where class is in class_ids or audience type is 'all' for that teacher
  if (classId) {
    if (teacherId) {
      // If teacher is specified, include 'all' posts from that teacher
      query.$or = [
        { "audience.class_ids": classId },
        { teacherId: teacherId, "audience.type": "all" }
      ];
    } else {
      query["audience.class_ids"] = classId;
    }
  }

  // Filter by student - posts where student is in student_ids or student's class is in class_ids or audience type is 'all'
  if (studentId) {
    const student = await Student.findById(studentId).populate('current_class');
    if (student) {
      const studentClassId = student.current_class?._id;

      query.$or = [
        { "audience.student_ids": studentId },
        ...(studentClassId ? [{ "audience.class_ids": studentClassId }] : []),
        { "audience.type": "all" }
      ];
    }
  }

  // For teachers, only show their own posts
  if (req.user.role === "teacher") {
    query.teacherId = req.user.id;
  }

  // Get total count for pagination
  const totalPosts = await Post.countDocuments(query);
  const totalPages = Math.ceil(totalPosts / limitNum);

  // Get paginated posts with full details
  const posts = await Post.find(query)
    .populate("teacherId", "name email photoUrl")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .populate("audience.class_ids", "name")
    .populate("audience.student_ids", "fullName rollNum")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const result = {
    posts,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalPosts,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      limit: limitNum,
    },
  };

  return sendSuccess(res, result, "Posts retrieved successfully");
});

/**
 * Get posts for parent (by student ID)
 * GET /api/posts/parent/:studentId
 * Parent only - gets posts where student is in audience
 */
export const getPostsForParent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Get student and their class
  const student = await Student.findById(studentId).populate('current_class');
  if (!student) {
    return sendError(res, "Student not found", 404);
  }

  const studentClassId = student.current_class?._id;

  // Build query for posts visible to this student
  const query = {
    $or: [
      { "audience.student_ids": studentId }, // Direct student targeting
      ...(studentClassId ? [{ "audience.class_ids": studentClassId }] : []), // Class targeting
      { "audience.type": "all" } // All posts
    ]
  };

  // Get total count for pagination
  const totalPosts = await Post.countDocuments(query);
  const totalPages = Math.ceil(totalPosts / limitNum);

  // Get paginated posts with full details
  const posts = await Post.find(query)
    .populate("teacherId", "name email photoUrl")
    .populate("createdBy", "name email")
    .populate("audience.class_ids", "name")
    .populate("audience.student_ids", "fullName rollNum")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const result = {
    posts,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalPosts,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      limit: limitNum,
    },
  };

  return sendSuccess(res, result, "Posts for parent retrieved successfully");
});

// Removed getTeachersForClasses - no longer needed

/**
 * Get posts statistics (Admin only - for web app)
 * GET /api/posts/statistics
 * Admin only
 */
export const getPostStatistics = asyncHandler(async (req, res) => {
  // Only admins can access statistics
  if (req.user.role !== "admin") {
    throwForbidden("Only admins can access post statistics");
  }
  // Get total posts count
  const totalPosts = await Post.countDocuments();

  // Get posts by audience type
  const audienceStats = await Post.aggregate([
    {
      $group: {
        _id: "$audience.type",
        count: { $sum: 1 },
      },
    },
  ]);

  // Get posts by teacher
  const teacherStats = await Post.aggregate([
    {
      $group: {
        _id: "$teacherId",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "teacher",
      },
    },
    {
      $unwind: "$teacher",
    },
    {
      $project: {
        teacherName: "$teacher.name",
        count: 1,
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  // Get recent activity (posts in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentPosts = await Post.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  // Get posts with media
  const postsWithImages = await Post.countDocuments({
    imageUrl: { $exists: true, $ne: null },
  });
  const postsWithVideos = await Post.countDocuments({
    videoUrl: { $exists: true, $ne: null },
  });

  const statistics = {
    totalPosts,
    recentPosts,
    postsWithImages,
    postsWithVideos,
    audienceBreakdown: audienceStats.reduce((acc, stat) => {
      acc[stat._id || "all"] = stat.count;
      return acc;
    }, {}),
    topTeachers: teacherStats,
    lastCalculated: new Date(),
  };

  return sendSuccess(
    res,
    statistics,
    "Posts statistics retrieved successfully"
  );
});

/**
 * Get single post by ID
 * GET /api/posts/:post_id
 * All authenticated users
 */
export const getPostById = asyncHandler(async (req, res) => {
  const { post_id } = req.params;

  const post = await Post.findById(post_id)
    .populate("teacherId", "name email photoUrl")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .populate("audience.class_ids", "name")
    .populate("audience.student_ids", "fullName rollNum");

  if (!post) {
    throwNotFound("Post");
  }

  return sendSuccess(res, post, "Post retrieved successfully");
});

/**
 * Create post
 * POST /api/posts
 * Admin/Teacher only
 */
export const createPost = asyncHandler(async (req, res) => {
  const { title, content, teacherId, audience } = req.body;

  const result = await withTransaction(async (session) => {
    // Handle multiple media file uploads
    const media = [];

    if (req.files) {
      // Handle files from .fields() format (req.files.images, req.files.videos)
      if (req.files.images) {
        for (const file of req.files.images) {
          media.push({
            type: 'image',
            url: normalizePath(file.path),
            filename: file.originalname
          });
        }
      }

      if (req.files.videos) {
        for (const file of req.files.videos) {
          media.push({
            type: 'video',
            url: normalizePath(file.path),
            filename: file.originalname
          });
        }
      }

      // Handle files from .any() format (req.files as array)
      if (Array.isArray(req.files)) {
        for (const file of req.files) {
          if (file.fieldname === 'images') {
            media.push({
              type: 'image',
              url: normalizePath(file.path),
              filename: file.originalname
            });
          } else if (file.fieldname === 'videos') {
            media.push({
              type: 'video',
              url: normalizePath(file.path),
              filename: file.originalname
            });
          }
        }
      }
    }

    // Parse and process audience
    let processedAudience = audience ? JSON.parse(audience) : { type: "all" };

    // If audience type is "all", get all classes for this teacher
    if (processedAudience.type === "all") {
      const teacherClasses = await Class.find({
        teachers: teacherId || req.user.id
      }).select("_id").session(session);

      processedAudience.class_ids = teacherClasses.map(cls => cls._id);
      processedAudience.student_ids = []; // Clear any student_ids for "all" type
    }

    const newPost = new Post({
      title,
      content,
      media,
      teacherId: teacherId || req.user.id,
      audience: processedAudience,
      createdBy: req.user.id,
    });

    await newPost.save({ session });

    const populatedPost = await Post.findById(newPost._id)
      .populate("teacherId", "name email photoUrl")
      .populate("createdBy", "name email")
      .populate("audience.class_ids", "name")
      .populate("audience.student_ids", "fullName rollNum")
      .session(session);

    return populatedPost;
  });

  return sendSuccess(res, result, "Post created successfully", 201);
});

/**
 * Update post
 * PUT /api/posts/:post_id
 * Admin/Teacher only (own posts)
 */
export const updatePost = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  const { title, content, teacherId, audience } = req.body;

  const result = await withTransaction(async (session) => {
    const post = await Post.findById(post_id).session(session);
    if (!post) {
      throwNotFound("Post");
    }

    // Check if user can edit this post (admin or post owner)
    if (
      req.user.role !== "admin" &&
      post.teacherId.toString() !== req.user.id
    ) {
      throwForbidden("You can only edit your own posts");
    }

    // Update fields
    const updateData = { updatedBy: req.user.id };
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (teacherId !== undefined) updateData.teacherId = teacherId;

    // Process audience with "all" logic
    if (audience !== undefined) {
      let processedAudience = JSON.parse(audience);

      // If audience type is "all", get all classes for this teacher
      if (processedAudience.type === "all") {
        const teacherClasses = await Class.find({
          teachers: teacherId || post.teacherId
        }).select("_id").session(session);

        processedAudience.class_ids = teacherClasses.map(cls => cls._id);
        processedAudience.student_ids = []; // Clear any student_ids for "all" type
      }

      updateData.audience = processedAudience;
    }

    // Handle multiple media file uploads and cleanup
    if (req.files) {
      const newMedia = [];

      // Clean up old media files
      if (post.media && post.media.length > 0) {
        for (const mediaItem of post.media) {
          if (mediaItem.url && fs.existsSync(mediaItem.url)) {
            fs.unlink(mediaItem.url, (err) => {
              if (err) console.error("Error deleting old media:", err);
            });
          }
        }
      }

      // Handle files from .fields() format (req.files.images, req.files.videos)
      if (req.files.images) {
        for (const file of req.files.images) {
          newMedia.push({
            type: 'image',
            url: normalizePath(file.path),
            filename: file.originalname
          });
        }
      }

      if (req.files.videos) {
        for (const file of req.files.videos) {
          newMedia.push({
            type: 'video',
            url: normalizePath(file.path),
            filename: file.originalname
          });
        }
      }

      // Handle files from .any() format (req.files as array)
      if (Array.isArray(req.files)) {
        for (const file of req.files) {
          if (file.fieldname === 'images') {
            newMedia.push({
              type: 'image',
              url: normalizePath(file.path),
              filename: file.originalname
            });
          } else if (file.fieldname === 'videos') {
            newMedia.push({
              type: 'video',
              url: normalizePath(file.path),
              filename: file.originalname
            });
          }
        }
      }

      updateData.media = newMedia;
    }

    const updatedPost = await Post.findByIdAndUpdate(post_id, updateData, {
      new: true,
      session,
    })
      .populate("teacherId", "name email photoUrl")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .populate("audience.class_ids", "name")
      .populate("audience.student_ids", "fullName rollNum");

    return updatedPost;
  });

  return sendSuccess(res, result, "Post updated successfully");
});

/**
 * Delete post
 * DELETE /api/posts/:post_id
 * Admin/Teacher only (own posts)
 */
export const deletePost = asyncHandler(async (req, res) => {
  const { post_id } = req.params;

  const result = await withTransaction(async (session) => {
    const post = await Post.findById(post_id).session(session);
    if (!post) {
      throwNotFound("Post");
    }

    // Check if user can delete this post (admin or post owner)
    if (
      req.user.role !== "admin" &&
      post.teacherId.toString() !== req.user.id
    ) {
      throwForbidden("You can only delete your own posts");
    }

    // Delete associated media files
    if (post.imageUrl && fs.existsSync(post.imageUrl)) {
      fs.unlink(post.imageUrl, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    }
    if (post.videoUrl && fs.existsSync(post.videoUrl)) {
      fs.unlink(post.videoUrl, (err) => {
        if (err) console.error("Error deleting video:", err);
      });
    }

    await Post.findByIdAndDelete(post_id, { session });

    return { deletedId: post_id };
  });

  return sendSuccess(res, result, "Post deleted successfully");
});

// Removed getPostStudents and getPostClasses - use getPostById instead

/**
 * Add students to post (for individual audience type)
 * POST /api/posts/:post_id/students
 * Admin/Teacher only
 */
export const addStudentsToPost = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  const { student_ids } = req.body;

  if (!student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
    throwBadRequest("Please provide an array of student IDs");
  }

  const result = await withTransaction(async (session) => {
    const post = await Post.findById(post_id).session(session);
    if (!post) {
      throwNotFound("Post");
    }

    // Check if user can edit this post
    if (
      req.user.role !== "admin" &&
      post.teacherId.toString() !== req.user.id
    ) {
      throwForbidden("You can only edit your own posts");
    }

    if (post.audience.type !== "individual") {
      throwBadRequest("This post is not targeted to individual students");
    }

    // Verify students exist
    const students = await Student.find({ _id: { $in: student_ids } }).session(
      session
    );
    if (students.length !== student_ids.length) {
      throwBadRequest("Some students not found");
    }

    // Add students (avoid duplicates)
    const existingIds = post.audience.student_ids.map((id) => id.toString());
    const newIds = student_ids.filter(
      (id) => !existingIds.includes(id.toString())
    );

    if (newIds.length === 0) {
      throwBadRequest("All students are already added to this post");
    }

    const updatedPost = await Post.findByIdAndUpdate(
      post_id,
      {
        $addToSet: { "audience.student_ids": { $each: newIds } },
        updatedBy: req.user.id,
      },
      { new: true, session }
    )
      .populate("teacherId", "name email photoUrl")
      .populate("audience.student_ids", "fullName rollNum class");

    return { addedCount: newIds.length, post: updatedPost };
  });

  return sendSuccess(
    res,
    result,
    `${result.addedCount} students added to post successfully`
  );
});

/**
 * Remove students from post (for individual audience type)
 * DELETE /api/posts/:post_id/students
 * Admin/Teacher only
 */
export const removeStudentsFromPost = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  const { student_ids } = req.body;

  if (!student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
    throwBadRequest("Please provide an array of student IDs");
  }

  const result = await withTransaction(async (session) => {
    const post = await Post.findById(post_id).session(session);
    if (!post) {
      throwNotFound("Post");
    }

    // Check if user can edit this post
    if (
      req.user.role !== "admin" &&
      post.teacherId.toString() !== req.user.id
    ) {
      throwForbidden("You can only edit your own posts");
    }

    if (post.audience.type !== "individual") {
      throwBadRequest("This post is not targeted to individual students");
    }

    const updatedPost = await Post.findByIdAndUpdate(
      post_id,
      {
        $pull: { "audience.student_ids": { $in: student_ids } },
        updatedBy: req.user.id,
      },
      { new: true, session }
    )
      .populate("teacherId", "name email photoUrl")
      .populate("audience.student_ids", "fullName rollNum class");

    return { removedCount: student_ids.length, post: updatedPost };
  });

  return sendSuccess(
    res,
    result,
    `${result.removedCount} students removed from post successfully`
  );
});

/**
 * Add classes to post (for class audience type)
 * POST /api/posts/:post_id/classes
 * Admin/Teacher only
 */
export const addClassesToPost = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  const { class_ids } = req.body;

  if (!class_ids || !Array.isArray(class_ids) || class_ids.length === 0) {
    throwBadRequest("Please provide an array of class IDs");
  }

  const result = await withTransaction(async (session) => {
    const post = await Post.findById(post_id).session(session);
    if (!post) {
      throwNotFound("Post");
    }

    // Check if user can edit this post
    if (
      req.user.role !== "admin" &&
      post.teacherId.toString() !== req.user.id
    ) {
      throwForbidden("You can only edit your own posts");
    }

    if (post.audience.type !== "class") {
      throwBadRequest("This post is not targeted to classes");
    }

    // Verify classes exist
    const classes = await Class.find({ _id: { $in: class_ids } }).session(
      session
    );
    if (classes.length !== class_ids.length) {
      throwBadRequest("Some classes not found");
    }

    // Add classes (avoid duplicates)
    const existingIds = post.audience.class_ids.map((id) => id.toString());
    const newIds = class_ids.filter(
      (id) => !existingIds.includes(id.toString())
    );

    if (newIds.length === 0) {
      throwBadRequest("All classes are already added to this post");
    }

    const updatedPost = await Post.findByIdAndUpdate(
      post_id,
      {
        $addToSet: { "audience.class_ids": { $each: newIds } },
        updatedBy: req.user.id,
      },
      { new: true, session }
    )
      .populate("teacherId", "name email photoUrl")
      .populate("audience.class_ids", "name grade section");

    return { addedCount: newIds.length, post: updatedPost };
  });

  return sendSuccess(
    res,
    result,
    `${result.addedCount} classes added to post successfully`
  );
});

/**
 * Remove classes from post (for class audience type)
 * DELETE /api/posts/:post_id/classes
 * Admin/Teacher only
 */
export const removeClassesFromPost = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  const { class_ids } = req.body;

  if (!class_ids || !Array.isArray(class_ids) || class_ids.length === 0) {
    throwBadRequest("Please provide an array of class IDs");
  }

  const result = await withTransaction(async (session) => {
    const post = await Post.findById(post_id).session(session);
    if (!post) {
      throwNotFound("Post");
    }

    // Check if user can edit this post
    if (
      req.user.role !== "admin" &&
      post.teacherId.toString() !== req.user.id
    ) {
      throwForbidden("You can only edit your own posts");
    }

    if (post.audience.type !== "class") {
      throwBadRequest("This post is not targeted to classes");
    }

    const updatedPost = await Post.findByIdAndUpdate(
      post_id,
      {
        $pull: { "audience.class_ids": { $in: class_ids } },
        updatedBy: req.user.id,
      },
      { new: true, session }
    )
      .populate("teacherId", "name email photoUrl")
      .populate("audience.class_ids", "name grade section");

    return { removedCount: class_ids.length, post: updatedPost };
  });

  return sendSuccess(
    res,
    result,
    `${result.removedCount} classes removed from post successfully`
  );
});
