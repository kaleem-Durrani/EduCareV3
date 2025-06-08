import express from "express";
import {
  getPosts,
  getPaginatedPosts,
  getPostStatistics,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostStudents,
  getPostClasses,
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
 * @desc    Create post with media upload
 * @access  Private (Admin/Teacher)
 */
router.post(
  "/posts",
  authenticate,
  requireAdminOrTeacher,
  uploadPostMedia.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createPost
);

/**
 * @route   PUT /api/posts/:post_id
 * @desc    Update post with media upload
 * @access  Private (Admin/Teacher - own posts only)
 */
router.put(
  "/posts/:post_id",
  authenticate,
  requireAdminOrTeacher,
  uploadPostMedia.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
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

/**
 * @route   GET /api/posts/:post_id/students
 * @desc    Get post students (for individual audience type)
 * @access  Private (All authenticated users)
 */
router.get("/posts/:post_id/students", authenticate, getPostStudents);

/**
 * @route   GET /api/posts/:post_id/classes
 * @desc    Get post classes (for class audience type)
 * @access  Private (All authenticated users)
 */
router.get("/posts/:post_id/classes", authenticate, getPostClasses);

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
