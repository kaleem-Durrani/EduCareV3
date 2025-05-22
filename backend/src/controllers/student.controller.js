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

/**
 * Get all students
 * GET /api/students
 * Admin/Teacher access
 */
export const getAllStudents = asyncHandler(async (req, res) => {
  let query = { active: true };

  // If user is a teacher, only show students from their classes
  if (req.user.role === "teacher") {
    const teacherClasses = await Class.find({
      teachers: req.user.id,
      isActive: true,
    }).select("_id");

    const classIds = teacherClasses.map((cls) => cls._id);
    query.current_class = { $in: classIds };
  }

  const students = await Student.find(query)
    .populate("current_class", "name")
    .sort({ createdAt: -1 });

  return sendSuccess(res, students, "Students retrieved successfully");
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
 * PUT /api/student/:student_id
 * Admin only - uses rollNum as student_id in path for lookup
 */
export const updateStudent = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const updateData = req.body;

  const result = await withTransaction(async (session) => {
    // Find student by rollNum (as mentioned in the API spec)
    const student = await Student.findOne({
      rollNum: parseInt(student_id),
    }).session(session);

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
    student.class = classDoc.name;
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
    student.class = newClass.name;
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
    student.class = null;
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
    .populate("current_class", "name")
    .select(
      "fullName rollNum class birthdate photoUrl schedule allergies likes"
    );

  if (!student) {
    throwNotFound("Student");
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
