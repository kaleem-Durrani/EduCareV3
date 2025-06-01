import express from "express";
import {
  getAllTeachers,
  createTeacher,
  getTeachersForSelect,
} from "../controllers/teacher.controller.js";
import { createTeacherValidation } from "../validations/teacher.validation.js";
import { handleValidationErrors } from "../middleware/validation.middleware.js";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/teachers/select
 * @desc    Get teachers for select options (label/value pairs)
 * @access  Private (All authenticated users)
 */
router.get("/teachers/select", authenticate, getTeachersForSelect);

/**
 * @route   GET /api/teachers/all
 * @desc    Get all teachers
 * @access  Private (Admin only)
 */
router.get("/teachers/all", authenticate, requireAdmin, getAllTeachers);

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

export default router;
