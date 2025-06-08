import express from "express";
import {
  getAllTeachers,
  createTeacher,
  getTeachersForSelect,
  getTeacherStatistics,
  getTeacherDetails,
  updateTeacherPhoto,
  updateTeacher,
} from "../controllers/teacher.controller.js";
import { createTeacherValidation } from "../validations/teacher.validation.js";
import { handleValidationErrors } from "../middleware/validation.middleware.js";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";
import { uploadSingle } from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/teachers/statistics
 * @desc    Get teacher statistics
 * @access  Private (Admin only)
 */
router.get(
  "/teachers/statistics",
  authenticate,
  requireAdmin,
  getTeacherStatistics
);

/**
 * @route   GET /api/teachers/select
 * @desc    Get teachers for select options (label/value pairs)
 * @access  Private (All authenticated users)
 */
router.get("/teachers/select", authenticate, getTeachersForSelect);

/**
 * @route   GET /api/teachers/all
 * @desc    Get all teachers with pagination
 * @access  Private (Admin only)
 */
router.get("/teachers/all", authenticate, requireAdmin, getAllTeachers);

/**
 * @route   GET /api/teachers/:teacher_id/details
 * @desc    Get teacher details with enrolled classes
 * @access  Private (Admin only)
 */
router.get(
  "/teachers/:teacher_id/details",
  authenticate,
  requireAdmin,
  getTeacherDetails
);

/**
 * @route   POST /api/teacher/create
 * @desc    Create a new teacher
 * @access  Private (Admin only)
 */
router.post(
  "/teacher/create",
  authenticate,
  requireAdmin,
  createTeacherValidation,
  handleValidationErrors,
  createTeacher
);

/**
 * @route   PUT /api/teachers/:teacher_id
 * @desc    Update teacher information
 * @access  Private (Admin only)
 */
router.put("/teachers/:teacher_id", authenticate, requireAdmin, updateTeacher);

/**
 * @route   PUT /api/teachers/:teacher_id/photo
 * @desc    Update teacher photo
 * @access  Private (Admin only)
 */
router.put(
  "/teachers/:teacher_id/photo",
  authenticate,
  requireAdmin,
  uploadSingle("users"),
  updateTeacherPhoto
);

export default router;
