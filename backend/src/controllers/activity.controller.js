import Activity from "../models/activity.model.js";
import Class from "../models/class.model.js";
import Student from "../models/student.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
  throwForbidden,
  throwBadRequest,
} from "../utils/transaction.utils.js";

/**
 * Get activities with filtering and pagination
 * GET /api/activities
 * Query params: startDate, endDate, classId, studentId, audienceType, timeFilter, page, limit
 */
export const getActivities = asyncHandler(async (req, res) => {
  const {
    startDate,
    endDate,
    classId,
    studentId,
    audienceType,
    timeFilter,
    page = 1,
    limit = 10
  } = req.query;

  const userId = req.user.id;
  const userRole = req.user.role;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Build base query
  let query = {};

  // Time-based filtering (past, today, upcoming, all)
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

  if (timeFilter) {
    switch (timeFilter) {
      case 'past':
        query.date = { $lt: startOfToday };
        break;
      case 'today':
        query.date = { $gte: startOfToday, $lte: endOfToday };
        break;
      case 'upcoming':
        query.date = { $gt: endOfToday };
        break;
      // 'all' or any other value - no date filter
    }
  }

  // Custom date range filtering (overrides timeFilter if provided)
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  // Audience filtering based on user role and permissions
  if (userRole === "teacher") {
    // Teachers can only see activities for their classes or all students
    const teacherClasses = await Class.find({ teachers: userId }).select("_id");
    const teacherClassIds = teacherClasses.map(c => c._id);

    query.$or = [
      { "audience.type": "all" },
      { "audience.type": "class", "audience.class_id": { $in: teacherClassIds } },
      { "audience.type": "student", "audience.student_id": { $in: await getStudentsInTeacherClasses(teacherClassIds) } }
    ];
  }

  // Additional filtering by specific parameters
  if (audienceType) {
    query["audience.type"] = audienceType;
  }
  if (classId) {
    query["audience.class_id"] = classId;
  }
  if (studentId) {
    query["audience.student_id"] = studentId;
  }

  // Get total count for pagination
  const totalActivities = await Activity.countDocuments(query);
  const totalPages = Math.ceil(totalActivities / limitNum);

  // Get paginated activities
  const activities = await Activity.find(query)
    .populate("audience.class_id", "name")
    .populate("audience.student_id", "fullName rollNum")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .sort({ date: timeFilter === 'past' ? -1 : 1 }) // Past activities: newest first, others: oldest first
    .skip(skip)
    .limit(limitNum);

  const result = {
    activities,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalActivities,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      limit: limitNum
    }
  };

  return sendSuccess(res, result, "Activities retrieved successfully");
});

// Helper function to get students in teacher's classes
async function getStudentsInTeacherClasses(classIds) {
  const students = await Student.find({ current_class: { $in: classIds } }).select("_id");
  return students.map(s => s._id);
}

/**
 * Get specific activity
 * GET /api/activities/:activity_id
 * Admin/Teacher access
 */
export const getActivityById = asyncHandler(async (req, res) => {
  const { activity_id } = req.params;

  const activity = await Activity.findById(activity_id)
    .populate("audience.class_id", "name")
    .populate("audience.student_id", "fullName rollNum")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!activity) {
    throwNotFound("Activity");
  }

  // Check permissions for teachers
  if (req.user.role === "teacher") {
    const hasAccess = await checkTeacherActivityAccess(req.user.id, activity);
    if (!hasAccess) {
      throwForbidden("You don't have access to this activity");
    }
  }

  return sendSuccess(res, activity, "Activity retrieved successfully");
});

// Helper function to check if teacher has access to activity
async function checkTeacherActivityAccess(teacherId, activity) {
  if (activity.audience.type === "all") return true;

  if (activity.audience.type === "class") {
    const classDoc = await Class.findById(activity.audience.class_id);
    return classDoc && classDoc.teachers.includes(teacherId);
  }

  if (activity.audience.type === "student") {
    const student = await Student.findById(activity.audience.student_id).populate("current_class");
    return student && student.current_class && student.current_class.teachers.includes(teacherId);
  }

  return false;
}

/**
 * Create activity
 * POST /api/activities
 * Admin/Teacher access
 */
export const createActivity = asyncHandler(async (req, res) => {
  const { title, description, date, color, audience } = req.body;

  // Validate required fields
  if (!title || !description || !date || !audience || !audience.type) {
    throwBadRequest("Missing required fields: title, description, date, audience.type");
  }

  const result = await withTransaction(async (session) => {
    // Validate audience configuration
    if (audience.type === "class") {
      if (!audience.class_id) {
        throwBadRequest("class_id is required when audience type is 'class'");
      }
      const classDoc = await Class.findById(audience.class_id).session(session);
      if (!classDoc) {
        throwNotFound("Class");
      }
      // Check if teacher has access to this class
      if (req.user.role === "teacher" && !classDoc.teachers.includes(req.user.id)) {
        throwForbidden("You don't have access to this class");
      }
    }

    if (audience.type === "student") {
      if (!audience.student_id) {
        throwBadRequest("student_id is required when audience type is 'student'");
      }
      const student = await Student.findById(audience.student_id).populate("current_class").session(session);
      if (!student) {
        throwNotFound("Student");
      }
      // Check if teacher has access to this student's class
      if (req.user.role === "teacher" &&
          (!student.current_class || !student.current_class.teachers.includes(req.user.id))) {
        throwForbidden("You don't have access to this student");
      }
    }

    const newActivity = new Activity({
      title,
      description,
      date: new Date(date),
      color: color || "#3B82F6",
      audience: {
        type: audience.type,
        class_id: audience.class_id || undefined,
        student_id: audience.student_id || undefined,
      },
      createdBy: req.user.id,
    });

    await newActivity.save({ session });

    const populatedActivity = await Activity.findById(newActivity._id)
      .populate("audience.class_id", "name")
      .populate("audience.student_id", "fullName rollNum")
      .populate("createdBy", "name email")
      .session(session);

    return populatedActivity;
  });

  return sendSuccess(res, result, "Activity created successfully", 201);
});

/**
 * Update activity
 * PUT /api/activities/:activity_id
 * Admin/Teacher access (only creator or admin can update)
 */
export const updateActivity = asyncHandler(async (req, res) => {
  const { activity_id } = req.params;
  const { title, description, date, color, audience } = req.body;

  const result = await withTransaction(async (session) => {
    const activity = await Activity.findById(activity_id).session(session);
    if (!activity) {
      throwNotFound("Activity");
    }

    // Check permissions - only creator or admin can update
    if (req.user.role === "teacher" && activity.createdBy.toString() !== req.user.id) {
      throwForbidden("You can only update activities you created");
    }

    // Build update data
    const updateData = { updatedBy: req.user.id };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);
    if (color !== undefined) updateData.color = color;

    // Handle audience updates
    if (audience !== undefined) {
      if (audience.type === "class") {
        if (!audience.class_id) {
          throwBadRequest("class_id is required when audience type is 'class'");
        }
        const classDoc = await Class.findById(audience.class_id).session(session);
        if (!classDoc) {
          throwNotFound("Class");
        }
        // Check if teacher has access to this class
        if (req.user.role === "teacher" && !classDoc.teachers.includes(req.user.id)) {
          throwForbidden("You don't have access to this class");
        }
      }

      if (audience.type === "student") {
        if (!audience.student_id) {
          throwBadRequest("student_id is required when audience type is 'student'");
        }
        const student = await Student.findById(audience.student_id).populate("current_class").session(session);
        if (!student) {
          throwNotFound("Student");
        }
        // Check if teacher has access to this student's class
        if (req.user.role === "teacher" &&
            (!student.current_class || !student.current_class.teachers.includes(req.user.id))) {
          throwForbidden("You don't have access to this student");
        }
      }

      updateData.audience = {
        type: audience.type,
        class_id: audience.class_id || undefined,
        student_id: audience.student_id || undefined,
      };
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      activity_id,
      updateData,
      { new: true, session }
    )
      .populate("audience.class_id", "name")
      .populate("audience.student_id", "fullName rollNum")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    return updatedActivity;
  });

  return sendSuccess(res, result, "Activity updated successfully");
});

/**
 * Delete activity
 * DELETE /api/activities/:activity_id
 * Admin/Teacher access (only creator or admin can delete)
 */
export const deleteActivity = asyncHandler(async (req, res) => {
  const { activity_id } = req.params;

  const activity = await Activity.findById(activity_id);
  if (!activity) {
    throwNotFound("Activity");
  }

  // Check permissions - only creator or admin can delete
  if (req.user.role === "teacher" && activity.createdBy.toString() !== req.user.id) {
    throwForbidden("You can only delete activities you created");
  }

  await Activity.findByIdAndDelete(activity_id);

  return sendSuccess(res, null, "Activity deleted successfully");
});
