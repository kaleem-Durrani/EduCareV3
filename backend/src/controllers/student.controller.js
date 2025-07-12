import Student from "../models/student.model.js";
import Class from "../models/class.model.js";
import StudentClassHistory from "../models/studentClassHistory.model.js";
import ParentStudentRelation from "../models/parentStudentRelation.model.js";
import {
  sendSuccess,
  sendError,
  sendNotFound,
  sendForbidden,
} from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
  throwConflict,
  throwForbidden,
} from "../utils/transaction.utils.js";
import { normalizePath } from "../middleware/upload.middleware.js";
import fs from "fs";
import path from "path";

/**
 * Get all students with pagination
 * GET /api/students
 * Admin/Teacher access
 */
export const getAllStudents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status = "active" } = req.query;
  const skip = (page - 1) * limit;

  let query = {};

  // Handle status filter
  if (status === "active") {
    query.active = true;
  } else if (status === "inactive") {
    query.active = false;
  }
  // If status === "all", don't add active filter

  // If user is a teacher, only show students from their classes
  if (req.user.role === "teacher") {
    const teacherClasses = await Class.find({
      teachers: req.user.id,
      isActive: true,
    }).select("_id");

    const classIds = teacherClasses.map((cls) => cls._id);
    query.current_class = { $in: classIds };
  }

  // Add search functionality
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { rollNum: parseInt(search) || 0 },
    ];
  }

  // Get total count for pagination
  const total = await Student.countDocuments(query);

  // Get paginated students
  const students = await Student.find(query)
    .populate("current_class", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const result = {
    students,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };

  return sendSuccess(res, result, "Students retrieved successfully");
});

/**
 * Get student by ID (detailed view for modals)
 * GET /api/students/:student_id
 * Admin/Teacher access
 */
export const getStudentById = asyncHandler(async (req, res) => {
  const { student_id } = req.params;

  const student = await Student.findById(student_id).populate([
    {
      path: "current_class",
      select: "name grade section",
    },
  ]);

  if (!student) {
    return sendNotFound(res, "Student not found");
  }

  sendSuccess(res, student, "Student retrieved successfully");
});

/**
 * Create a new student
 * POST /api/student
 * Admin only
 */
export const createStudent = asyncHandler(async (req, res) => {
  const {
    fullName,
    class: className,
    birthdate,
    rollNum,
    allergies,
    likes,
    additionalInfo,
    authorizedPhotos,
    schedule,
    photoUrl,
    contacts,
  } = req.body;

  const result = await withTransaction(async (session) => {
    // Generate roll number if not provided
    let finalRollNum = rollNum;
    if (!finalRollNum) {
      const lastStudent = await Student.findOne()
        .sort({ rollNum: -1 })
        .session(session);
      finalRollNum = lastStudent ? lastStudent.rollNum + 1 : 1001;
    } else {
      // Check if roll number already exists
      const existingStudent = await Student.findOne({
        rollNum: finalRollNum,
      }).session(session);
      if (existingStudent) {
        throwConflict("Roll number already exists");
      }
    }

    const newStudent = new Student({
      fullName,
      class: className,
      birthdate: new Date(birthdate),
      rollNum: finalRollNum,
      allergies: allergies || [],
      likes: likes || [],
      additionalInfo,
      authorizedPhotos: authorizedPhotos || false,
      schedule: schedule || {
        time: "08:00 - 12:30",
        days: "Monday to Friday",
      },
      photoUrl,
      contacts: contacts || [],
      active: true,
    });

    await newStudent.save({ session });

    return newStudent;
  });

  return sendSuccess(res, result, "Student created successfully", 201);
});

/**
 * Update student
 * PUT /api/students/:student_id
 * Admin only - uses MongoDB _id for lookup
 */
export const updateStudent = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const updateData = req.body;

  const result = await withTransaction(async (session) => {
    // Find student by _id
    const student = await Student.findById(student_id).session(session);

    if (!student) {
      throwNotFound("Student");
    }

    // Check if new roll number conflicts with existing student
    if (updateData.rollNum && updateData.rollNum !== student.rollNum) {
      const existingStudent = await Student.findOne({
        rollNum: updateData.rollNum,
        _id: { $ne: student._id },
      }).session(session);
      if (existingStudent) {
        throwConflict("Roll number already exists");
      }
    }

    // Update birthdate if provided
    if (updateData.birthdate) {
      updateData.birthdate = new Date(updateData.birthdate);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      student._id,
      updateData,
      { new: true, session }
    ).populate("current_class", "name");

    return updatedStudent;
  });

  return sendSuccess(res, result, "Student updated successfully");
});

/**
 * Enroll student in a class
 * POST /api/students/:student_id/enroll
 * Admin only
 */
export const enrollStudent = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const { class_id, academic_year } = req.body;

  const result = await withTransaction(async (session) => {
    // Check if student exists
    const student = await Student.findById(student_id).session(session);
    if (!student) {
      throw new Error("Student not found");
    }

    // Check if class exists
    const classDoc = await Class.findById(class_id).session(session);
    if (!classDoc) {
      throw new Error("Class not found");
    }

    // Set academic year if not provided
    const currentYear = new Date().getFullYear();
    const finalAcademicYear =
      academic_year || `${currentYear}-${currentYear + 1}`;

    // Check if student is already enrolled in this class for this academic year
    const existingEnrollment = await StudentClassHistory.findOne({
      student_id,
      class_id,
      academic_year: finalAcademicYear,
    }).session(session);

    if (existingEnrollment) {
      throw new Error(
        "Student is already enrolled in this class for this academic year"
      );
    }

    // Create enrollment record
    const enrollment = new StudentClassHistory({
      student_id,
      class_id,
      academic_year: finalAcademicYear,
      enrollment_date: new Date(),
      status: "active",
    });

    await enrollment.save({ session });

    // Update student's current class
    student.current_class = class_id;
    student.current_academic_year = finalAcademicYear;
    await student.save({ session });

    // Add student to class if not already there
    if (!classDoc.students.includes(student_id)) {
      classDoc.students.push(student_id);
      await classDoc.save({ session });
    }

    const populatedEnrollment = await StudentClassHistory.findById(
      enrollment._id
    )
      .populate("student_id", "fullName rollNum")
      .populate("class_id", "name")
      .session(session);

    return populatedEnrollment;
  });

  return sendSuccess(res, result, "Student enrolled successfully", 201);
});

/**
 * Get student enrollment history
 * GET /api/students/:student_id/enrollment-history
 * Admin/Teacher access
 */
export const getStudentEnrollmentHistory = asyncHandler(async (req, res) => {
  const { student_id } = req.params;

  // Check if student exists
  const student = await Student.findById(student_id);
  if (!student) {
    throwNotFound("Student");
  }

  // If user is a teacher, check if they have access to this student
  if (req.user.role === "teacher") {
    const teacherClasses = await Class.find({
      teachers: req.user.id,
      isActive: true,
    }).select("_id");

    const classIds = teacherClasses.map((cls) => cls._id.toString());

    if (
      student.current_class &&
      !classIds.includes(student.current_class.toString())
    ) {
      throwForbidden("You don't have access to this student");
    }
  }

  const enrollmentHistory = await StudentClassHistory.find({ student_id })
    .populate("class_id", "name")
    .sort({ enrollment_date: -1 });

  return sendSuccess(
    res,
    enrollmentHistory,
    "Enrollment history retrieved successfully"
  );
});

/**
 * Transfer student to another class
 * POST /api/students/:student_id/transfer
 * Admin only
 */
export const transferStudent = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const { new_class_id, reason } = req.body;

  const result = await withTransaction(async (session) => {
    // Check if student exists
    const student = await Student.findById(student_id).session(session);
    if (!student) {
      throw new Error("Student not found");
    }

    // Check if new class exists
    const newClass = await Class.findById(new_class_id).session(session);
    if (!newClass) {
      throw new Error("New class not found");
    }

    // Check if student is already in the new class
    if (
      student.current_class &&
      student.current_class.toString() === new_class_id
    ) {
      throw new Error("Student is already in this class");
    }

    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;

    // End current enrollment if exists
    if (student.current_class) {
      await StudentClassHistory.findOneAndUpdate(
        {
          student_id,
          class_id: student.current_class,
          academic_year: academicYear,
          status: "active",
        },
        {
          status: "transferred",
          transfer_date: new Date(),
          transfer_reason: reason,
        },
        { session }
      );

      // Remove student from old class
      await Class.findByIdAndUpdate(
        student.current_class,
        {
          $pull: { students: student_id },
        },
        { session }
      );
    }

    // Create new enrollment record
    const newEnrollment = new StudentClassHistory({
      student_id,
      class_id: new_class_id,
      academic_year: academicYear,
      enrollment_date: new Date(),
      status: "active",
    });

    await newEnrollment.save({ session });

    // Update student's current class
    student.current_class = new_class_id;
    student.current_academic_year = academicYear;
    await student.save({ session });

    // Add student to new class
    if (!newClass.students.includes(student_id)) {
      newClass.students.push(student_id);
      await newClass.save({ session });
    }

    const populatedEnrollment = await StudentClassHistory.findById(
      newEnrollment._id
    )
      .populate("student_id", "fullName rollNum")
      .populate("class_id", "name")
      .session(session);

    return populatedEnrollment;
  });

  return sendSuccess(res, result, "Student transferred successfully");
});

/**
 * Withdraw student
 * POST /api/students/:student_id/withdraw
 * Admin only
 */
export const withdrawStudent = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const { reason } = req.body;

  const result = await withTransaction(async (session) => {
    // Check if student exists
    const student = await Student.findById(student_id).session(session);
    if (!student) {
      throw new Error("Student not found");
    }

    if (!student.active) {
      throw new Error("Student is already withdrawn");
    }

    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;

    // End current enrollment if exists
    if (student.current_class) {
      await StudentClassHistory.findOneAndUpdate(
        {
          student_id,
          class_id: student.current_class,
          academic_year: academicYear,
          status: "active",
        },
        {
          status: "withdrawn",
          withdrawal_date: new Date(),
          withdrawal_reason: reason,
        },
        { session }
      );

      // Remove student from class
      await Class.findByIdAndUpdate(
        student.current_class,
        {
          $pull: { students: student_id },
        },
        { session }
      );
    }

    // Mark student as inactive
    student.active = false;
    student.current_class = null;
    await student.save({ session });

    return student;
  });

  return sendSuccess(res, result, "Student withdrawn successfully");
});

/**
 * Get class roster
 * GET /api/classes/:class_id/roster
 * Admin/Teacher access
 */
export const getClassRoster = asyncHandler(async (req, res) => {
  const { class_id } = req.params;

  // Check if class exists
  const classDoc = await Class.findById(class_id);
  if (!classDoc) {
    throwNotFound("Class");
  }

  // If user is a teacher, check if they're assigned to this class
  if (req.user.role === "teacher" && !classDoc.teachers.includes(req.user.id)) {
    throwForbidden("You don't have access to this class");
  }

  const students = await Student.find({
    current_class: class_id,
    active: true,
  }).sort({ fullName: 1 });

  return sendSuccess(res, students, "Class roster retrieved successfully");
});

/**
 * Get student basic info for parent
 * GET /api/student/:student_id/basic-info
 * Parent access
 */
export const getStudentBasicInfoForParent = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const parentId = req.user.id;

  // Check if parent has access to this student
  const relation = await ParentStudentRelation.findOne({
    parent_id: parentId,
    student_id,
    active: true,
  });

  if (!relation) {
    throwForbidden("You don't have access to this student");
  }

  const student = await Student.findById(student_id)
    .populate("current_class", "name grade section");

  if (!student) {
    throwNotFound("Student");
  }

  // Debug logging - remove after testing
  console.log("Full student object keys:", Object.keys(student.toObject()));
  console.log("Student contacts data:", student.contacts);
  console.log("Student contacts length:", student.contacts?.length || 0);
  console.log("Student contacts type:", typeof student.contacts);

  // Ensure contacts is always an array
  const studentData = student.toObject();
  if (!studentData.contacts) {
    studentData.contacts = [];
  }

  return sendSuccess(
    res,
    studentData,
    "Student basic info retrieved successfully"
  );
});

/**
 * Get student basic info for teacher
 * GET /api/student/:student_id/basic-info-for-teacher
 * Teacher access
 */
export const getStudentBasicInfoForTeacher = asyncHandler(async (req, res) => {
  const { student_id } = req.params;

  const student = await Student.findById(student_id).populate(
    "current_class",
    "name"
  );

  if (!student) {
    throwNotFound("Student");
  }

  // Check if teacher has access to this student
  if (req.user.role === "teacher") {
    const teacherClasses = await Class.find({
      teachers: req.user.id,
      isActive: true,
    }).select("_id");

    const classIds = teacherClasses.map((cls) => cls._id.toString());

    if (
      !student.current_class ||
      !classIds.includes(student.current_class._id.toString())
    ) {
      throwForbidden("You don't have access to this student");
    }
  }

  // Calculate age
  const today = new Date();
  const birthDate = new Date(student.birthdate);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  let ageString = `${age} years`;
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    ageString = `${age - 1} years`;
  }

  const studentInfo = {
    ...student.toObject(),
    age: ageString,
  };

  return sendSuccess(
    res,
    studentInfo,
    "Student basic info retrieved successfully"
  );
});

/**
 * Get students for logged-in parent
 * GET /api/parent/students
 * Parent access
 */
export const getParentStudents = asyncHandler(async (req, res) => {
  const parentId = req.user.id;

  // Get all student relationships for this parent
  const relations = await ParentStudentRelation.find({
    parent_id: parentId,
    active: true,
  }).populate({
    path: "student_id",
    populate: {
      path: "current_class",
      select: "name",
    },
  });

  const students = relations.map((relation) => ({
    ...relation.student_id.toObject(),
    relationshipType: relation.relationshipType,
  }));

  return sendSuccess(res, students, "Parent students retrieved successfully");
});

/**
 * Get students for select options (label/value pairs)
 * GET /api/students/select
 * All authenticated users
 */
export const getStudentsForSelect = asyncHandler(async (req, res) => {
  const students = await Student.find({ active: true })
    .select("fullName rollNum")
    .sort({ fullName: 1 })
    .lean();

  const selectOptions = students.map((student) => ({
    value: student._id.toString(),
    label: `${student.fullName} (${student.rollNum})`,
  }));

  return sendSuccess(
    res,
    selectOptions,
    "Students for select retrieved successfully"
  );
});

/**
 * Get student statistics
 * GET /api/students/statistics
 * Admin/Teacher access
 */
export const getStudentStatistics = asyncHandler(async (req, res) => {
  const { year } = req.query;

  // Build query for year filter
  let query = { active: true };
  if (year) {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);
    query.createdAt = { $gte: startDate, $lte: endDate };
  }

  // Get student statistics
  const [totalStudents, activeStudents, studentsWithClasses, totalClasses] =
    await Promise.all([
      Student.countDocuments(query),
      Student.countDocuments({ ...query, active: true }),
      Student.countDocuments({ ...query, current_class: { $ne: null } }),
      Class.countDocuments({ isActive: true }),
    ]);

  const statistics = {
    totalStudents,
    activeStudents,
    studentsWithClasses,
    totalClasses,
    year: year || new Date().getFullYear(),
  };

  return sendSuccess(
    res,
    statistics,
    "Student statistics retrieved successfully"
  );
});

/**
 * Get student details with contacts and enrollment info
 * GET /api/students/:student_id/details
 * Admin/Teacher access
 */
export const getStudentDetails = asyncHandler(async (req, res) => {
  const { student_id } = req.params;

  const student = await Student.findById(student_id)
    .populate("current_class", "name description")
    .lean();

  if (!student) {
    throwNotFound("Student");
  }

  // If user is a teacher, check if they have access to this student
  if (req.user.role === "teacher") {
    const teacherClasses = await Class.find({
      teachers: req.user.id,
      isActive: true,
    }).select("_id");

    const classIds = teacherClasses.map((cls) => cls._id.toString());

    if (
      !student.current_class ||
      !classIds.includes(student.current_class._id.toString())
    ) {
      throwForbidden("You don't have access to this student");
    }
  }

  // Get enrollment history
  const enrollmentHistory = await StudentClassHistory.find({
    student_id: student_id,
  })
    .populate("class_id", "name")
    .sort({ enrollment_date: -1 })
    .limit(5);

  const result = {
    ...student,
    enrollmentHistory,
  };

  return sendSuccess(res, result, "Student details retrieved successfully");
});

/**
 * Update student photo
 * PUT /api/students/:student_id/photo
 * Admin only
 */
export const updateStudentPhoto = asyncHandler(async (req, res) => {
  const { student_id } = req.params;

  // Check if student exists
  const student = await Student.findById(student_id);

  if (!student) {
    throwNotFound("Student");
  }

  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No photo file provided",
    });
  }

  // Delete old photo if it exists
  if (student.photoUrl) {
    const oldPhotoPath = path.join(process.cwd(), "uploads", student.photoUrl);
    if (fs.existsSync(oldPhotoPath)) {
      fs.unlinkSync(oldPhotoPath);
    }
  }

  // Update student with new photo URL (use full path from multer)
  student.photoUrl = normalizePath(req.file.path);
  await student.save();

  return sendSuccess(
    res,
    { photoUrl: student.photoUrl },
    "Student photo updated successfully"
  );
});

/**
 * Update student active status
 * PUT /api/students/:student_id/active
 * Admin only
 */
export const updateStudentActiveStatus = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const { active } = req.body;

  const student = await Student.findById(student_id);

  if (!student) {
    throwNotFound("Student");
  }

  student.active = active;
  await student.save();

  return sendSuccess(
    res,
    student,
    `Student ${active ? "activated" : "deactivated"} successfully`
  );
});

/**
 * Add student contact
 * POST /api/students/:student_id/contacts
 * Admin only
 */
export const addStudentContact = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const contactData = req.body;

  const student = await Student.findById(student_id);

  if (!student) {
    throwNotFound("Student");
  }

  // Handle photo upload if file is provided
  if (req.file) {
    contactData.photoUrl = normalizePath(req.file.path);
  }

  // Add new contact
  student.contacts.push(contactData);
  await student.save();

  return sendSuccess(
    res,
    student.contacts[student.contacts.length - 1],
    "Contact added successfully"
  );
});

/**
 * Update student contact
 * PUT /api/students/:student_id/contacts/:contact_id
 * Admin only
 */
export const updateStudentContact = asyncHandler(async (req, res) => {
  const { student_id, contact_id } = req.params;
  const updateData = req.body;

  const student = await Student.findById(student_id);

  if (!student) {
    throwNotFound("Student");
  }

  const contact = student.contacts.id(contact_id);
  if (!contact) {
    throwNotFound("Contact");
  }

  // Handle photo upload if file is provided
  if (req.file) {
    // Delete old photo if it exists
    if (contact.photoUrl) {
      const oldPhotoPath = path.join(
        process.cwd(),
        "uploads",
        contact.photoUrl
      );
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }
    updateData.photoUrl = normalizePath(req.file.path);
  }

  // Update contact
  Object.assign(contact, updateData);
  await student.save();

  return sendSuccess(res, contact, "Contact updated successfully");
});

/**
 * Delete student contact
 * DELETE /api/students/:student_id/contacts/:contact_id
 * Admin only
 */
export const deleteStudentContact = asyncHandler(async (req, res) => {
  const { student_id, contact_id } = req.params;

  const student = await Student.findById(student_id);

  if (!student) {
    throwNotFound("Student");
  }

  const contact = student.contacts.id(contact_id);
  if (!contact) {
    throwNotFound("Contact");
  }

  // Delete contact photo if it exists
  if (contact.photoUrl) {
    const photoPath = path.join(process.cwd(), "uploads", contact.photoUrl);
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }
  }

  // Remove contact
  student.contacts.pull(contact_id);
  await student.save();

  return sendSuccess(res, null, "Contact deleted successfully");
});

/**
 * Generate next enrollment number
 * GET /api/students/generate-enrollment-number
 * Admin only
 */
export const generateEnrollmentNumber = asyncHandler(async (req, res) => {
  // Find the highest enrollment number (rollNum is a number field)
  const lastStudent = await Student.findOne({})
    .sort({ rollNum: -1 })
    .select("rollNum");

  let nextNumber = 1;
  if (lastStudent && lastStudent.rollNum) {
    nextNumber = lastStudent.rollNum + 1;
  }

  return sendSuccess(
    res,
    { enrollmentNumber: nextNumber },
    "Enrollment number generated successfully"
  );
});
