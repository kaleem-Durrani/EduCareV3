import express from "express";
import {
  getAllStudents,
  createStudent,
  updateStudent,
  enrollStudent,
  getStudentEnrollmentHistory,
  transferStudent,
  withdrawStudent,
  getStudentBasicInfoForParent,
  getStudentBasicInfoForTeacher,
  getParentStudents,
} from "../controllers/student.controller.js";
import {
  createStudentValidation,
  updateStudentValidation,
  studentIdValidation,
  enrollStudentValidation,
  transferStudentValidation,
  withdrawStudentValidation,
} from "../validations/student.validation.js";
import { handleValidationErrors } from "../middleware/validation.middleware.js";
import {
  authenticate,
  requireAdmin,
  requireAdminOrTeacher,
  requireParent,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/students
 * @desc    Get all students (Admin/Teacher)
 * @access  Private (Admin/Teacher)
 */
router.get("/students", authenticate, requireAdminOrTeacher, getAllStudents);

/**
 * @route   POST /api/student
 * @desc    Create a new student
 * @access  Private (Admin only)
 */
router.post(
  "/student",
  authenticate,
  requireAdmin,
  createStudentValidation,
  handleValidationErrors,
  createStudent
);

/**
 * @route   PUT /api/student/:student_id
 * @desc    Update student (uses rollNum as student_id)
 * @access  Private (Admin only)
 */
router.put(
  "/student/:student_id",
  authenticate,
  requireAdmin,
  updateStudentValidation,
  handleValidationErrors,
  updateStudent
);

/**
 * @route   POST /api/students/:student_id/enroll
 * @desc    Enroll student in a class
 * @access  Private (Admin only)
 */
router.post(
  "/students/:student_id/enroll",
  authenticate,
  requireAdmin,
  enrollStudentValidation,
  handleValidationErrors,
  enrollStudent
);

/**
 * @route   GET /api/students/:student_id/enrollment-history
 * @desc    Get student enrollment history
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/students/:student_id/enrollment-history",
  authenticate,
  requireAdminOrTeacher,
  studentIdValidation,
  handleValidationErrors,
  getStudentEnrollmentHistory
);

/**
 * @route   POST /api/students/:student_id/transfer
 * @desc    Transfer student to another class
 * @access  Private (Admin only)
 */
router.post(
  "/students/:student_id/transfer",
  authenticate,
  requireAdmin,
  transferStudentValidation,
  handleValidationErrors,
  transferStudent
);

/**
 * @route   POST /api/students/:student_id/withdraw
 * @desc    Withdraw student
 * @access  Private (Admin only)
 */
router.post(
  "/students/:student_id/withdraw",
  authenticate,
  requireAdmin,
  withdrawStudentValidation,
  handleValidationErrors,
  withdrawStudent
);

/**
 * @route   GET /api/student/:student_id/basic-info
 * @desc    Get student basic info for parent
 * @access  Private (Parent)
 */
router.get(
  "/student/:student_id/basic-info",
  authenticate,
  requireParent,
  studentIdValidation,
  handleValidationErrors,
  getStudentBasicInfoForParent
);

/**
 * @route   GET /api/student/:student_id/basic-info-for-teacher
 * @desc    Get student basic info for teacher
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/student/:student_id/basic-info-for-teacher",
  authenticate,
  requireAdminOrTeacher,
  studentIdValidation,
  handleValidationErrors,
  getStudentBasicInfoForTeacher
);

/**
 * @route   GET /api/parent/students
 * @desc    Get students for logged-in parent
 * @access  Private (Parent)
 */
router.get("/parent/students", authenticate, requireParent, getParentStudents);

export default router;
