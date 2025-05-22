import express from "express";
import {
  getAllParents,
  createParentStudentRelation,
} from "../controllers/parent.controller.js";
import { createParentStudentRelationValidation } from "../validations/parent.validation.js";
import { handleValidationErrors } from "../middleware/validation.middleware.js";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/parents/all
 * @desc    Get all parents
 * @access  Private (Admin only)
 */
router.get("/parents/all", authenticate, requireAdmin, getAllParents);

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

export default router;
