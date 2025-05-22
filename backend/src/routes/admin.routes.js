import express from "express";
import { getNumbers } from "../controllers/admin.controller.js";
import { authenticate, requireAdminOrTeacher } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/numbers
 * @desc    Get admin dashboard statistics
 * @access  Private (Admin/Teacher)
 */
router.get("/numbers", authenticate, requireAdminOrTeacher, getNumbers);

export default router;
