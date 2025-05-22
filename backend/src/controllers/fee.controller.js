import Fee from "../models/fee.model.js";
import FeeTransaction from "../models/feeTransaction.model.js";
import Student from "../models/student.model.js";
import Class from "../models/class.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
  throwForbidden,
} from "../utils/transaction.utils.js";

/**
 * Get fees for a student
 * GET /api/fees/:student_id
 * Admin/Teacher/Parent access (with restrictions)
 */
export const getStudentFees = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const { status, year } = req.query;

  // Check if student exists
  const student = await Student.findById(student_id);
  if (!student) {
    throwNotFound("Student");
  }

  // Check access permissions
  if (req.user.role === "teacher") {
    const teacherClasses = await Class.find({
      teachers: req.user.id,
      isActive: true,
    }).select("_id");

    const classIds = teacherClasses.map((cls) => cls._id.toString());

    if (
      !student.current_class ||
      !classIds.includes(student.current_class.toString())
    ) {
      throwForbidden("You don't have access to this student");
    }
  } else if (req.user.role === "parent") {
    const ParentStudentRelation = await import(
      "../models/parentStudentRelation.model.js"
    );
    const relation = await ParentStudentRelation.default.findOne({
      parent_id: req.user.id,
      student_id,
      active: true,
    });

    if (!relation) {
      throwForbidden("You don't have access to this student");
    }
  }

  // Build query
  let query = { student_id };

  if (status) {
    query.status = status;
  }

  if (year) {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);
    query.created_at = { $gte: startDate, $lte: endDate };
  }

  const fees = await Fee.find(query)
    .populate("student_id", "fullName rollNum")
    .populate("createdBy", "name email")
    .sort({ deadline: 1 });

  // Format fees
  const formattedFees = fees.map((fee) => ({
    id: fee._id,
    title: fee.title,
    amount: fee.amount,
    deadline: fee.deadline.toLocaleDateString("en-GB"), // DD/MM/YYYY format
    status: fee.status,
    student_id: fee.student_id,
    createdBy: fee.createdBy,
    created_at: fee.created_at,
    updated_at: fee.updated_at,
  }));

  return sendSuccess(res, formattedFees, "Student fees retrieved successfully");
});

/**
 * Create fee
 * POST /api/fees
 * Admin/Teacher only
 */
export const createFee = asyncHandler(async (req, res) => {
  const { student_id, title, amount, deadline, description } = req.body;

  const result = await withTransaction(async (session) => {
    // Check if student exists
    const student = await Student.findById(student_id).session(session);
    if (!student) {
      throwNotFound("Student");
    }

    // If user is a teacher, check if they have access to this student
    if (req.user.role === "teacher") {
      const teacherClasses = await Class.find({
        teachers: req.user.id,
        isActive: true,
      })
        .select("_id")
        .session(session);

      const classIds = teacherClasses.map((cls) => cls._id.toString());

      if (
        !student.current_class ||
        !classIds.includes(student.current_class.toString())
      ) {
        throwForbidden("You don't have access to this student");
      }
    }

    const newFee = new Fee({
      student_id,
      title,
      amount,
      deadline: new Date(deadline),
      description,
      status: "pending",
      createdBy: req.user.id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await newFee.save({ session });

    const populatedFee = await Fee.findById(newFee._id)
      .populate("student_id", "fullName rollNum")
      .populate("createdBy", "name email")
      .session(session);

    return {
      id: populatedFee._id,
      title: populatedFee.title,
      amount: populatedFee.amount,
      deadline: populatedFee.deadline.toLocaleDateString("en-GB"),
      status: populatedFee.status,
      student_id: populatedFee.student_id,
      createdBy: populatedFee.createdBy,
      created_at: populatedFee.created_at,
      updated_at: populatedFee.updated_at,
    };
  });

  return sendSuccess(res, result, "Fee created successfully", 201);
});

/**
 * Update fee status
 * PUT /api/fees/:fee_id/status
 * Admin/Teacher only
 */
export const updateFeeStatus = asyncHandler(async (req, res) => {
  const { fee_id } = req.params;
  const { status, payment_method, transaction_reference, notes } = req.body;

  const result = await withTransaction(async (session) => {
    const fee = await Fee.findById(fee_id)
      .populate("student_id")
      .session(session);
    if (!fee) {
      throwNotFound("Fee");
    }

    // If user is a teacher, check if they have access to this student
    if (req.user.role === "teacher") {
      const teacherClasses = await Class.find({
        teachers: req.user.id,
        isActive: true,
      })
        .select("_id")
        .session(session);

      const classIds = teacherClasses.map((cls) => cls._id.toString());

      if (
        !fee.student_id.current_class ||
        !classIds.includes(fee.student_id.current_class.toString())
      ) {
        throwForbidden("You don't have access to this student");
      }
    }

    // Update fee status
    fee.status = status;
    fee.updated_at = new Date();
    await fee.save({ session });

    // Create transaction record if status is paid
    if (status === "paid") {
      const FeeTransaction = (await import("../models/feeTransaction.model.js"))
        .default;
      const transaction = new FeeTransaction({
        fee_id,
        amount: fee.amount,
        payment_method: payment_method || "cash",
        transaction_reference,
        notes,
        processed_by: req.user.id,
        created_at: new Date(),
      });

      await transaction.save({ session });
    }

    const updatedFee = await Fee.findById(fee_id)
      .populate("student_id", "fullName rollNum")
      .populate("createdBy", "name email")
      .session(session);

    return {
      id: updatedFee._id,
      title: updatedFee.title,
      amount: updatedFee.amount,
      deadline: updatedFee.deadline.toLocaleDateString("en-GB"),
      status: updatedFee.status,
      student_id: updatedFee.student_id,
      createdBy: updatedFee.createdBy,
      created_at: updatedFee.created_at,
      updated_at: updatedFee.updated_at,
    };
  });

  return sendSuccess(res, result, "Fee status updated successfully");
});

/**
 * Get fee summary for a student
 * GET /api/fees/summary/:student_id
 * Admin/Teacher/Parent access (with restrictions)
 */
export const getFeeSummary = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const { year } = req.query;

  // Check if student exists
  const student = await Student.findById(student_id);
  if (!student) {
    throwNotFound("Student");
  }

  // Check access permissions
  if (req.user.role === "teacher") {
    const teacherClasses = await Class.find({
      teachers: req.user.id,
      isActive: true,
    }).select("_id");

    const classIds = teacherClasses.map((cls) => cls._id.toString());

    if (
      !student.current_class ||
      !classIds.includes(student.current_class.toString())
    ) {
      throwForbidden("You don't have access to this student");
    }
  } else if (req.user.role === "parent") {
    const ParentStudentRelation = await import(
      "../models/parentStudentRelation.model.js"
    );
    const relation = await ParentStudentRelation.default.findOne({
      parent_id: req.user.id,
      student_id,
      active: true,
    });

    if (!relation) {
      throwForbidden("You don't have access to this student");
    }
  }

  // Build query
  let query = { student_id };

  if (year) {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);
    query.created_at = { $gte: startDate, $lte: endDate };
  }

  // Get fee statistics
  const [
    totalFees,
    paidFees,
    pendingFees,
    overdueFees,
    totalAmount,
    paidAmount,
    pendingAmount,
  ] = await Promise.all([
    Fee.countDocuments(query),
    Fee.countDocuments({ ...query, status: "paid" }),
    Fee.countDocuments({ ...query, status: "pending" }),
    Fee.countDocuments({
      ...query,
      status: "pending",
      deadline: { $lt: new Date() },
    }),
    Fee.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Fee.aggregate([
      { $match: { ...query, status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Fee.aggregate([
      { $match: { ...query, status: "pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const summary = {
    student: {
      id: student._id,
      fullName: student.fullName,
      rollNum: student.rollNum,
    },
    fees: {
      total: totalFees,
      paid: paidFees,
      pending: pendingFees,
      overdue: overdueFees,
    },
    amounts: {
      total: totalAmount[0]?.total || 0,
      paid: paidAmount[0]?.total || 0,
      pending: pendingAmount[0]?.total || 0,
    },
    year: year || new Date().getFullYear(),
  };

  return sendSuccess(res, summary, "Fee summary retrieved successfully");
});
