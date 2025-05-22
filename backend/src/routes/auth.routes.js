import express from "express";
import {
  login,
  register,
  forgotPassword,
  verifyToken,
  updateProfile,
} from "../controllers/auth.controller.js";
import {
  loginValidation,
  registerValidation,
  forgotPasswordValidation,
  updateProfileValidation,
} from "../validations/auth.validation.js";
import { handleValidationErrors } from "../middleware/validation.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/login
 * @desc    User login
 * @access  Public
 */
router.post("/login", loginValidation, handleValidationErrors, login);

/**
 * @route   POST /api/register
 * @desc    User registration
 * @access  Public
 */
router.post("/register", registerValidation, handleValidationErrors, register);

/**
 * @route   POST /api/forgot-password
 * @desc    Forgot password
 * @access  Public
 */
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  handleValidationErrors,
  forgotPassword
);

/**
 * @route   GET /api/verify-token
 * @desc    Verify JWT token
 * @access  Private
 */
router.get("/verify-token", authenticate, verifyToken);

/**
 * @route   PUT /api/update-profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  "/update-profile",
  authenticate,
  updateProfileValidation,
  handleValidationErrors,
  updateProfile
);

export default router;
