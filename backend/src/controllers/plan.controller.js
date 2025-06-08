import MonthlyPlan from "../models/monthlyPlan.model.js";
import Class from "../models/class.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import { deleteUploadedFile } from "../utils/file.utils.js";
import { normalizePath } from "../middleware/upload.middleware.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
  throwConflict,
  throwForbidden,
  throwBadRequest,
} from "../utils/transaction.utils.js";

/**
 * Create monthly plan
 * POST /api/plans/monthly
 * Admin/Teacher only
 */
export const createMonthlyPlan = asyncHandler(async (req, res) => {
  const { class_id, month, year, description } = req.body;

  // Debug logging
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);

  // Handle uploaded file (store full path including uploads/)
  const imageUrl = req.file ? normalizePath(req.file.path) : null;
  console.log("Processed imageUrl:", imageUrl);

  const result = await withTransaction(async (session) => {
    // Check if class exists
    const classDoc = await Class.findById(class_id).session(session);
    if (!classDoc) {
      throwNotFound("Class");
    }

    // If user is a teacher, check if they're assigned to this class
    if (
      req.user.role === "teacher" &&
      !classDoc.teachers.includes(req.user.id)
    ) {
      throwForbidden("You don't have access to this class");
    }

    // Check if plan already exists for this class, month, and year
    const existingPlan = await MonthlyPlan.findOne({
      class_id,
      month,
      year,
    }).session(session);

    if (existingPlan) {
      throwConflict(
        "Monthly plan already exists for this class, month, and year"
      );
    }

    const newPlan = new MonthlyPlan({
      class_id,
      month,
      year,
      description,
      imageUrl,
      createdBy: req.user.id,
    });

    await newPlan.save({ session });

    const populatedPlan = await MonthlyPlan.findById(newPlan._id)
      .populate("class_id", "name")
      .populate("createdBy", "name email")
      .session(session);

    return populatedPlan;
  });

  return sendSuccess(res, result, "Monthly plan created successfully", 201);
});

/**
 * Get monthly plan for a class
 * GET /api/plans/monthly/:class_id
 * Query params: month, year
 */
export const getMonthlyPlan = asyncHandler(async (req, res) => {
  const { class_id } = req.params;
  const { month, year } = req.query;

  if (!month || !year) {
    throwBadRequest("Month and year query parameters are required");
  }

  // Check if class exists
  const classDoc = await Class.findById(class_id);
  if (!classDoc) {
    throwNotFound("Class");
  }

  // If user is a teacher, check if they're assigned to this class
  if (req.user.role === "teacher" && !classDoc.teachers.includes(req.user.id)) {
    throwForbidden("You don't have access to this class");
  }

  const plan = await MonthlyPlan.findOne({
    class_id,
    month: parseInt(month),
    year: parseInt(year),
  })
    .populate("class_id", "name")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!plan) {
    throwNotFound("Monthly plan");
  }

  return sendSuccess(res, plan, "Monthly plan retrieved successfully");
});

/**
 * Update monthly plan
 * PUT /api/plans/monthly/:plan_id
 * Admin/Teacher only
 */
export const updateMonthlyPlan = asyncHandler(async (req, res) => {
  const { plan_id } = req.params;
  const { description } = req.body;

  // Handle uploaded file (store full path including uploads/)
  const newImageUrl = req.file ? normalizePath(req.file.path) : null;

  const result = await withTransaction(async (session) => {
    const plan = await MonthlyPlan.findById(plan_id)
      .populate("class_id")
      .session(session);
    if (!plan) {
      throwNotFound("Monthly plan");
    }

    // If user is a teacher, check if they're assigned to this class
    if (
      req.user.role === "teacher" &&
      !plan.class_id.teachers.includes(req.user.id)
    ) {
      throwForbidden("You don't have access to this class");
    }

    // Handle image update and deletion of old image
    const updateData = { updatedBy: req.user.id };
    if (description !== undefined) updateData.description = description;

    // If new image is uploaded, delete old image and update
    if (newImageUrl) {
      // Delete old image if it exists
      if (plan.imageUrl) {
        deleteUploadedFile(plan.imageUrl);
      }
      updateData.imageUrl = newImageUrl;
    }

    const updatedPlan = await MonthlyPlan.findByIdAndUpdate(
      plan_id,
      updateData,
      { new: true, session }
    )
      .populate("class_id", "name")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    return updatedPlan;
  });

  return sendSuccess(res, result, "Monthly plan updated successfully");
});

/**
 * Delete monthly plan
 * DELETE /api/plans/monthly/:plan_id
 * Admin/Teacher only
 */
export const deleteMonthlyPlan = asyncHandler(async (req, res) => {
  const { plan_id } = req.params;

  const plan = await MonthlyPlan.findById(plan_id).populate("class_id");
  if (!plan) {
    throwNotFound("Monthly plan");
  }

  // If user is a teacher, check if they're assigned to this class
  if (
    req.user.role === "teacher" &&
    !plan.class_id.teachers.includes(req.user.id)
  ) {
    throwForbidden("You don't have access to this class");
  }

  // Delete associated image file if it exists
  if (plan.imageUrl) {
    deleteUploadedFile(plan.imageUrl);
  }

  await MonthlyPlan.findByIdAndDelete(plan_id);

  return sendSuccess(res, null, "Monthly plan deleted successfully");
});

/**
 * List all plans for a class
 * GET /api/plans/monthly/:class_id/list
 * Query params: year (optional)
 */
export const listMonthlyPlans = asyncHandler(async (req, res) => {
  const { class_id } = req.params;
  const { year } = req.query;

  // Check if class exists
  const classDoc = await Class.findById(class_id);
  if (!classDoc) {
    throwNotFound("Class");
  }

  // If user is a teacher, check if they're assigned to this class
  if (req.user.role === "teacher" && !classDoc.teachers.includes(req.user.id)) {
    throwForbidden("You don't have access to this class");
  }

  let query = { class_id };
  if (year) {
    query.year = parseInt(year);
  }

  const plans = await MonthlyPlan.find(query)
    .populate("class_id", "name")
    .populate("createdBy", "name email")
    .sort({ year: -1, month: -1 });

  return sendSuccess(res, plans, "Monthly plans retrieved successfully");
});
