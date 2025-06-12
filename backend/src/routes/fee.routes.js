import express from "express";
import {
  getAllFees,
  getStudentFees,
  createFee,
  updateFeeStatus,
  deleteFee,
  getFeeSummary,
  getFeeStatistics,
} from "../controllers/fee.controller.js";
import {
  authenticate,
  requireAdminOrTeacher,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/fees/statistics
 * @desc    Get fee statistics for all students
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/fees/statistics",
  authenticate,
  requireAdminOrTeacher,
  getFeeStatistics
);

/**
 * @route   GET /api/fees/all
 * @desc    Get all fees with pagination and filters
 * @access  Private (Admin/Teacher only)
 */
router.get("/fees/all", authenticate, requireAdminOrTeacher, getAllFees);

/**
 * @route   GET /api/fees/summary/:student_id
 * @desc    Get fee summary for a student
 * @access  Private (Admin/Teacher/Parent with restrictions)
 */
router.get("/fees/summary/:student_id", authenticate, getFeeSummary);

/**
 * @route   GET /api/fees/:student_id
 * @desc    Get fees for a student
 * @access  Private (Admin/Teacher/Parent with restrictions)
 */
router.get("/fees/:student_id", authenticate, getStudentFees);

/**
 * @route   POST /api/fees
 * @desc    Create fee
 * @access  Private (Admin/Teacher)
 */
router.post("/fees", authenticate, requireAdminOrTeacher, createFee);

/**
 * @route   PUT /api/fees/:fee_id/status
 * @desc    Update fee status
 * @access  Private (Admin/Teacher)
 */
router.put(
  "/fees/:fee_id/status",
  authenticate,
  requireAdminOrTeacher,
  updateFeeStatus
);

/**
 * @route   DELETE /api/fees/:fee_id
 * @desc    Delete fee
 * @access  Private (Admin/Teacher)
 */
router.delete("/fees/:fee_id", authenticate, requireAdminOrTeacher, deleteFee);

export default router;
