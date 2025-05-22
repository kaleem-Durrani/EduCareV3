import User from "../models/user.model.js";
import Student from "../models/student.model.js";
import ParentStudentRelation from "../models/parentStudentRelation.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
  throwConflict,
} from "../utils/transaction.utils.js";

/**
 * Get all parents
 * GET /api/parents/all
 * Admin only
 */
export const getAllParents = asyncHandler(async (req, res) => {
  const parents = await User.find(
    { role: "parent", is_active: true },
    { password_hash: 0, resetPasswordToken: 0, resetPasswordExpires: 0 }
  ).sort({ createdAt: -1 });

  return sendSuccess(res, parents, "Parents retrieved successfully");
});

/**
 * Create parent-student relationship
 * POST /api/student-parent
 * Admin only
 */
export const createParentStudentRelation = asyncHandler(async (req, res) => {
  const { parent_id, student_id, relationshipType = "parent" } = req.body;

  const result = await withTransaction(async (session) => {
    // Check if parent exists and has parent role
    const parent = await User.findOne({
      _id: parent_id,
      role: "parent",
      is_active: true,
    }).session(session);

    if (!parent) {
      throwNotFound("Parent");
    }

    // Check if student exists and is active
    const student = await Student.findOne({
      _id: student_id,
      active: true,
    }).session(session);

    if (!student) {
      throwNotFound("Student");
    }

    // Check if relationship already exists
    const existingRelation = await ParentStudentRelation.findOne({
      parent_id,
      student_id,
      active: true,
    }).session(session);

    if (existingRelation) {
      throwConflict("Relationship already exists");
    }

    // Create new relationship
    const newRelation = new ParentStudentRelation({
      parent_id,
      student_id,
      relationshipType,
      active: true,
    });

    await newRelation.save({ session });

    // Populate the relationship with parent and student details
    const populatedRelation = await ParentStudentRelation.findById(
      newRelation._id
    )
      .populate("parent_id", "name email phone")
      .populate("student_id", "fullName rollNum class")
      .session(session);

    return populatedRelation;
  });

  return sendSuccess(
    res,
    result,
    "Parent-student relationship created successfully",
    201
  );
});
