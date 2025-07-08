import express from "express";
import {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getDriverForParent,
  assignStudentToDriver,
  removeStudentFromDriver,
  getDriverStatistics,
} from "../controllers/driver.controller.js";
import {
  authenticate,
  requireAdmin,
  requireAdminOrTeacher,
  requireParent,
} from "../middleware/auth.middleware.js";
import { uploadSingle } from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/drivers/statistics
 * @desc    Get driver statistics
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/drivers/statistics",
  authenticate,
  requireAdminOrTeacher,
  getDriverStatistics
);

/**
 * @route   GET /api/drivers
 * @desc    Get all drivers with pagination and filters
 * @access  Private (Admin/Teacher)
 */
router.get("/drivers", authenticate, requireAdminOrTeacher, getAllDrivers);

/**
 * @route   GET /api/drivers/:driver_id
 * @desc    Get driver by ID
 * @access  Private (Admin/Teacher)
 */
router.get("/drivers/:driver_id", authenticate, requireAdminOrTeacher, getDriverById);

/**
 * @route   POST /api/drivers
 * @desc    Create new driver
 * @access  Private (Admin only)
 */
router.post(
  "/drivers",
  authenticate,
  requireAdmin,
  uploadSingle("drivers"), // For driver photo upload
  createDriver
);

/**
 * @route   PUT /api/drivers/:driver_id
 * @desc    Update driver
 * @access  Private (Admin only)
 */
router.put(
  "/drivers/:driver_id",
  authenticate,
  requireAdmin,
  uploadSingle("drivers"), // For driver photo upload
  updateDriver
);

/**
 * @route   DELETE /api/drivers/:driver_id
 * @desc    Delete driver
 * @access  Private (Admin only)
 */
router.delete("/drivers/:driver_id", authenticate, requireAdmin, deleteDriver);

/**
 * @route   POST /api/drivers/:driver_id/assign-student
 * @desc    Assign student to driver
 * @access  Private (Admin only)
 */
router.post(
  "/drivers/:driver_id/assign-student",
  authenticate,
  requireAdmin,
  assignStudentToDriver
);

/**
 * @route   DELETE /api/drivers/:driver_id/students/:student_id
 * @desc    Remove student from driver
 * @access  Private (Admin only)
 */
router.delete(
  "/drivers/:driver_id/students/:student_id",
  authenticate,
  requireAdmin,
  removeStudentFromDriver
);

/**
 * @route   GET /api/drivers/parent/:student_id
 * @desc    Get driver information for parent's child
 * @access  Private (Parent only)
 */
router.get(
  "/drivers/parent/:student_id",
  authenticate,
  requireParent,
  getDriverForParent
);

export default router;
