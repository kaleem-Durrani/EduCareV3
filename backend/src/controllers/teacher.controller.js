import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Class from "../models/class.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwConflict,
  throwNotFound,
} from "../utils/transaction.utils.js";
import fs from "fs";
import path from "path";

/**
 * Get all teachers with pagination
 * GET /api/teachers/all
 * Admin only
 */
export const getAllTeachers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const skip = (page - 1) * limit;

  let query = { role: "teacher", is_active: true };

  // Add search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // Get total count for pagination
  const total = await User.countDocuments(query);

  // Get paginated teachers (without class count for performance)
  const teachers = await User.find(query, {
    password_hash: 0,
    resetPasswordToken: 0,
    resetPasswordExpires: 0,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const result = {
    teachers,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };

  return sendSuccess(res, result, "Teachers retrieved successfully");
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

/**
 * Get teacher statistics
 * GET /api/teachers/statistics
 * Admin only
 */
export const getTeacherStatistics = asyncHandler(async (req, res) => {
  const { year } = req.query;

  // Build query for year filter
  let query = { role: "teacher", is_active: true };
  if (year) {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);
    query.createdAt = { $gte: startDate, $lte: endDate };
  }

  // Get teacher statistics
  const [totalTeachers, activeTeachers, totalEnrollments, teachersWithClasses] =
    await Promise.all([
      User.countDocuments(query),
      User.countDocuments({ ...query, is_active: true }),
      Class.aggregate([
        { $match: { isActive: true } },
        { $project: { teacherCount: { $size: "$teachers" } } },
        { $group: { _id: null, total: { $sum: "$teacherCount" } } },
      ]),
      Class.countDocuments({ teachers: { $ne: [] }, isActive: true }),
    ]);

  const statistics = {
    totalTeachers,
    activeTeachers,
    totalEnrollments: totalEnrollments[0]?.total || 0,
    teachersWithClasses,
    year: year || new Date().getFullYear(),
  };

  return sendSuccess(
    res,
    statistics,
    "Teacher statistics retrieved successfully"
  );
});

/**
 * Get teacher details with enrolled classes
 * GET /api/teachers/:teacher_id/details
 * Admin only
 */
export const getTeacherDetails = asyncHandler(async (req, res) => {
  const { teacher_id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  // Get teacher details
  const teacher = await User.findOne(
    { _id: teacher_id, role: "teacher", is_active: true },
    { password_hash: 0, resetPasswordToken: 0, resetPasswordExpires: 0 }
  );

  if (!teacher) {
    throwNotFound("Teacher");
  }

  // Get classes where this teacher is enrolled with pagination
  const totalClasses = await Class.countDocuments({
    teachers: teacher_id,
    isActive: true,
  });

  const enrolledClasses = await Class.find({
    teachers: teacher_id,
    isActive: true,
  })
    .select("name description students teachers createdAt")
    .populate("students", "fullName rollNum")
    .populate("teachers", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Add counts to each class
  const classesWithCounts = enrolledClasses.map((classDoc) => ({
    ...classDoc.toObject(),
    studentCount: classDoc.students.length,
    teacherCount: classDoc.teachers.length,
  }));

  const result = {
    teacher,
    enrolledClasses: classesWithCounts,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalClasses / limit),
      totalItems: totalClasses,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < Math.ceil(totalClasses / limit),
      hasPrevPage: page > 1,
    },
  };

  return sendSuccess(res, result, "Teacher details retrieved successfully");
});

/**
 * Update teacher photo
 * PUT /api/teachers/:teacher_id/photo
 * Admin only
 */
export const updateTeacherPhoto = asyncHandler(async (req, res) => {
  const { teacher_id } = req.params;

  // Check if teacher exists
  const teacher = await User.findOne({
    _id: teacher_id,
    role: "teacher",
    is_active: true,
  });

  if (!teacher) {
    throwNotFound("Teacher");
  }

  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No photo file provided",
    });
  }

  // Delete old photo if it exists
  if (teacher.photoUrl) {
    const oldPhotoPath = path.join(process.cwd(), "uploads", teacher.photoUrl);
    if (fs.existsSync(oldPhotoPath)) {
      fs.unlinkSync(oldPhotoPath);
    }
  }

  // Update teacher with new photo URL
  const photoUrl = `users/${req.file.filename}`;
  teacher.photoUrl = photoUrl;
  await teacher.save();

  return sendSuccess(
    res,
    { photoUrl: teacher.photoUrl },
    "Teacher photo updated successfully"
  );
});

/**
 * Update teacher information
 * PUT /api/teachers/:teacher_id
 * Admin only
 */
export const updateTeacher = asyncHandler(async (req, res) => {
  const { teacher_id } = req.params;
  const { name, email, phone, address } = req.body;

  // Check if teacher exists
  const teacher = await User.findOne({
    _id: teacher_id,
    role: "teacher",
    is_active: true,
  });

  if (!teacher) {
    throwNotFound("Teacher");
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== teacher.email) {
    const existingUser = await User.findOne({
      email,
      _id: { $ne: teacher_id },
    });

    if (existingUser) {
      throwConflict("Email already registered");
    }
  }

  // Update teacher information
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (address !== undefined) updateData.address = address;

  const updatedTeacher = await User.findByIdAndUpdate(teacher_id, updateData, {
    new: true,
    select: {
      password_hash: 0,
      resetPasswordToken: 0,
      resetPasswordExpires: 0,
    },
  });

  return sendSuccess(
    res,
    updatedTeacher,
    "Teacher information updated successfully"
  );
});
