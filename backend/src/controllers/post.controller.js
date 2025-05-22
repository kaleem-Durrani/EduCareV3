import Post from "../models/post.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
} from "../utils/transaction.utils.js";

/**
 * Get all posts
 * GET /api/posts
 * All authenticated users
 */
export const getPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const posts = await Post.find()
    .populate("teacherId", "name email photoUrl")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Post.countDocuments();

  const response = {
    posts,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };

  return sendSuccess(res, response, "Posts retrieved successfully");
});

/**
 * Create post
 * POST /api/posts
 * Admin only
 */
export const createPost = asyncHandler(async (req, res) => {
  const { title, content, imageUrl, teacherId } = req.body;

  const result = await withTransaction(async (session) => {
    const newPost = new Post({
      title,
      content,
      imageUrl,
      teacherId: teacherId || req.user.id, // Use provided teacherId or current user
      createdBy: req.user.id,
    });

    await newPost.save({ session });

    const populatedPost = await Post.findById(newPost._id)
      .populate("teacherId", "name email photoUrl")
      .populate("createdBy", "name email")
      .session(session);

    return populatedPost;
  });

  return sendSuccess(res, result, "Post created successfully", 201);
});

/**
 * Update post
 * PUT /api/posts/:post_id
 * Admin only
 */
export const updatePost = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  const { title, content, imageUrl, teacherId } = req.body;

  const result = await withTransaction(async (session) => {
    const post = await Post.findById(post_id).session(session);
    if (!post) {
      throwNotFound("Post");
    }

    // Update fields
    const updateData = { updatedBy: req.user.id };
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (teacherId !== undefined) updateData.teacherId = teacherId;

    const updatedPost = await Post.findByIdAndUpdate(post_id, updateData, {
      new: true,
      session,
    })
      .populate("teacherId", "name email photoUrl")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    return updatedPost;
  });

  return sendSuccess(res, result, "Post updated successfully");
});

/**
 * Delete post
 * DELETE /api/posts/:post_id
 * Admin only
 */
export const deletePost = asyncHandler(async (req, res) => {
  const { post_id } = req.params;

  const post = await Post.findById(post_id);
  if (!post) {
    throwNotFound("Post");
  }

  await Post.findByIdAndDelete(post_id);

  return sendSuccess(res, null, "Post deleted successfully");
});
