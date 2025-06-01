import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwConflict,
} from "../utils/transaction.utils.js";

/**
 * Get all teachers
 * GET /api/teachers/all
 * Admin only
 */
export const getAllTeachers = asyncHandler(async (req, res) => {
  const teachers = await User.find(
    { role: "teacher", is_active: true },
    { password_hash: 0, resetPasswordToken: 0, resetPasswordExpires: 0 }
  ).sort({ createdAt: -1 });

  return sendSuccess(res, teachers, "Teachers retrieved successfully");
});

/**
 * Create a new teacher
 * POST /api/teacher/create
 * Admin only
 */
export const createTeacher = asyncHandler(async (req, res) => {
  const { email, password, name, phone, address } = req.body;

  const result = await withTransaction(async (session) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      throwConflict("Email already registered");
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create new teacher
    const newTeacher = new User({
      email,
      password_hash,
      role: "teacher",
      name,
      phone,
      address,
      is_active: true,
    });

    await newTeacher.save({ session });

    // Return teacher data without password
    return {
      id: newTeacher._id,
      email: newTeacher.email,
      name: newTeacher.name,
      phone: newTeacher.phone,
      address: newTeacher.address,
      role: newTeacher.role,
      is_active: newTeacher.is_active,
      createdAt: newTeacher.createdAt,
    };
  });

  return sendSuccess(res, result, "Teacher created successfully", 201);
});

/**
 * Get teachers for select options (label/value pairs)
 * GET /api/teachers/select
 * All authenticated users
 */
export const getTeachersForSelect = asyncHandler(async (req, res) => {
  const teachers = await User.find({ role: "teacher", is_active: true })
    .select("name email")
    .sort({ name: 1 })
    .lean();

  const selectOptions = teachers.map((teacher) => ({
    value: teacher._id.toString(),
    label: `${teacher.name} (${teacher.email})`,
  }));

  return sendSuccess(
    res,
    selectOptions,
    "Teachers for select retrieved successfully"
  );
});
