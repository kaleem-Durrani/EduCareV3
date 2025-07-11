import express from "express";
import {
  createClass,
  updateClass,
  enrollTeacher,
  removeTeacherFromClass,
  addStudentToClass,
  removeStudentFromClass,
  getClasses,
  getEnrolledTeacherClasses,
  getClassById,
  getClassesForSelect,
  getClassStatistics,
  getClassDetails,
} from "../controllers/class.controller.js";
import { getClassRoster } from "../controllers/student.controller.js";
import {
  createClassValidation,
  updateClassValidation,
  classIdValidation,
  enrollTeacherValidation,
  removeTeacherValidation,
  addStudentValidation,
  removeStudentValidation,
} from "../validations/class.validation.js";
import { handleValidationErrors } from "../middleware/validation.middleware.js";
import {
  authenticate,
  requireAdmin,
  requireAdminOrTeacher,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/classes
 * @desc    Create a new class
 * @access  Private (Admin only)
 */
router.post(
  "/classes",
  authenticate,
  requireAdmin,
  createClassValidation,
  handleValidationErrors,
  createClass
);

/**
 * @route   PUT /api/classes/:class_id
 * @desc    Update a class
 * @access  Private (Admin only)
 */
router.put(
  "/classes/:class_id",
  authenticate,
  requireAdmin,
  updateClassValidation,
  handleValidationErrors,
  updateClass
);

/**
 * @route   POST /api/classes/:class_id/teacher
 * @desc    Enroll teacher to class
 * @access  Private (Admin only)
 */
router.post(
  "/classes/:class_id/teacher",
  authenticate,
  requireAdmin,
  enrollTeacherValidation,
  handleValidationErrors,
  enrollTeacher
);

/**
 * @route   DELETE /api/classes/:class_id/teachers/:teacher_id
 * @desc    Remove teacher from class
 * @access  Private (Admin only)
 */
router.delete(
  "/classes/:class_id/teachers/:teacher_id",
  authenticate,
  requireAdmin,
  removeTeacherValidation,
  handleValidationErrors,
  removeTeacherFromClass
);

/**
 * @route   POST /api/classes/:class_id/students
 * @desc    Add student to class
 * @access  Private (Admin only)
 */
router.post(
  "/classes/:class_id/students",
  authenticate,
  requireAdmin,
  addStudentValidation,
  handleValidationErrors,
  addStudentToClass
);

/**
 * @route   DELETE /api/classes/:class_id/students/:student_id
 * @desc    Remove student from class
 * @access  Private (Admin only)
 */
router.delete(
  "/classes/:class_id/students/:student_id",
  authenticate,
  requireAdmin,
  removeStudentValidation,
  handleValidationErrors,
  removeStudentFromClass
);

/**
 * @route   GET /api/classes/statistics
 * @desc    Get class statistics
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/classes/statistics",
  authenticate,
  requireAdminOrTeacher,
  getClassStatistics
);

/**
 * @route   GET /api/classes/select
 * @desc    Get classes for select options (label/value pairs)
 * @access  Private (All authenticated users)
 */
router.get("/classes/select", authenticate, getClassesForSelect);

/**
 * @route   GET /api/classes
 * @desc    Get all classes (role-based filtering)
 * @access  Private (Admin/Teacher)
 */
router.get("/classes", authenticate, requireAdminOrTeacher, getClasses);

/**
 * @route   GET /api/classes/enrolled-teacher
 * @desc    Get classes for enrolled teacher
 * @access  Private (Teacher only)
 */
router.get(
  "/classes/enrolled-teacher",
  authenticate,
  requireAdminOrTeacher,
  getEnrolledTeacherClasses
);

/**
 * @route   GET /api/classes/:class_id/details
 * @desc    Get class details with students and teachers
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/classes/:class_id/details",
  authenticate,
  requireAdminOrTeacher,
  classIdValidation,
  handleValidationErrors,
  getClassDetails
);

/**
 * @route   GET /api/classes/:class_id
 * @desc    Get single class details
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/classes/:class_id",
  authenticate,
  requireAdminOrTeacher,
  classIdValidation,
  handleValidationErrors,
  getClassById
);

/**
 * @route   GET /api/classes/:class_id/roster
 * @desc    Get class roster
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/classes/:class_id/roster",
  authenticate,
  requireAdminOrTeacher,
  classIdValidation,
  handleValidationErrors,
  getClassRoster
);

export default router;
