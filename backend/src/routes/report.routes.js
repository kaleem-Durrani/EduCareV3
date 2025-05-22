import express from "express";
import {
  createWeeklyReport,
  getWeeklyReports,
  updateWeeklyReport,
  createBatchReports,
} from "../controllers/report.controller.js";
import {
  createReportValidation,
  updateReportValidation,
  studentIdValidation,
  reportIdValidation,
  batchReportValidation,
} from "../validations/report.validation.js";
import { handleValidationErrors } from "../middleware/validation.middleware.js";
import {
  authenticate,
  requireAdminOrTeacher,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/reports/weekly
 * @desc    Create weekly report
 * @access  Private (Admin/Teacher)
 */
router.post(
  "/reports/weekly",
  authenticate,
  requireAdminOrTeacher,
  createReportValidation,
  handleValidationErrors,
  createWeeklyReport
);

/**
 * @route   GET /api/reports/weekly/:student_id
 * @desc    Get weekly reports for a student
 * @access  Private (Admin/Teacher/Parent with restrictions)
 */
router.get(
  "/reports/weekly/:student_id",
  authenticate,
  studentIdValidation,
  handleValidationErrors,
  getWeeklyReports
);

/**
 * @route   PUT /api/reports/weekly/:report_id
 * @desc    Update weekly report
 * @access  Private (Admin/Teacher)
 */
router.put(
  "/reports/weekly/:report_id",
  authenticate,
  requireAdminOrTeacher,
  updateReportValidation,
  handleValidationErrors,
  updateWeeklyReport
);

/**
 * @route   POST /api/reports/weekly/batch/:student_id
 * @desc    Create batch reports for a student
 * @access  Private (Admin/Teacher)
 */
router.post(
  "/reports/weekly/batch/:student_id",
  authenticate,
  requireAdminOrTeacher,
  batchReportValidation,
  handleValidationErrors,
  createBatchReports
);

export default router;
