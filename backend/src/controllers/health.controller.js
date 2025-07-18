import HealthMetric from "../models/healthMetric.model.js";
import HealthInfo from "../models/healthInfo.model.js";
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
 * Get health statistics for all students
 * GET /api/health/statistics
 * Admin/Teacher only
 */
export const getHealthStatistics = asyncHandler(async (req, res) => {
  // Get total students count
  const totalStudents = await Student.countDocuments();

  // Get students with health info
  const studentsWithHealthInfo = await HealthInfo.countDocuments();

  // Get students with health metrics
  const studentsWithMetrics = await HealthMetric.distinct("student_id").then(
    (ids) => ids.length
  );

  // Get total health metrics count
  const totalMetrics = await HealthMetric.countDocuments();

  // Get recent metrics (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentMetrics = await HealthMetric.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const statistics = {
    totalStudents,
    studentsWithHealthInfo,
    studentsWithMetrics,
    totalMetrics,
    recentMetrics,
    healthInfoCoverage:
      totalStudents > 0
        ? ((studentsWithHealthInfo / totalStudents) * 100).toFixed(1)
        : 0,
    metricsCoverage:
      totalStudents > 0
        ? ((studentsWithMetrics / totalStudents) * 100).toFixed(1)
        : 0,
  };

  return sendSuccess(
    res,
    statistics,
    "Health statistics retrieved successfully"
  );
});

/**
 * Get health metrics for a student
 * GET /api/health/metrics/:student_id
 * Filter by type, period, date range with pagination
 */
export const getHealthMetrics = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const {
    type,
    period,
    dateFrom,
    dateTo,
    page = 1,
    limit = 10,
    sortBy = 'date',
    sortOrder = 'desc'
  } = req.query;

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

  // Type filter
  if (type) {
    query.type = type;
  }

  // Date filtering
  let dateQuery = {};

  // Period filter (takes precedence over custom date range)
  if (period) {
    const now = new Date();
    let startDate;

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "3months":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "6months":
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = null;
    }

    if (startDate) {
      dateQuery.$gte = startDate;
    }
  } else {
    // Custom date range filter
    if (dateFrom) {
      dateQuery.$gte = new Date(dateFrom);
    }
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999); // End of day
      dateQuery.$lte = endDate;
    }
  }

  if (Object.keys(dateQuery).length > 0) {
    query.date = dateQuery;
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Get total count for pagination
  const totalItems = await HealthMetric.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limitNum);

  // Get metrics with pagination
  const metrics = await HealthMetric.find(query)
    .populate("student_id", "fullName rollNum")
    .populate("recordedBy", "name email")
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum);

  // Pagination info
  const pagination = {
    currentPage: pageNum,
    totalPages,
    totalItems,
    itemsPerPage: limitNum,
    hasNextPage: pageNum < totalPages,
    hasPrevPage: pageNum > 1,
  };

  // Format response
  const response = {
    metrics,
    pagination,
    student: {
      _id: student._id,
      fullName: student.fullName,
      rollNum: student.rollNum,
    },
  };

  // Add chart data if type is specified and we have data
  if (type && metrics.length > 0) {
    response.chartData = {
      labels: metrics.map((m) => m.label || m.date.toLocaleDateString()),
      datasets: [
        {
          data: metrics.map((m) => m.value),
          color:
            type === "height"
              ? "(opacity = 1) => `rgba(0, 123, 255, ${opacity})`"
              : type === "weight"
              ? "(opacity = 1) => `rgba(255, 99, 71, ${opacity})`"
              : "(opacity = 1) => `rgba(34, 197, 94, ${opacity})`",
          strokeWidth: 2,
        },
      ],
    };
  }

  return sendSuccess(
    res,
    response,
    "Health metrics retrieved successfully"
  );
});

/**
 * Create health metric for a student
 * POST /api/health/metrics/:student_id
 * Admin/Teacher only
 */
export const createHealthMetric = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const { type, value, unit, label, notes } = req.body;

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

    const newMetric = new HealthMetric({
      student_id,
      type,
      value,
      unit,
      label,
      notes,
      date: new Date(),
      recordedBy: req.user.id,
    });

    await newMetric.save({ session });

    const populatedMetric = await HealthMetric.findById(newMetric._id)
      .populate("student_id", "fullName rollNum")
      .populate("recordedBy", "name email")
      .session(session);

    return populatedMetric;
  });

  return sendSuccess(res, result, "Health metric created successfully", 201);
});

/**
 * Update health metric
 * PUT /api/health/metrics/:student_id/:metric_id
 * Admin/Teacher only
 */
export const updateHealthMetric = asyncHandler(async (req, res) => {
  const { student_id, metric_id } = req.params;
  const { type, value, unit, label, notes } = req.body;

  const result = await withTransaction(async (session) => {
    const metric = await HealthMetric.findOne({
      _id: metric_id,
      student_id,
    })
      .populate("student_id")
      .session(session);

    if (!metric) {
      throwNotFound("Health metric");
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
        !metric.student_id.current_class ||
        !classIds.includes(metric.student_id.current_class.toString())
      ) {
        throwForbidden("You don't have access to this student");
      }
    }

    // Update fields
    const updateData = { updatedBy: req.user.id };
    if (type !== undefined) updateData.type = type;
    if (value !== undefined) updateData.value = value;
    if (unit !== undefined) updateData.unit = unit;
    if (label !== undefined) updateData.label = label;
    if (notes !== undefined) updateData.notes = notes;

    const updatedMetric = await HealthMetric.findByIdAndUpdate(
      metric_id,
      updateData,
      { new: true, session }
    )
      .populate("student_id", "fullName rollNum")
      .populate("recordedBy", "name email")
      .populate("updatedBy", "name email");

    return updatedMetric;
  });

  return sendSuccess(res, result, "Health metric updated successfully");
});

/**
 * Get health info for a student
 * GET /api/health/info/:student_id
 * Admin/Teacher/Parent access (with restrictions)
 */
export const getHealthInfo = asyncHandler(async (req, res) => {
  const { student_id } = req.params;

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

  // Get health info
  let healthInfo = await HealthInfo.findOne({ student_id })
    .populate("student_id", "fullName rollNum")
    .populate("updatedBy", "name email");

  // If no health info exists, create empty one
  if (!healthInfo) {
    healthInfo = new HealthInfo({
      student_id,
      blood_group: "-",
      allergy: "None",
      eye_condition: "-",
      heart_rate: "-",
      ear_condition: "-",
    });

    await healthInfo.save();

    healthInfo = await HealthInfo.findById(healthInfo._id).populate(
      "student_id",
      "fullName rollNum"
    );
  }

  const formattedInfo = {
    id: healthInfo._id,
    student_id: healthInfo.student_id,
    blood_group: healthInfo.blood_group,
    allergy: healthInfo.allergy,
    eye_condition: healthInfo.eye_condition,
    heart_rate: healthInfo.heart_rate,
    ear_condition: healthInfo.ear_condition,
    updatedBy: healthInfo.updatedBy,
    updatedAt: healthInfo.updatedAt,
  };

  return sendSuccess(res, formattedInfo, "Health info retrieved successfully");
});

/**
 * Update health info for a student
 * PUT /api/health/info/:student_id
 * Admin/Teacher only
 */
export const updateHealthInfo = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const { blood_group, allergy, eye_condition, heart_rate, ear_condition } =
    req.body;

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

    // Find or create health info
    let healthInfo = await HealthInfo.findOne({ student_id }).session(session);

    if (!healthInfo) {
      healthInfo = new HealthInfo({ student_id });
    }

    // Update fields
    if (blood_group !== undefined) healthInfo.blood_group = blood_group;
    if (allergy !== undefined) healthInfo.allergy = allergy;
    if (eye_condition !== undefined) healthInfo.eye_condition = eye_condition;
    if (heart_rate !== undefined) healthInfo.heart_rate = heart_rate;
    if (ear_condition !== undefined) healthInfo.ear_condition = ear_condition;

    healthInfo.updatedBy = req.user.id;
    await healthInfo.save({ session });

    const updatedHealthInfo = await HealthInfo.findById(healthInfo._id)
      .populate("student_id", "fullName rollNum")
      .populate("updatedBy", "name email")
      .session(session);

    const formattedInfo = {
      id: updatedHealthInfo._id,
      student_id: updatedHealthInfo.student_id,
      blood_group: updatedHealthInfo.blood_group,
      allergy: updatedHealthInfo.allergy,
      eye_condition: updatedHealthInfo.eye_condition,
      heart_rate: updatedHealthInfo.heart_rate,
      ear_condition: updatedHealthInfo.ear_condition,
      updatedBy: updatedHealthInfo.updatedBy,
      updatedAt: updatedHealthInfo.updatedAt,
    };

    return formattedInfo;
  });

  return sendSuccess(res, result, "Health info updated successfully");
});
