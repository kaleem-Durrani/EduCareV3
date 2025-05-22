import express from "express";
import {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../controllers/activity.controller.js";
import {
  authenticate,
  requireAdmin,
  requireAdminOrTeacher,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/activities/class/:class_id
 * @desc    Get activities for a class (filter by month query param)
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/activities/class/:class_id",
  authenticate,
  requireAdminOrTeacher,
  getActivities
);

/**
 * @route   GET /api/activities/:activity_id
 * @desc    Get specific activity
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/activities/:activity_id",
  authenticate,
  requireAdminOrTeacher,
  getActivityById
);

/**
 * @route   POST /api/activities
 * @desc    Create activity
 * @access  Private (Admin only)
 */
router.post("/activities", authenticate, requireAdmin, createActivity);

/**
 * @route   PUT /api/activities/:activity_id
 * @desc    Update activity
 * @access  Private (Admin only)
 */
router.put(
  "/activities/:activity_id",
  authenticate,
  requireAdmin,
  updateActivity
);

/**
 * @route   DELETE /api/activities/:activity_id
 * @desc    Delete activity
 * @access  Private (Admin only)
 */
router.delete(
  "/activities/:activity_id",
  authenticate,
  requireAdmin,
  deleteActivity
);

export default router;
