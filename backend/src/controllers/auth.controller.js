import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.utils.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
  throwConflict,
  throwUnauthorized,
} from "../utils/transaction.utils.js";

/**
 * User login
 * POST /api/login
 * Authenticates user with email, password, and role
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  // Find user by email and role
  const user = await User.findOne({ email, role, is_active: true });

  if (!user) {
    throwUnauthorized("Invalid credentials");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throwUnauthorized("Invalid credentials");
  }

  // Generate JWT token
  const token = generateToken({
    user_id: user._id.toString(),
    role: user.role,
  });

  return sendSuccess(
    res,
    {
      access_token: token,
      role: user.role,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
    "Login successful"
  );
});

/**
 * User registration
 * POST /api/register
 * Creates a new user account
 */
export const register = asyncHandler(async (req, res) => {
  const { email, password, role, name, phone, address } = req.body;

  const result = await withTransaction(async (session) => {
    // Check if user already exists
    const existingUser = session
      ? await User.findOne({ email }).session(session)
      : await User.findOne({ email });

    if (existingUser) {
      throwConflict("Email already registered");
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      email,
      password_hash,
      role,
      name,
      phone,
      address,
      is_active: true,
    });

    // Save with or without session
    if (session) {
      await newUser.save({ session });
    } else {
      await newUser.save();
    }

    return {
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    };
  });

  return sendSuccess(res, result, "User registered successfully", 201);
});

/**
 * Forgot password
 * POST /api/forgot-password
 * Initiates password reset process
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email, is_active: true });

  if (!user) {
    throwNotFound("User with this email");
  }

  // In a real application, you would:
  // 1. Generate a password reset token
  // 2. Store the token in the database with expiration
  // 3. Send an email with reset instructions

  // For now, we'll just return a success message
  return sendSuccess(
    res,
    null,
    "Password reset instructions sent to your email"
  );
});

/**
 * Verify token
 * GET /api/verify-token
 * Verifies if the provided JWT token is valid
 */
export const verifyToken = asyncHandler(async (req, res) => {
  // If we reach here, the token is valid (middleware already verified it)
  return sendSuccess(
    res,
    {
      valid: true,
      user: req.user,
    },
    "Token is valid"
  );
});

/**
 * Update user profile
 * PUT /api/update-profile
 * Updates user profile information
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, phone, address } = req.body;

  // Prepare update data
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (phone !== undefined) updateData.phone = phone;
  if (address !== undefined) updateData.address = address;

  // Update user
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    select: "-password_hash",
  });

  if (!updatedUser) {
    throwNotFound("User");
  }

  const result = {
    user: {
      id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: updatedUser.phone,
      address: updatedUser.address,
      role: updatedUser.role,
    },
  };

  return sendSuccess(res, result, "Profile updated successfully");
});
