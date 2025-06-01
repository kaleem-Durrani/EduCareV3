import Class from "../models/class.model.js";
import User from "../models/user.model.js";
import Student from "../models/student.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
  throwConflict,
  throwForbidden,
} from "../utils/transaction.utils.js";

/**
 * Create a new class
 * POST /api/classes
 * Admin only
 */
export const createClass = asyncHandler(async (req, res) => {
  const { name, description, grade, section, academic_year } = req.body;
  const createdBy = req.user.id;

  const result = await withTransaction(async (session) => {
    // Check if class with same name already exists
    const existingClass = await Class.findOne({ name, isActive: true }).session(
      session
    );
    if (existingClass) {
      throwConflict("Class with this name already exists");
    }

    const newClass = new Class({
      name,
      description,
      grade,
      section,
      academic_year,
      createdBy,
      updatedBy: createdBy,
      teachers: [],
      students: [],
      isActive: true,
    });

    await newClass.save({ session });

    const populatedClass = await Class.findById(newClass._id)
      .populate("createdBy", "name email")
      .populate("teachers", "name email")
      .populate("students", "fullName rollNum")
      .session(session);

    return populatedClass;
  });

  return sendSuccess(res, result, "Class created successfully", 201);
});

/**
 * Update a class
 * PUT /api/classes/:class_id
 * Admin only
 */
export const updateClass = asyncHandler(async (req, res) => {
  const { class_id } = req.params;
  const { name, description, grade, section, academic_year } = req.body;
  const updatedBy = req.user.id;

  const result = await withTransaction(async (session) => {
    const classToUpdate = await Class.findById(class_id).session(session);
    if (!classToUpdate) {
      throwNotFound("Class");
    }

    // Check if another class with the same name exists (excluding current class)
    if (name && name !== classToUpdate.name) {
      const existingClass = await Class.findOne({
        name,
        _id: { $ne: class_id },
        isActive: true,
      }).session(session);
      if (existingClass) {
        throwConflict("Class with this name already exists");
      }
    }

    // Update fields
    const updateData = { updatedBy };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (grade !== undefined) updateData.grade = grade;
    if (section !== undefined) updateData.section = section;
    if (academic_year !== undefined) updateData.academic_year = academic_year;

    const updatedClass = await Class.findByIdAndUpdate(class_id, updateData, {
      new: true,
      session,
    })
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .populate("teachers", "name email")
      .populate("students", "fullName rollNum");

    return updatedClass;
  });

  return sendSuccess(res, result, "Class updated successfully");
});

/**
 * Enroll teacher to class
 * POST /api/classes/:class_id/teacher
 * Admin only
 */
export const enrollTeacher = asyncHandler(async (req, res) => {
  const { class_id } = req.params;
  const { teacher_id } = req.body;

  const result = await withTransaction(async (session) => {
    // Check if class exists
    const classDoc = await Class.findById(class_id).session(session);
    if (!classDoc) {
      throwNotFound("Class");
    }

    // Check if teacher exists and has teacher role
    const teacher = await User.findOne({
      _id: teacher_id,
      role: "teacher",
      is_active: true,
    }).session(session);
    if (!teacher) {
      throwNotFound("Teacher");
    }

    // Check if teacher is already assigned to this class
    if (classDoc.teachers.includes(teacher_id)) {
      throwConflict("Teacher is already assigned to this class");
    }

    // Add teacher to class
    classDoc.teachers.push(teacher_id);
    classDoc.updatedBy = req.user.id;
    await classDoc.save({ session });

    const updatedClass = await Class.findById(class_id)
      .populate("teachers", "name email")
      .populate("students", "fullName rollNum")
      .session(session);

    return updatedClass;
  });

  return sendSuccess(res, result, "Teacher enrolled to class successfully");
});

/**
 * Remove teacher from class
 * DELETE /api/classes/:class_id/teachers/:teacher_id
 * Admin only
 */
export const removeTeacherFromClass = asyncHandler(async (req, res) => {
  const { class_id, teacher_id } = req.params;

  const result = await withTransaction(async (session) => {
    // Check if class exists
    const classDoc = await Class.findById(class_id).session(session);
    if (!classDoc) {
      throwNotFound("Class");
    }

    // Check if teacher is assigned to this class
    if (!classDoc.teachers.includes(teacher_id)) {
      throwNotFound("Teacher is not assigned to this class");
    }

    // Remove teacher from class
    classDoc.teachers = classDoc.teachers.filter(
      (id) => id.toString() !== teacher_id
    );
    classDoc.updatedBy = req.user.id;
    await classDoc.save({ session });

    const updatedClass = await Class.findById(class_id)
      .populate("teachers", "name email")
      .populate("students", "fullName rollNum")
      .session(session);

    return updatedClass;
  });

  return sendSuccess(res, result, "Teacher removed from class successfully");
});

/**
 * Add student to class
 * POST /api/classes/:class_id/students
 * Admin only
 */
export const addStudentToClass = asyncHandler(async (req, res) => {
  const { class_id } = req.params;
  const { student_id } = req.body;

  const result = await withTransaction(async (session) => {
    // Check if class exists
    const classDoc = await Class.findById(class_id).session(session);
    if (!classDoc) {
      throwNotFound("Class");
    }

    // Check if student exists and is active
    const student = await Student.findOne({
      _id: student_id,
      active: true,
    }).session(session);
    if (!student) {
      throwNotFound("Student");
    }

    // Check if student is already in this class
    if (classDoc.students.includes(student_id)) {
      throwConflict("Student is already in this class");
    }

    // Add student to class
    classDoc.students.push(student_id);
    classDoc.updatedBy = req.user.id;
    await classDoc.save({ session });

    // Update student's current class
    student.current_class = class_id;
    student.class = classDoc.name; // Update the string field as well
    await student.save({ session });

    const updatedClass = await Class.findById(class_id)
      .populate("teachers", "name email")
      .populate("students", "fullName rollNum")
      .session(session);

    return updatedClass;
  });

  return sendSuccess(res, result, "Student added to class successfully");
});

/**
 * Remove student from class
 * DELETE /api/classes/:class_id/students/:student_id
 * Admin only
 */
export const removeStudentFromClass = asyncHandler(async (req, res) => {
  const { class_id, student_id } = req.params;

  const result = await withTransaction(async (session) => {
    // Check if class exists
    const classDoc = await Class.findById(class_id).session(session);
    if (!classDoc) {
      throwNotFound("Class");
    }

    // Check if student is in this class
    if (!classDoc.students.includes(student_id)) {
      throwNotFound("Student is not in this class");
    }

    // Remove student from class
    classDoc.students = classDoc.students.filter(
      (id) => id.toString() !== student_id
    );
    classDoc.updatedBy = req.user.id;
    await classDoc.save({ session });

    // Update student's current class to null
    await Student.findByIdAndUpdate(
      student_id,
      {
        current_class: null,
        class: null,
      },
      { session }
    );

    const updatedClass = await Class.findById(class_id)
      .populate("teachers", "name email")
      .populate("students", "fullName rollNum")
      .session(session);

    return updatedClass;
  });

  return sendSuccess(res, result, "Student removed from class successfully");
});

/**
 * Get all classes
 * GET /api/classes
 * Role-based filtering
 */
export const getClasses = asyncHandler(async (req, res) => {
  let query = { isActive: true };

  // If user is a teacher, only show classes they're assigned to
  if (req.user.role === "teacher") {
    query.teachers = req.user.id;
  }

  const classes = await Class.find(query)
    .populate("createdBy", "name email")
    .populate("teachers", "name email")
    .populate("students", "fullName rollNum")
    .sort({ createdAt: -1 });

  return sendSuccess(res, classes, "Classes retrieved successfully");
});

/**
 * Get classes for enrolled teacher
 * GET /api/classes/enrolled-teacher
 * Teacher only
 */
export const getEnrolledTeacherClasses = asyncHandler(async (req, res) => {
  const teacherId = req.user.id;

  const classes = await Class.find({
    teachers: teacherId,
    isActive: true,
  })
    .populate("teachers", "name email")
    .populate("students", "fullName rollNum")
    .sort({ createdAt: -1 });

  return sendSuccess(res, classes, "Enrolled classes retrieved successfully");
});

/**
 * Get single class details
 * GET /api/classes/:class_id
 * Role-based access
 */
export const getClassById = asyncHandler(async (req, res) => {
  const { class_id } = req.params;

  let query = { _id: class_id, isActive: true };

  // If user is a teacher, ensure they're assigned to this class
  if (req.user.role === "teacher") {
    query.teachers = req.user.id;
  }

  const classDoc = await Class.findOne(query)
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .populate("teachers", "name email phone")
    .populate("students", "fullName rollNum birthdate photoUrl");

  if (!classDoc) {
    throwNotFound("Class");
  }

  return sendSuccess(res, classDoc, "Class details retrieved successfully");
});

/**
 * Get classes for select options (label/value pairs)
 * GET /api/classes/select
 * All authenticated users
 */
export const getClassesForSelect = asyncHandler(async (req, res) => {
  const classes = await Class.find({ isActive: true })
    .select("name grade section")
    .sort({ name: 1 })
    .lean();

  const selectOptions = classes.map((classItem) => ({
    value: classItem._id.toString(),
    label: `${classItem.name}${
      classItem.grade ? ` (Grade ${classItem.grade})` : ""
    }${classItem.section ? ` - ${classItem.section}` : ""}`,
  }));

  return sendSuccess(
    res,
    selectOptions,
    "Classes for select retrieved successfully"
  );
});
