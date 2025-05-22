import express from "express";
import {
  getStudentFees,
  createFee,
  updateFeeStatus,
  getFeeSummary,
} from "../controllers/fee.controller.js";
import { authenticate, requireAdminOrTeacher } from "../middleware/auth.middleware.js";

const router = express.Router();

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
router.put("/fees/:fee_id/status", authenticate, requireAdminOrTeacher, updateFeeStatus);

/**
 * @route   GET /api/fees/summary/:student_id
 * @desc    Get fee summary for a student
 * @access  Private (Admin/Teacher/Parent with restrictions)
 */
router.get("/fees/summary/:student_id", authenticate, getFeeSummary);

export default router;
