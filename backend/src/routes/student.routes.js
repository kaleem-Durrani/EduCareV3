import express from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  getStudentEnrollmentHistory,
  transferStudent,
  withdrawStudent,
  getStudentBasicInfoForParent,
  getStudentBasicInfoForTeacher,
  getParentStudents,
  getStudentsForSelect,
  getStudentStatistics,
  getStudentDetails,
  updateStudentPhoto,
  addStudentContact,
  updateStudentContact,
  deleteStudentContact,
  updateStudentActiveStatus,
  generateEnrollmentNumber,
} from "../controllers/student.controller.js";
import { getMonthlyPlanForParent } from "../controllers/plan.controller.js";
import {
  createStudentValidation,
  updateStudentValidation,
  studentIdValidation,
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
import { uploadSingle } from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/students/statistics
 * @desc    Get student statistics
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/students/statistics",
  authenticate,
  requireAdminOrTeacher,
  getStudentStatistics
);

/**
 * @route   GET /api/students/generate-enrollment-number
 * @desc    Generate next enrollment number
 * @access  Private (Admin only)
 */
router.get(
  "/students/generate-enrollment-number",
  authenticate,
  requireAdmin,
  generateEnrollmentNumber
);

/**
 * @route   GET /api/students/select
 * @desc    Get students for select options (label/value pairs)
 * @access  Private (All authenticated users)
 */
router.get("/students/select", authenticate, getStudentsForSelect);

/**
 * @route   GET /api/students
 * @desc    Get all students with pagination (Admin/Teacher)
 * @access  Private (Admin/Teacher)
 */
router.get("/students", authenticate, requireAdminOrTeacher, getAllStudents);

/**
 * @route   GET /api/students/:student_id
 * @desc    Get student by ID (detailed view for modals)
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/students/:student_id",
  authenticate,
  requireAdminOrTeacher,
  studentIdValidation,
  handleValidationErrors,
  getStudentById
);

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
 * @route   GET /api/students/:student_id/details
 * @desc    Get student details with contacts and enrollment info
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/students/:student_id/details",
  authenticate,
  requireAdminOrTeacher,
  studentIdValidation,
  handleValidationErrors,
  getStudentDetails
);

/**
 * @route   PUT /api/students/:student_id
 * @desc    Update student information
 * @access  Private (Admin only)
 */
router.put(
  "/students/:student_id",
  authenticate,
  requireAdmin,
  updateStudentValidation,
  handleValidationErrors,
  updateStudent
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
 * @route   PUT /api/students/:student_id/photo
 * @desc    Update student photo
 * @access  Private (Admin only)
 */
router.put(
  "/students/:student_id/photo",
  authenticate,
  requireAdmin,
  uploadSingle("students"),
  updateStudentPhoto
);

/**
 * @route   PUT /api/students/:student_id/active
 * @desc    Update student active status
 * @access  Private (Admin only)
 */
router.put(
  "/students/:student_id/active",
  authenticate,
  requireAdmin,
  updateStudentActiveStatus
);

/**
 * @route   POST /api/students/:student_id/contacts
 * @desc    Add student contact with optional photo
 * @access  Private (Admin only)
 */
router.post(
  "/students/:student_id/contacts",
  authenticate,
  requireAdmin,
  uploadSingle("contacts"),
  addStudentContact
);

/**
 * @route   PUT /api/students/:student_id/contacts/:contact_id
 * @desc    Update student contact with optional photo
 * @access  Private (Admin only)
 */
router.put(
  "/students/:student_id/contacts/:contact_id",
  authenticate,
  requireAdmin,
  uploadSingle("contacts"),
  updateStudentContact
);

/**
 * @route   DELETE /api/students/:student_id/contacts/:contact_id
 * @desc    Delete student contact
 * @access  Private (Admin only)
 */
router.delete(
  "/students/:student_id/contacts/:contact_id",
  authenticate,
  requireAdmin,
  deleteStudentContact
);

/**
 * @route   GET /api/parent/students
 * @desc    Get students for logged-in parent
 * @access  Private (Parent)
 */
router.get("/parent/students", authenticate, requireParent, getParentStudents);

/**
 * @route   GET /api/parent/monthly-plan/:student_id
 * @desc    Get monthly plan for parent's child
 * @access  Private (Parent)
 */
router.get(
  "/parent/monthly-plan/:student_id",
  authenticate,
  requireParent,
  studentIdValidation,
  handleValidationErrors,
  getMonthlyPlanForParent
);

export default router;
