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
  requireAdminOrTeacher,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/activities
 * @desc    Get activities (with filtering by date range, class, student)
 * @access  Private (Admin/Teacher)
 */
router.get("/activities", authenticate, requireAdminOrTeacher, getActivities);

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
 * @access  Private (Admin/Teacher)
 */
router.post("/activities", authenticate, requireAdminOrTeacher, createActivity);

/**
 * @route   PUT /api/activities/:activity_id
 * @desc    Update activity
 * @access  Private (Admin/Teacher)
 */
router.put(
  "/activities/:activity_id",
  authenticate,
  requireAdminOrTeacher,
  updateActivity
);

/**
 * @route   DELETE /api/activities/:activity_id
 * @desc    Delete activity
 * @access  Private (Admin/Teacher)
 */
router.delete(
  "/activities/:activity_id",
  authenticate,
  requireAdminOrTeacher,
  deleteActivity
);

export default router;
