import express from "express";
import {
  getBoxItems,
  getPaginatedBoxItems,
  getStudentBoxStatus,
  updateStudentBoxStatus,
  getBoxStatistics,
  getPaginatedStudentsBoxStatus,
} from "../controllers/box.controller.js";
import {
  authenticate,
  requireAdminOrTeacher,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/box/items
 * @desc    Get all possible box items
 * @access  Private (All authenticated users)
 */
router.get("/box/items", authenticate, getBoxItems);

/**
 * @route   GET /api/box/items/paginated
 * @desc    Get paginated box items
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/box/items/paginated",
  authenticate,
  requireAdminOrTeacher,
  getPaginatedBoxItems
);

/**
 * @route   GET /api/box/statistics
 * @desc    Get box statistics
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/box/statistics",
  authenticate,
  requireAdminOrTeacher,
  getBoxStatistics
);

/**
 * @route   GET /api/box/students/paginated
 * @desc    Get paginated students with box status
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/box/students/paginated",
  authenticate,
  requireAdminOrTeacher,
  getPaginatedStudentsBoxStatus
);

/**
 * @route   GET /api/box/student/:student_id
 * @desc    Get a student's box status
 * @access  Private (Admin/Teacher/Parent with restrictions)
 */
router.get("/box/student/:student_id", authenticate, getStudentBoxStatus);

/**
 * @route   PUT /api/box/student/:student_id
 * @desc    Update a student's box status
 * @access  Private (Admin/Teacher)
 */
router.put(
  "/box/student/:student_id",
  authenticate,
  requireAdminOrTeacher,
  updateStudentBoxStatus
);

export default router;
