import BoxItem from "../models/boxItem.model.js";
import StudentBoxStatus from "../models/studentBoxStatus.model.js";
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
 * Get all possible box items, initializes defaults if none exist
 * GET /api/box/items
 * All authenticated users
 */
export const getBoxItems = asyncHandler(async (req, res) => {
  let boxItems = await BoxItem.find().sort({ name: 1 });

  // Initialize default items if none exist
  if (boxItems.length === 0) {
    const defaultItems = [
      { name: "Lunch Box", description: "Daily lunch container" },
      { name: "Water Bottle", description: "Water bottle for hydration" },
      { name: "Backpack", description: "School backpack" },
      { name: "Jacket", description: "Jacket or sweater" },
      { name: "Hat", description: "Hat or cap" },
      { name: "Shoes", description: "Extra pair of shoes" },
      { name: "Toys", description: "Personal toys" },
      { name: "Books", description: "Personal books" },
      { name: "Art Supplies", description: "Crayons, markers, etc." },
      { name: "Blanket", description: "Nap time blanket" },
    ];

    boxItems = await BoxItem.insertMany(defaultItems);
  }

  return sendSuccess(res, boxItems, "Box items retrieved successfully");
});

/**
 * Get paginated box items
 * GET /api/box/items/paginated
 * Admin/Teacher only
 */
export const getPaginatedBoxItems = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Get paginated box items
  const boxItems = await BoxItem.find()
    .sort({ createdAt: -1 }) // Most recent first
    .skip(skip)
    .limit(limit);

  const totalBoxItems = await BoxItem.countDocuments();

  const result = {
    boxItems,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalBoxItems / limit),
      totalBoxItems,
      hasNextPage: page < Math.ceil(totalBoxItems / limit),
      hasPrevPage: page > 1,
    },
  };

  return sendSuccess(res, result, "Paginated box items retrieved successfully");
});

/**
 * Get a student's box status
 * GET /api/box/student/:student_id
 * Admin/Teacher/Parent access (with restrictions)
 */
export const getStudentBoxStatus = asyncHandler(async (req, res) => {
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

  // Get student's box status
  let boxStatus = await StudentBoxStatus.findOne({ student_id })
    .populate("student_id", "fullName rollNum")
    .populate("items.item_id", "name description");

  // If no box status exists, create one with all items set to false
  if (!boxStatus) {
    const allItems = await BoxItem.find();
    const itemStatuses = allItems.map((item) => ({
      item_id: item._id,
      has_item: false,
      notes: "",
    }));

    boxStatus = new StudentBoxStatus({
      student_id,
      items: itemStatuses,
    });

    await boxStatus.save();

    boxStatus = await StudentBoxStatus.findById(boxStatus._id)
      .populate("student_id", "fullName rollNum")
      .populate("items.item_id", "name description");
  }

  return sendSuccess(
    res,
    boxStatus,
    "Student box status retrieved successfully"
  );
});

/**
 * Update a student's box status
 * PUT /api/box/student/:student_id
 * Admin/Teacher only
 */
export const updateStudentBoxStatus = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const { items } = req.body;

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

    // Find or create box status
    let boxStatus = await StudentBoxStatus.findOne({ student_id }).session(
      session
    );

    if (!boxStatus) {
      boxStatus = new StudentBoxStatus({
        student_id,
        items: [],
      });
    }

    // Update items
    boxStatus.items = items;
    boxStatus.updatedBy = req.user.id;
    await boxStatus.save({ session });

    const updatedBoxStatus = await StudentBoxStatus.findById(boxStatus._id)
      .populate("student_id", "fullName rollNum")
      .populate("items.item_id", "name description")
      .populate("updatedBy", "name email")
      .session(session);

    return updatedBoxStatus;
  });

  return sendSuccess(res, result, "Student box status updated successfully");
});

/**
 * Get box statistics (REAL-TIME)
 * GET /api/box/statistics
 * Admin/Teacher only
 */
export const getBoxStatistics = asyncHandler(async (req, res) => {
  // Get all students count
  const totalStudents = await Student.countDocuments({ active: true });

  // Get all box items
  const boxItems = await BoxItem.find();
  const totalBoxItems = boxItems.length;

  // Get all student box statuses
  const allStudentBoxStatuses = await StudentBoxStatus.find({}).populate(
    "student_id",
    "_id"
  );

  // Calculate statistics
  let totalItemsWithStudents = 0;
  let studentsWithBoxStatus = 0;
  let totalItemsChecked = 0;

  allStudentBoxStatuses.forEach((boxStatus) => {
    if (boxStatus.items && boxStatus.items.length > 0) {
      studentsWithBoxStatus++;
      const checkedItems = boxStatus.items.filter((item) => item.has_item);
      totalItemsChecked += checkedItems.length;
      totalItemsWithStudents += boxStatus.items.length;
    }
  });

  const maxPossibleItems = totalStudents * totalBoxItems;
  const overallCompletion =
    maxPossibleItems > 0
      ? Math.round((totalItemsChecked / maxPossibleItems) * 100)
      : 0;

  const statistics = {
    totalStudents,
    totalBoxItems,
    totalItemsChecked,
    overallCompletion,
    studentsWithBoxStatus,
    lastCalculated: new Date(),
  };

  return sendSuccess(res, statistics, "Box statistics retrieved successfully");
});

/**
 * Get paginated students with box status statistics
 * GET /api/box/students/paginated
 * Admin/Teacher only
 */
export const getPaginatedStudentsBoxStatus = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Get paginated students
  const students = await Student.find({ active: true })
    .populate("current_class", "name")
    .select("fullName rollNum current_class")
    .sort({ fullName: 1 })
    .skip(skip)
    .limit(limit);

  const totalStudents = await Student.countDocuments({ active: true });

  // Get box items
  const boxItems = await BoxItem.find();

  // Get box statuses only for current page students (EFFICIENT!)
  const studentIds = students.map((s) => s._id);
  const studentBoxStatuses = await StudentBoxStatus.find({
    student_id: { $in: studentIds },
  }).populate("student_id", "_id");

  // Create lookup map
  const boxStatusMap = {};
  studentBoxStatuses.forEach((status) => {
    boxStatusMap[status.student_id._id.toString()] = status;
  });

  // Calculate stats for current page students only
  const studentsWithStats = students.map((student) => {
    const boxStatus = boxStatusMap[student._id.toString()];

    let totalItems = boxItems.length;
    let checkedItems = 0;
    let lastUpdated = null;

    if (boxStatus && boxStatus.items) {
      checkedItems = boxStatus.items.filter((item) => item.has_item).length;
      lastUpdated = boxStatus.updatedAt;
    }

    return {
      ...student.toObject(),
      boxStats: {
        totalItems,
        checkedItems,
        completionPercentage:
          totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0,
        lastUpdated,
      },
    };
  });

  const result = {
    students: studentsWithStats,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalStudents / limit),
      totalStudents,
      hasNextPage: page < Math.ceil(totalStudents / limit),
      hasPrevPage: page > 1,
    },
  };

  return sendSuccess(
    res,
    result,
    "Paginated students box status retrieved successfully"
  );
});
