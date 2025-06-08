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
import path from "path";

/**
 * Get all posts (for dropdowns - simplified)
 * GET /api/posts
 * All authenticated users
 */
export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("teacherId", "name email")
    .select("title createdAt teacherId")
    .sort({ createdAt: -1 })
    .limit(100); // Reasonable limit for dropdowns

  return sendSuccess(res, posts, "Posts retrieved successfully");
});

/**
 * Get paginated posts (EFFICIENT)
 * GET /api/posts/paginated
 * All authenticated users
 */
export const getPaginatedPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Get paginated posts with full details
  const posts = await Post.find()
    .populate("teacherId", "name email photoUrl")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .populate("audience.class_ids", "name")
    .populate("audience.student_ids", "fullName rollNum")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await Post.countDocuments();

  const result = {
    posts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      hasNextPage: page < Math.ceil(totalPosts / limit),
      hasPrevPage: page > 1,
    },
  };

  return sendSuccess(res, result, "Paginated posts retrieved successfully");
});

/**
 * Get posts statistics (REAL-TIME)
 * GET /api/posts/statistics
 * Admin/Teacher only
 */
export const getPostStatistics = asyncHandler(async (req, res) => {
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
    // Handle file uploads
    let imageUrl = null;
    let videoUrl = null;

    if (req.files) {
      if (req.files.image) {
        imageUrl = normalizePath(req.files.image[0].path);
      }
      if (req.files.video) {
        videoUrl = normalizePath(req.files.video[0].path);
      }
    }

    const newPost = new Post({
      title,
      content,
      imageUrl,
      videoUrl,
      teacherId: teacherId || req.user.id, // Use provided teacherId or current user
      audience: audience ? JSON.parse(audience) : { type: "all" }, // Parse audience from form data
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
    if (audience !== undefined) updateData.audience = JSON.parse(audience);

    // Handle file uploads and cleanup
    if (req.files) {
      if (req.files.image) {
        // Delete old image if exists
        if (post.imageUrl && fs.existsSync(post.imageUrl)) {
          fs.unlink(post.imageUrl, (err) => {
            if (err) console.error("Error deleting old image:", err);
          });
        }
        updateData.imageUrl = normalizePath(req.files.image[0].path);
      }
      if (req.files.video) {
        // Delete old video if exists
        if (post.videoUrl && fs.existsSync(post.videoUrl)) {
          fs.unlink(post.videoUrl, (err) => {
            if (err) console.error("Error deleting old video:", err);
          });
        }
        updateData.videoUrl = normalizePath(req.files.video[0].path);
      }
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

/**
 * Get post students (for individual audience type)
 * GET /api/posts/:post_id/students
 * All authenticated users
 */
export const getPostStudents = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const post = await Post.findById(post_id);
  if (!post) {
    throwNotFound("Post");
  }

  if (post.audience.type !== "individual") {
    throwBadRequest("This post is not targeted to individual students");
  }

  const total = post.audience.student_ids.length;
  const studentIds = post.audience.student_ids.slice(
    skip,
    skip + parseInt(limit)
  );

  const students = await Student.find({ _id: { $in: studentIds } })
    .select("fullName rollNum class enrollmentNumber")
    .populate("current_class", "name")
    .sort({ fullName: 1 });

  const response = {
    students,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };

  return sendSuccess(res, response, "Post students retrieved successfully");
});

/**
 * Get post classes (for class audience type)
 * GET /api/posts/:post_id/classes
 * All authenticated users
 */
export const getPostClasses = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const post = await Post.findById(post_id);
  if (!post) {
    throwNotFound("Post");
  }

  if (post.audience.type !== "class") {
    throwBadRequest("This post is not targeted to classes");
  }

  const total = post.audience.class_ids.length;
  const classIds = post.audience.class_ids.slice(skip, skip + parseInt(limit));

  const classes = await Class.find({ _id: { $in: classIds } })
    .select("name grade section isActive")
    .sort({ name: 1 });

  const response = {
    classes,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };

  return sendSuccess(res, response, "Post classes retrieved successfully");
});

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
