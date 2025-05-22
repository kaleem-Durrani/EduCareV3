import User from "../models/user.model.js";
import Student from "../models/student.model.js";
import Class from "../models/class.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import { asyncHandler } from "../utils/transaction.utils.js";

/**
 * Get admin dashboard statistics
 * GET /api/numbers
 * Returns counts of various entities for admin dashboard
 */
export const getNumbers = asyncHandler(async (req, res) => {
  // Get counts of different entities
  const [
    totalStudents,
    totalTeachers,
    totalParents,
    totalClasses,
    activeStudents,
    activeClasses,
  ] = await Promise.all([
    Student.countDocuments(),
    User.countDocuments({ role: "teacher", is_active: true }),
    User.countDocuments({ role: "parent", is_active: true }),
    Class.countDocuments(),
    Student.countDocuments({ active: true }),
    Class.countDocuments({ isActive: true }),
  ]);

  const stats = {
    students: {
      total: totalStudents,
      active: activeStudents,
      inactive: totalStudents - activeStudents,
    },
    teachers: {
      total: totalTeachers,
      active: totalTeachers, // All teachers are considered active if is_active is true
    },
    parents: {
      total: totalParents,
      active: totalParents, // All parents are considered active if is_active is true
    },
    classes: {
      total: totalClasses,
      active: activeClasses,
      inactive: totalClasses - activeClasses,
    },
  };

  return sendSuccess(res, stats, "Statistics retrieved successfully");
});
