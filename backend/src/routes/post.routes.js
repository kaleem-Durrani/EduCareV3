import express from "express";
import {
  getPosts,
  getPaginatedPosts,
  getPostStatistics,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import {
  authenticate,
  requireAdmin,
  requireAdminOrTeacher,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/posts
 * @desc    Get all posts (for dropdowns)
 * @access  Private (All authenticated users)
 */
router.get("/posts", authenticate, getPosts);

/**
 * @route   GET /api/posts/paginated
 * @desc    Get paginated posts
 * @access  Private (All authenticated users)
 */
router.get("/posts/paginated", authenticate, getPaginatedPosts);

/**
 * @route   GET /api/posts/statistics
 * @desc    Get posts statistics
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/posts/statistics",
  authenticate,
  requireAdminOrTeacher,
  getPostStatistics
);

/**
 * @route   GET /api/posts/:post_id
 * @desc    Get single post by ID
 * @access  Private (All authenticated users)
 */
router.get("/posts/:post_id", authenticate, getPostById);

/**
 * @route   POST /api/posts
 * @desc    Create post
 * @access  Private (Admin/Teacher)
 */
router.post("/posts", authenticate, requireAdminOrTeacher, createPost);

/**
 * @route   PUT /api/posts/:post_id
 * @desc    Update post
 * @access  Private (Admin/Teacher - own posts only)
 */
router.put("/posts/:post_id", authenticate, requireAdminOrTeacher, updatePost);

/**
 * @route   DELETE /api/posts/:post_id
 * @desc    Delete post
 * @access  Private (Admin/Teacher - own posts only)
 */
router.delete(
  "/posts/:post_id",
  authenticate,
  requireAdminOrTeacher,
  deletePost
);

export default router;
