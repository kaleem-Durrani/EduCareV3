import express from "express";
import {
  getHealthMetrics,
  createHealthMetric,
  updateHealthMetric,
  getHealthInfo,
  updateHealthInfo,
  getHealthStatistics,
} from "../controllers/health.controller.js";
import {
  authenticate,
  requireAdminOrTeacher,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/health/statistics
 * @desc    Get health statistics for all students
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/health/statistics",
  authenticate,
  requireAdminOrTeacher,
  getHealthStatistics
);

/**
 * @route   GET /api/health/metrics/:student_id
 * @desc    Get health metrics for a student (filter by type and period query params)
 * @access  Private (Admin/Teacher/Parent with restrictions)
 */
router.get("/health/metrics/:student_id", authenticate, getHealthMetrics);

/**
 * @route   POST /api/health/metrics/:student_id
 * @desc    Create health metric for a student
 * @access  Private (Admin/Teacher)
 */
router.post(
  "/health/metrics/:student_id",
  authenticate,
  requireAdminOrTeacher,
  createHealthMetric
);

/**
 * @route   PUT /api/health/metrics/:student_id/:metric_id
 * @desc    Update health metric
 * @access  Private (Admin/Teacher)
 */
router.put(
  "/health/metrics/:student_id/:metric_id",
  authenticate,
  requireAdminOrTeacher,
  updateHealthMetric
);

/**
 * @route   GET /api/health/info/:student_id
 * @desc    Get health info for a student
 * @access  Private (Admin/Teacher/Parent with restrictions)
 */
router.get("/health/info/:student_id", authenticate, getHealthInfo);

/**
 * @route   PUT /api/health/info/:student_id
 * @desc    Update health info for a student
 * @access  Private (Admin/Teacher)
 */
router.put(
  "/health/info/:student_id",
  authenticate,
  requireAdminOrTeacher,
  updateHealthInfo
);

export default router;
