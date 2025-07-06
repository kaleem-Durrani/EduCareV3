import WeeklyReport from "../models/weeklyReport.model.js";
import Student from "../models/student.model.js";
import Class from "../models/class.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
  throwConflict,
  throwForbidden,
  throwBadRequest,
} from "../utils/transaction.utils.js";

/**
 * Create weekly report
 * POST /api/reports/weekly
 * Admin/Teacher only
 */
export const createWeeklyReport = asyncHandler(async (req, res) => {
  const { student_id, weekStart, weekEnd, dailyReports } = req.body;

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

    // Validate week dates (should be exactly 7 days apart)
    const startDate = new Date(weekStart);
    const endDate = new Date(weekEnd);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    if (daysDiff !== 6) {
      throwBadRequest("Week must be exactly 7 days (Monday to Sunday)");
    }

    // Check if report already exists for this student and week
    const existingReport = await WeeklyReport.findOne({
      student_id,
      weekStart: startDate,
    }).session(session);

    if (existingReport) {
      throwConflict("Report already exists for this student and week");
    }

    // Initialize daily reports structure if not provided
    const defaultDailyReports = dailyReports || [
      { day: "M", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
      { day: "T", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
      { day: "W", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
      { day: "Th", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
      { day: "F", toilet: "", food_intake: "", friends_interaction: "", studies_mood: "" },
    ];

    const newReport = new WeeklyReport({
      student_id,
      weekStart: startDate,
      weekEnd: endDate,
      dailyReports: defaultDailyReports,
      createdBy: req.user.id,
    });

    await newReport.save({ session });

    const populatedReport = await WeeklyReport.findById(newReport._id)
      .populate("student_id", "fullName rollNum class")
      .populate("createdBy", "name email")
      .session(session);

    return populatedReport;
  });

  return sendSuccess(res, result, "Weekly report created successfully", 201);
});

/**
 * Get weekly reports for a student
 * GET /api/reports/weekly/:student_id
 * Admin/Teacher/Parent access (with restrictions)
 */
export const getWeeklyReports = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const { weekStart, weekEnd, page = 1, limit = 10 } = req.query;

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

  if (weekStart && weekEnd) {
    query.weekStart = {
      $gte: new Date(weekStart),
      $lte: new Date(weekEnd),
    };
  } else if (weekStart) {
    query.weekStart = { $gte: new Date(weekStart) };
  } else if (weekEnd) {
    query.weekStart = { $lte: new Date(weekEnd) };
  }

  // Calculate pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Get total count for pagination
  const totalReports = await WeeklyReport.countDocuments(query);
  const totalPages = Math.ceil(totalReports / limitNum);

  // Get paginated reports
  const reports = await WeeklyReport.find(query)
    .populate("student_id", "fullName rollNum class")
    .populate("createdBy", "name email")
    .sort({ weekStart: -1 })
    .skip(skip)
    .limit(limitNum);

  const result = {
    reports,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalItems: totalReports,
      itemsPerPage: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };

  return sendSuccess(res, result, "Weekly reports retrieved successfully");
});

/**
 * Update weekly report
 * PUT /api/reports/weekly/:report_id
 * Admin/Teacher only
 */
export const updateWeeklyReport = asyncHandler(async (req, res) => {
  const { report_id } = req.params;
  const { weekStart, weekEnd, dailyReports } = req.body;

  const result = await withTransaction(async (session) => {
    const report = await WeeklyReport.findById(report_id)
      .populate("student_id")
      .session(session);
    if (!report) {
      throwNotFound("Weekly report");
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
        !report.student_id.current_class ||
        !classIds.includes(report.student_id.current_class.toString())
      ) {
        throwForbidden("You don't have access to this student");
      }
    }

    // Update fields
    const updateData = { updatedBy: req.user.id };
    if (weekStart !== undefined) {
      updateData.weekStart = new Date(weekStart);
    }
    if (weekEnd !== undefined) {
      updateData.weekEnd = new Date(weekEnd);
    }
    if (dailyReports !== undefined) {
      // Validate daily reports structure
      const validDays = ["M", "T", "W", "Th", "F"];
      const validatedDailyReports = dailyReports.filter(report =>
        validDays.includes(report.day)
      );
      updateData.dailyReports = validatedDailyReports;
    }
    const updatedReport = await WeeklyReport.findByIdAndUpdate(
      report_id,
      updateData,
      { new: true, session }
    )
      .populate("student_id", "fullName rollNum class")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    return updatedReport;
  });

  return sendSuccess(res, result, "Weekly report updated successfully");
});

/**
 * Delete weekly report
 * DELETE /api/reports/weekly/:report_id
 * Admin/Teacher only
 */
export const deleteWeeklyReport = asyncHandler(async (req, res) => {
  const { report_id } = req.params;

  const result = await withTransaction(async (session) => {
    const report = await WeeklyReport.findById(report_id)
      .populate("student_id")
      .session(session);
    if (!report) {
      throwNotFound("Weekly report");
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
        !report.student_id.current_class ||
        !classIds.includes(report.student_id.current_class.toString())
      ) {
        throwForbidden("You don't have access to this student");
      }
    }

    await WeeklyReport.findByIdAndDelete(report_id).session(session);

    return { deletedId: report_id };
  });

  return sendSuccess(res, result, "Weekly report deleted successfully");
});

/**
 * Create batch reports for a student
 * POST /api/reports/weekly/batch/:student_id
 * Admin/Teacher only
 */
export const createBatchReports = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const { reports } = req.body;

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

    const createdReports = [];
    const errors = [];

    for (let i = 0; i < reports.length; i++) {
      const reportData = reports[i];

      try {
        // Check if report already exists for this week
        const existingReport = await WeeklyReport.findOne({
          student_id,
          weekStart: new Date(reportData.weekStart),
        }).session(session);

        if (existingReport) {
          errors.push({
            index: i,
            weekStart: reportData.weekStart,
            error: "Report already exists for this week",
          });
          continue;
        }

        const newReport = new WeeklyReport({
          student_id,
          weekStart: new Date(reportData.weekStart),
          weekEnd: new Date(reportData.weekEnd),
          activities: reportData.activities || [],
          behavior: reportData.behavior,
          mood: reportData.mood,
          notes: reportData.notes,
          createdBy: req.user.id,
        });

        await newReport.save({ session });

        const populatedReport = await WeeklyReport.findById(newReport._id)
          .populate("student_id", "fullName rollNum class")
          .populate("createdBy", "name email")
          .session(session);

        createdReports.push(populatedReport);
      } catch (error) {
        errors.push({
          index: i,
          weekStart: reportData.weekStart,
          error: error.message,
        });
      }
    }

    return {
      created: createdReports,
      errors: errors,
      summary: {
        total: reports.length,
        created: createdReports.length,
        failed: errors.length,
      },
    };
  });

  if (result.created.length > 0) {
    return sendSuccess(
      res,
      result,
      `Batch report creation completed. ${result.created.length} reports created, ${result.errors.length} failed.`,
      201
    );
  } else {
    throwBadRequest("No reports were created");
  }
});
