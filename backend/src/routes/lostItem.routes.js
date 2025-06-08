import express from "express";
import {
  getLostItems,
  getLostItemsStatistics,
  getLostItemById,
  createLostItem,
  updateLostItem,
  deleteLostItem,
  claimLostItem,
  serveItemImage,
} from "../controllers/lostItem.controller.js";
import upload from "../middleware/upload.middleware.js";
import {
  authenticate,
  requireAdminOrTeacher,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/lost-items/statistics
 * @desc    Get lost items statistics
 * @access  Private (All authenticated users)
 */
router.get("/lost-items/statistics", authenticate, getLostItemsStatistics);

/**
 * @route   GET /api/lost-items
 * @desc    Get all lost items with pagination and filters
 * @access  Private (All authenticated users)
 */
router.get("/lost-items", authenticate, getLostItems);

/**
 * @route   GET /api/lost-items/:item_id
 * @desc    Get specific lost item
 * @access  Private (All authenticated users)
 */
router.get("/lost-items/:item_id", authenticate, getLostItemById);

/**
 * @route   POST /api/lost-items
 * @desc    Create lost item (handles image upload)
 * @access  Private (Admin/Teacher)
 */
router.post(
  "/lost-items",
  authenticate,
  requireAdminOrTeacher,
  upload.single("image"),
  createLostItem
);

/**
 * @route   PUT /api/lost-items/:item_id
 * @desc    Update lost item (handles image update)
 * @access  Private (Admin/Teacher)
 */
router.put(
  "/lost-items/:item_id",
  authenticate,
  requireAdminOrTeacher,
  upload.single("image"),
  updateLostItem
);

/**
 * @route   POST /api/lost-items/:item_id/claim
 * @desc    Claim lost item by parent email
 * @access  Private (Admin/Teacher)
 */
router.post(
  "/lost-items/:item_id/claim",
  authenticate,
  requireAdminOrTeacher,
  claimLostItem
);

/**
 * @route   DELETE /api/lost-items/:item_id
 * @desc    Delete lost item
 * @access  Private (Admin/Teacher)
 */
router.delete(
  "/lost-items/:item_id",
  authenticate,
  requireAdminOrTeacher,
  deleteLostItem
);

/**
 * @route   GET /api/lost-items/:item_id/image
 * @desc    Serve item image
 * @access  Private (All authenticated users)
 */
router.get("/lost-items/:item_id/image", authenticate, serveItemImage);

export default router;
