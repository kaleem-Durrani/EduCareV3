import Activity from "../models/activity.model.js";
import Class from "../models/class.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
  throwForbidden,
} from "../utils/transaction.utils.js";

/**
 * Get activities for a class
 * GET /api/activities/:class_id
 * Filter by month query param
 */
export const getActivities = asyncHandler(async (req, res) => {
  const { class_id } = req.params;
  const { month, year } = req.query;

  // Check if class exists
  const classDoc = await Class.findById(class_id);
  if (!classDoc) {
    throwNotFound("Class");
  }

  // If user is a teacher, check if they're assigned to this class
  if (req.user.role === "teacher" && !classDoc.teachers.includes(req.user.id)) {
    throwForbidden("You don't have access to this class");
  }

  // Build query
  let query = { class_id };

  if (month && year) {
    query.month = parseInt(month);
    query.year = parseInt(year);
  } else if (month) {
    query.month = parseInt(month);
  } else if (year) {
    query.year = parseInt(year);
  }

  const activities = await Activity.find(query)
    .populate("class_id", "name")
    .populate("createdBy", "name email")
    .sort({ date: 1 });

  return sendSuccess(res, activities, "Activities retrieved successfully");
});

/**
 * Get specific activity
 * GET /api/activities/:activity_id
 * Admin/Teacher access
 */
export const getActivityById = asyncHandler(async (req, res) => {
  const { activity_id } = req.params;

  const activity = await Activity.findById(activity_id)
    .populate("class_id", "name")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!activity) {
    throwNotFound("Activity");
  }

  // If user is a teacher, check if they're assigned to this class
  if (
    req.user.role === "teacher" &&
    !activity.class_id.teachers.includes(req.user.id)
  ) {
    throwForbidden("You don't have access to this activity");
  }

  return sendSuccess(res, activity, "Activity retrieved successfully");
});

/**
 * Create activity
 * POST /api/activities
 * Admin only
 */
export const createActivity = asyncHandler(async (req, res) => {
  const { class_id, title, description, date, day, dayColor, month, year } =
    req.body;

  const result = await withTransaction(async (session) => {
    // Check if class exists
    const classDoc = await Class.findById(class_id).session(session);
    if (!classDoc) {
      throwNotFound("Class");
    }

    const activityDate = new Date(date);
    const activityMonth = month || activityDate.getMonth() + 1;
    const activityYear = year || activityDate.getFullYear();

    const newActivity = new Activity({
      class_id,
      title,
      description,
      date: activityDate,
      day,
      dayColor,
      month: activityMonth,
      year: activityYear,
      createdBy: req.user.id,
    });

    await newActivity.save({ session });

    const populatedActivity = await Activity.findById(newActivity._id)
      .populate("class_id", "name")
      .populate("createdBy", "name email")
      .session(session);

    return populatedActivity;
  });

  return sendSuccess(res, result, "Activity created successfully", 201);
});

/**
 * Update activity
 * PUT /api/activities/:activity_id
 * Admin only
 */
export const updateActivity = asyncHandler(async (req, res) => {
  const { activity_id } = req.params;
  const { title, description, date, day, dayColor, month, year } = req.body;

  const result = await withTransaction(async (session) => {
    const activity = await Activity.findById(activity_id).session(session);
    if (!activity) {
      throwNotFound("Activity");
    }

    // Update fields
    const updateData = { updatedBy: req.user.id };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) {
      updateData.date = new Date(date);
      // Update month and year based on new date if not explicitly provided
      if (month === undefined)
        updateData.month = updateData.date.getMonth() + 1;
      if (year === undefined) updateData.year = updateData.date.getFullYear();
    }
    if (day !== undefined) updateData.day = day;
    if (dayColor !== undefined) updateData.dayColor = dayColor;
    if (month !== undefined) updateData.month = month;
    if (year !== undefined) updateData.year = year;

    const updatedActivity = await Activity.findByIdAndUpdate(
      activity_id,
      updateData,
      { new: true, session }
    )
      .populate("class_id", "name")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    return updatedActivity;
  });

  return sendSuccess(res, result, "Activity updated successfully");
});

/**
 * Delete activity
 * DELETE /api/activities/:activity_id
 * Admin only
 */
export const deleteActivity = asyncHandler(async (req, res) => {
  const { activity_id } = req.params;

  const activity = await Activity.findById(activity_id);
  if (!activity) {
    throwNotFound("Activity");
  }

  await Activity.findByIdAndDelete(activity_id);

  return sendSuccess(res, null, "Activity deleted successfully");
});
