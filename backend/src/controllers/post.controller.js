import Post from "../models/post.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
  throwForbidden,
} from "../utils/transaction.utils.js";

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
  const { title, content, imageUrl, videoUrl, teacherId, audience } = req.body;

  const result = await withTransaction(async (session) => {
    const newPost = new Post({
      title,
      content,
      imageUrl,
      videoUrl,
      teacherId: teacherId || req.user.id, // Use provided teacherId or current user
      audience: audience || { type: "all" }, // Default to all if not specified
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
  const { title, content, imageUrl, videoUrl, teacherId, audience } = req.body;

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
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (teacherId !== undefined) updateData.teacherId = teacherId;
    if (audience !== undefined) updateData.audience = audience;

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

    await Post.findByIdAndDelete(post_id, { session });

    return { deletedId: post_id };
  });

  return sendSuccess(res, result, "Post deleted successfully");
});
