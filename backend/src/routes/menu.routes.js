import express from "express";
import {
  createWeeklyMenu,
  getCurrentWeeklyMenu,
  updateWeeklyMenu,
  deleteWeeklyMenu,
} from "../controllers/menu.controller.js";
import {
  createMenuValidation,
  updateMenuValidation,
  menuIdValidation,
} from "../validations/menu.validation.js";
import { handleValidationErrors } from "../middleware/validation.middleware.js";
import {
  authenticate,
  requireAdmin,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/menu/weekly
 * @desc    Create weekly menu
 * @access  Private (Admin only)
 */
router.post(
  "/menu/weekly",
  authenticate,
  requireAdmin,
  createMenuValidation,
  handleValidationErrors,
  createWeeklyMenu
);

/**
 * @route   GET /api/menu/weekly
 * @desc    Get current week's menu
 * @access  Private (All authenticated users)
 */
router.get("/menu/weekly", authenticate, getCurrentWeeklyMenu);

/**
 * @route   PUT /api/menu/weekly/:menu_id
 * @desc    Update weekly menu
 * @access  Private (Admin only)
 */
router.put(
  "/menu/weekly/:menu_id",
  authenticate,
  requireAdmin,
  updateMenuValidation,
  handleValidationErrors,
  updateWeeklyMenu
);

/**
 * @route   DELETE /api/menu/weekly/:menu_id
 * @desc    Delete weekly menu
 * @access  Private (Admin only)
 */
router.delete(
  "/menu/weekly/:menu_id",
  authenticate,
  requireAdmin,
  menuIdValidation,
  handleValidationErrors,
  deleteWeeklyMenu
);

export default router;
