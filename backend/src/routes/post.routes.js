import express from "express";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/posts
 * @desc    Get all posts
 * @access  Private (All authenticated users)
 */
router.get("/posts", authenticate, getPosts);

/**
 * @route   POST /api/posts
 * @desc    Create post
 * @access  Private (Admin only)
 */
router.post("/posts", authenticate, requireAdmin, createPost);

/**
 * @route   PUT /api/posts/:post_id
 * @desc    Update post
 * @access  Private (Admin only)
 */
router.put("/posts/:post_id", authenticate, requireAdmin, updatePost);

/**
 * @route   DELETE /api/posts/:post_id
 * @desc    Delete post
 * @access  Private (Admin only)
 */
router.delete("/posts/:post_id", authenticate, requireAdmin, deletePost);

export default router;
