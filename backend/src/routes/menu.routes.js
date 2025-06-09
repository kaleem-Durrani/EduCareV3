import express from "express";
import {
  createWeeklyMenu,
  getAllMenus,
  getCurrentWeeklyMenu,
  getMenuStatistics,
  getMenuById,
  updateWeeklyMenu,
  updateMenuStatus,
  deleteWeeklyMenu,
} from "../controllers/menu.controller.js";
import {
  createMenuValidation,
  updateMenuValidation,
  menuIdValidation,
} from "../validations/menu.validation.js";
import { handleValidationErrors } from "../middleware/validation.middleware.js";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/menus/statistics
 * @desc    Get menu statistics
 * @access  Private (Admin only)
 */
router.get("/menus/statistics", authenticate, requireAdmin, getMenuStatistics);

/**
 * @route   GET /api/menus
 * @desc    Get all menus with pagination, search, and filters
 * @access  Private (Admin only)
 */
router.get("/menus", authenticate, requireAdmin, getAllMenus);

/**
 * @route   GET /api/menu/current
 * @desc    Get current week's menu or active menu
 * @access  Private (All authenticated users)
 */
router.get("/menu/current", authenticate, getCurrentWeeklyMenu);

/**
 * @route   GET /api/menus/:menu_id
 * @desc    Get menu by ID
 * @access  Private (Admin only)
 */
router.get("/menus/:menu_id", authenticate, requireAdmin, getMenuById);

/**
 * @route   POST /api/menus
 * @desc    Create weekly menu
 * @access  Private (Admin only)
 */
router.post(
  "/menus",
  authenticate,
  requireAdmin,
  createMenuValidation,
  handleValidationErrors,
  createWeeklyMenu
);

/**
 * @route   PUT /api/menus/:menu_id
 * @desc    Update weekly menu
 * @access  Private (Admin only)
 */
router.put(
  "/menus/:menu_id",
  authenticate,
  requireAdmin,
  updateMenuValidation,
  handleValidationErrors,
  updateWeeklyMenu
);

/**
 * @route   PUT /api/menus/:menu_id/status
 * @desc    Update menu status
 * @access  Private (Admin only)
 */
router.put(
  "/menus/:menu_id/status",
  authenticate,
  requireAdmin,
  updateMenuStatus
);

/**
 * @route   DELETE /api/menus/:menu_id
 * @desc    Delete weekly menu
 * @access  Private (Admin only)
 */
router.delete(
  "/menus/:menu_id",
  authenticate,
  requireAdmin,
  menuIdValidation,
  handleValidationErrors,
  deleteWeeklyMenu
);

export default router;
