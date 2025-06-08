import express from "express";
import {
  getAllParents,
  getParentsStatistics,
  getParentsForSelect,
  createParent,
  getParentById,
  updateParent,
  deleteParent,
  createParentStudentRelation,
  updateParentStudentRelation,
  deleteParentStudentRelation,
  getParentChildren,
  serveParentPhoto,
} from "../controllers/parent.controller.js";
import { createParentStudentRelationValidation } from "../validations/parent.validation.js";
import { handleValidationErrors } from "../middleware/validation.middleware.js";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";
import { uploadSingle } from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/parents/statistics
 * @desc    Get parents statistics
 * @access  Private (Admin only)
 */
router.get(
  "/parents/statistics",
  authenticate,
  requireAdmin,
  getParentsStatistics
);

/**
 * @route   GET /api/parents/select
 * @desc    Get parents for select options (label/value pairs)
 * @access  Private (All authenticated users)
 */
router.get("/parents/select", authenticate, getParentsForSelect);

/**
 * @route   GET /api/parents
 * @desc    Get all parents with pagination
 * @access  Private (Admin only)
 */
router.get("/parents", authenticate, requireAdmin, getAllParents);

/**
 * @route   POST /api/parents
 * @desc    Create parent
 * @access  Private (Admin only)
 */
router.post(
  "/parents",
  authenticate,
  requireAdmin,
  uploadSingle("users"),
  createParent
);

/**
 * @route   GET /api/parents/:parent_id
 * @desc    Get parent by ID with children
 * @access  Private (Admin only)
 */
router.get("/parents/:parent_id", authenticate, requireAdmin, getParentById);

/**
 * @route   PUT /api/parents/:parent_id
 * @desc    Update parent
 * @access  Private (Admin only)
 */
router.put(
  "/parents/:parent_id",
  authenticate,
  requireAdmin,
  uploadSingle("users"),
  updateParent
);

/**
 * @route   DELETE /api/parents/:parent_id
 * @desc    Delete parent (soft delete)
 * @access  Private (Admin only)
 */
router.delete("/parents/:parent_id", authenticate, requireAdmin, deleteParent);

/**
 * @route   GET /api/parents/:parent_id/children
 * @desc    Get parent's children relationships
 * @access  Private (Admin only)
 */
router.get(
  "/parents/:parent_id/children",
  authenticate,
  requireAdmin,
  getParentChildren
);

/**
 * @route   POST /api/student-parent
 * @desc    Create parent-student relationship
 * @access  Private (Admin only)
 */
router.post(
  "/student-parent",
  authenticate,
  requireAdmin,
  createParentStudentRelationValidation,
  handleValidationErrors,
  createParentStudentRelation
);

/**
 * @route   PUT /api/parent-student-relations/:relation_id
 * @desc    Update parent-student relationship
 * @access  Private (Admin only)
 */
router.put(
  "/parent-student-relations/:relation_id",
  authenticate,
  requireAdmin,
  updateParentStudentRelation
);

/**
 * @route   DELETE /api/parent-student-relations/:relation_id
 * @desc    Delete parent-student relationship
 * @access  Private (Admin only)
 */
router.delete(
  "/parent-student-relations/:relation_id",
  authenticate,
  requireAdmin,
  deleteParentStudentRelation
);

/**
 * @route   GET /api/users/:user_id/photo
 * @desc    Serve user photo
 * @access  Private (All authenticated users)
 */
router.get("/users/:user_id/photo", authenticate, serveParentPhoto);

export default router;
