import express from "express";
import {
  getPaginatedPosts,
  getPostStatistics,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsForParent,
  addStudentsToPost,
  removeStudentsFromPost,
  addClassesToPost,
  removeClassesFromPost,
} from "../controllers/post.controller.js";
import {
  authenticate,
  requireAdmin,
  requireAdminOrTeacher,
} from "../middleware/auth.middleware.js";
import { uploadPostMedia } from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/posts/paginated
 * @desc    Get paginated posts with filtering
 * @access  Private (All authenticated users)
 */
router.get("/posts/paginated", authenticate, getPaginatedPosts);

/**
 * @route   GET /api/posts/parent/:studentId
 * @desc    Get posts for parent by student ID
 * @access  Private (Parent only)
 */
router.get("/posts/parent/:studentId", authenticate, getPostsForParent);

/**
 * @route   GET /api/posts/statistics
 * @desc    Get posts statistics (Admin only - for web app)
 * @access  Private (Admin only)
 */
router.get(
  "/posts/statistics",
  authenticate,
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
 * @desc    Create post with multiple media uploads
 * @access  Private (Admin/Teacher)
 */
router.post(
  "/posts",
  authenticate,
  requireAdminOrTeacher,
  uploadPostMedia.fields([
    { name: "images", maxCount: 10 }, // Support up to 10 images
    { name: "videos", maxCount: 5 },  // Support up to 5 videos
  ]),
  createPost
);

/**
 * @route   PUT /api/posts/:post_id
 * @desc    Update post with multiple media uploads
 * @access  Private (Admin/Teacher - own posts only)
 */
router.put(
  "/posts/:post_id",
  authenticate,
  requireAdminOrTeacher,
  uploadPostMedia.fields([
    { name: "images", maxCount: 10 }, // Support up to 10 images
    { name: "videos", maxCount: 5 },  // Support up to 5 videos
  ]),
  updatePost
);

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

// Removed getPostStudents and getPostClasses routes - use getPostById instead

/**
 * @route   POST /api/posts/:post_id/students
 * @desc    Add students to post (for individual audience type)
 * @access  Private (Admin/Teacher - own posts only)
 */
router.post(
  "/posts/:post_id/students",
  authenticate,
  requireAdminOrTeacher,
  addStudentsToPost
);

/**
 * @route   DELETE /api/posts/:post_id/students
 * @desc    Remove students from post (for individual audience type)
 * @access  Private (Admin/Teacher - own posts only)
 */
router.delete(
  "/posts/:post_id/students",
  authenticate,
  requireAdminOrTeacher,
  removeStudentsFromPost
);

/**
 * @route   POST /api/posts/:post_id/classes
 * @desc    Add classes to post (for class audience type)
 * @access  Private (Admin/Teacher - own posts only)
 */
router.post(
  "/posts/:post_id/classes",
  authenticate,
  requireAdminOrTeacher,
  addClassesToPost
);

/**
 * @route   DELETE /api/posts/:post_id/classes
 * @desc    Remove classes from post (for class audience type)
 * @access  Private (Admin/Teacher - own posts only)
 */
router.delete(
  "/posts/:post_id/classes",
  authenticate,
  requireAdminOrTeacher,
  removeClassesFromPost
);

export default router;
