import DocumentType from "../models/documentType.model.js";
import StudentDocument from "../models/studentDocument.model.js";
import Student from "../models/student.model.js";
import Class from "../models/class.model.js";
import { sendSuccess } from "../utils/response.utils.js";
import {
  withTransaction,
  asyncHandler,
  throwNotFound,
  throwForbidden,
  throwConflict,
} from "../utils/transaction.utils.js";

/**
 * Get all document types
 * GET /api/documents/types
 * All authenticated users
 */
export const getDocumentTypes = asyncHandler(async (req, res) => {
  const documentTypes = await DocumentType.find().sort({
    name: 1,
  });

  return sendSuccess(
    res,
    documentTypes,
    "Document types retrieved successfully"
  );
});

/**
 * Get paginated document types
 * GET /api/documents/types/paginated
 * Admin/Teacher only
 */
export const getPaginatedDocumentTypes = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Get paginated document types
  const documentTypes = await DocumentType.find()
    .sort({ createdAt: -1 }) // Most recent first
    .skip(skip)
    .limit(limit);

  const totalDocumentTypes = await DocumentType.countDocuments();

  const result = {
    documentTypes,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalDocumentTypes / limit),
      totalDocumentTypes,
      hasNextPage: page < Math.ceil(totalDocumentTypes / limit),
      hasPrevPage: page > 1,
    },
  };

  return sendSuccess(
    res,
    result,
    "Paginated document types retrieved successfully"
  );
});

/**
 * Create document type
 * POST /api/documents/types
 * Admin only
 */
export const createDocumentType = asyncHandler(async (req, res) => {
  const { name, description, required } = req.body;

  const result = await withTransaction(async (session) => {
    // Check if document type already exists
    const existingType = await DocumentType.findOne({ name }).session(session);
    if (existingType) {
      throwConflict("Document type already exists");
    }

    const newDocumentType = new DocumentType({
      name,
      description,
      required: required || false,
      createdBy: req.user.id,
    });

    await newDocumentType.save({ session });
    return newDocumentType;
  });

  return sendSuccess(res, result, "Document type created successfully", 201);
});

/**
 * Update document type
 * PUT /api/documents/types/:document_id
 * Admin only
 */
export const updateDocumentType = asyncHandler(async (req, res) => {
  const { document_id } = req.params;
  const { name, description, required } = req.body;

  const result = await withTransaction(async (session) => {
    const documentType = await DocumentType.findById(document_id).session(
      session
    );
    if (!documentType) {
      throwNotFound("Document type");
    }

    // Check if new name conflicts with existing document type
    if (name && name !== documentType.name) {
      const existingType = await DocumentType.findOne({
        name,
        _id: { $ne: document_id },
      }).session(session);
      if (existingType) {
        throwConflict("Document type with this name already exists");
      }
    }

    // Update fields
    const updateData = { updatedBy: req.user.id };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (required !== undefined) updateData.required = required;

    const updatedDocumentType = await DocumentType.findByIdAndUpdate(
      document_id,
      updateData,
      { new: true, session }
    );

    return updatedDocumentType;
  });

  return sendSuccess(res, result, "Document type updated successfully");
});

/**
 * Delete document type
 * DELETE /api/documents/types/:document_id
 * Admin only
 */
export const deleteDocumentType = asyncHandler(async (req, res) => {
  const { document_id } = req.params;

  const documentType = await DocumentType.findById(document_id);
  if (!documentType) {
    throwNotFound("Document type");
  }

  // Hard delete the document type
  await DocumentType.findByIdAndDelete(document_id);

  return sendSuccess(res, null, "Document type deleted successfully");
});

/**
 * Get student documents
 * GET /api/documents/student/:student_id
 * Admin/Teacher/Parent access (with restrictions)
 */
export const getStudentDocuments = asyncHandler(async (req, res) => {
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

  // Get student documents
  let studentDocuments = await StudentDocument.findOne({ student_id })
    .populate("student_id", "fullName rollNum")
    .populate("documents.document_type_id", "name description required");

  // If no documents exist, create empty document structure
  if (!studentDocuments) {
    const allDocumentTypes = await DocumentType.find();
    const documentStatuses = allDocumentTypes.map((type) => ({
      document_type_id: type._id,
      submitted: false,
      submission_date: null,
      notes: "",
    }));

    studentDocuments = new StudentDocument({
      student_id,
      documents: documentStatuses,
    });

    await studentDocuments.save();

    studentDocuments = await StudentDocument.findById(studentDocuments._id)
      .populate("student_id", "fullName rollNum")
      .populate("documents.document_type_id", "name description required");
  }

  return sendSuccess(
    res,
    studentDocuments,
    "Student documents retrieved successfully"
  );
});

/**
 * Update student documents
 * PUT /api/documents/student/:student_id
 * Admin only
 */
export const updateStudentDocuments = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const { documents } = req.body;

  const result = await withTransaction(async (session) => {
    // Check if student exists
    const student = await Student.findById(student_id).session(session);
    if (!student) {
      throwNotFound("Student");
    }

    // Find or create student documents
    let studentDocuments = await StudentDocument.findOne({
      student_id,
    }).session(session);

    if (!studentDocuments) {
      studentDocuments = new StudentDocument({
        student_id,
        documents: [],
      });
    }

    // Update documents
    studentDocuments.documents = documents;
    studentDocuments.updatedBy = req.user.id;
    await studentDocuments.save({ session });

    const updatedStudentDocuments = await StudentDocument.findById(
      studentDocuments._id
    )
      .populate("student_id", "fullName rollNum")
      .populate("documents.document_type_id", "name description required")
      .populate("updatedBy", "name email")
      .session(session);

    return updatedStudentDocuments;
  });

  return sendSuccess(res, result, "Student documents updated successfully");
});

/**
 * Get all students with their document statistics (EFFICIENT)
 * GET /api/documents/students/all
 * Admin/Teacher only
 */
export const getAllStudentsDocuments = asyncHandler(async (req, res) => {
  // Get all students with basic info
  const students = await Student.find({ active: true })
    .populate("current_class", "name")
    .select("fullName rollNum current_class")
    .sort({ fullName: 1 });

  // Get all document types
  const documentTypes = await DocumentType.find().select("_id name required");

  // Get all student documents in one query (EFFICIENT!)
  const allStudentDocuments = await StudentDocument.find({
    student_id: { $in: students.map((s) => s._id) },
  }).populate("student_id", "_id");

  // Create a map for quick lookup
  const documentsMap = {};
  allStudentDocuments.forEach((doc) => {
    documentsMap[doc.student_id._id.toString()] = doc;
  });

  // Calculate statistics for each student
  const studentsWithStats = students.map((student) => {
    const studentDoc = documentsMap[student._id.toString()];

    let totalDocs = documentTypes.length;
    let submittedDocs = 0;
    let requiredDocs = documentTypes.filter((type) => type.required).length;
    let submittedRequiredDocs = 0;
    let lastUpdated = null;

    if (studentDoc && studentDoc.documents) {
      submittedDocs = studentDoc.documents.filter(
        (doc) => doc.submitted
      ).length;
      submittedRequiredDocs = studentDoc.documents.filter((doc) => {
        return (
          doc.submitted &&
          documentTypes.some(
            (type) =>
              type._id.toString() === doc.document_type_id.toString() &&
              type.required
          )
        );
      }).length;
      lastUpdated = studentDoc.updatedAt;
    }

    return {
      ...student.toObject(),
      documentStats: {
        totalDocs,
        submittedDocs,
        requiredDocs,
        submittedRequiredDocs,
        completionPercentage:
          totalDocs > 0 ? Math.round((submittedDocs / totalDocs) * 100) : 0,
        requiredCompletionPercentage:
          requiredDocs > 0
            ? Math.round((submittedRequiredDocs / requiredDocs) * 100)
            : 100,
        lastUpdated,
      },
    };
  });

  // Calculate overall statistics
  const totalStudents = students.length;
  const totalDocumentTypes = documentTypes.length;
  const totalDocumentsSubmitted = studentsWithStats.reduce(
    (sum, student) => sum + student.documentStats.submittedDocs,
    0
  );
  const totalRequiredDocs = studentsWithStats.reduce(
    (sum, student) => sum + student.documentStats.submittedRequiredDocs,
    0
  );
  const maxPossibleRequired = studentsWithStats.reduce(
    (sum, student) => sum + student.documentStats.requiredDocs,
    0
  );
  const overallCompliance =
    maxPossibleRequired > 0
      ? Math.round((totalRequiredDocs / maxPossibleRequired) * 100)
      : 100;

  const result = {
    students: studentsWithStats,
    statistics: {
      totalStudents,
      totalDocumentTypes,
      totalDocumentsSubmitted,
      overallCompliance,
    },
  };

  return sendSuccess(res, result, "Students documents retrieved successfully");
});

/**
 * Get document statistics (REAL-TIME)
 * GET /api/documents/statistics
 * Admin/Teacher only
 */
export const getDocumentStatistics = asyncHandler(async (req, res) => {
  // Get all students count
  const totalStudents = await Student.countDocuments({ active: true });

  // Get all document types
  const documentTypes = await DocumentType.find().select("_id name required");
  const totalDocumentTypes = documentTypes.length;
  const requiredDocumentTypes = documentTypes.filter((type) => type.required);

  // Get all student documents
  const allStudentDocuments = await StudentDocument.find({}).populate(
    "student_id",
    "_id"
  );

  // Calculate statistics
  let totalDocumentsSubmitted = 0;
  let totalRequiredSubmitted = 0;
  let studentsWithDocuments = 0;

  allStudentDocuments.forEach((studentDoc) => {
    if (studentDoc.documents && studentDoc.documents.length > 0) {
      studentsWithDocuments++;
      const submittedDocs = studentDoc.documents.filter((doc) => doc.submitted);
      totalDocumentsSubmitted += submittedDocs.length;

      const submittedRequired = submittedDocs.filter((doc) =>
        requiredDocumentTypes.some(
          (reqType) =>
            reqType._id.toString() === doc.document_type_id.toString()
        )
      );
      totalRequiredSubmitted += submittedRequired.length;
    }
  });

  const maxPossibleRequired = totalStudents * requiredDocumentTypes.length;
  const overallCompliance =
    maxPossibleRequired > 0
      ? Math.round((totalRequiredSubmitted / maxPossibleRequired) * 100)
      : 100;

  const statistics = {
    totalStudents,
    totalDocumentTypes,
    totalDocumentsSubmitted,
    overallCompliance,
    studentsWithDocuments,
    lastCalculated: new Date(),
  };

  return sendSuccess(
    res,
    statistics,
    "Document statistics retrieved successfully"
  );
});

/**
 * Get paginated students with document statistics
 * GET /api/documents/students/paginated
 * Admin/Teacher only
 */
export const getPaginatedStudentsDocuments = asyncHandler(async (req, res) => {
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

  // Get document types
  const documentTypes = await DocumentType.find().select("_id name required");

  // Get documents only for current page students (EFFICIENT!)
  const studentIds = students.map((s) => s._id);
  const studentDocuments = await StudentDocument.find({
    student_id: { $in: studentIds },
  }).populate("student_id", "_id");

  // Create lookup map
  const documentsMap = {};
  studentDocuments.forEach((doc) => {
    documentsMap[doc.student_id._id.toString()] = doc;
  });

  // Calculate stats for current page students only
  const studentsWithStats = students.map((student) => {
    const studentDoc = documentsMap[student._id.toString()];

    let totalDocs = documentTypes.length;
    let submittedDocs = 0;
    let requiredDocs = documentTypes.filter((type) => type.required).length;
    let submittedRequiredDocs = 0;
    let lastUpdated = null;

    if (studentDoc && studentDoc.documents) {
      submittedDocs = studentDoc.documents.filter(
        (doc) => doc.submitted
      ).length;
      submittedRequiredDocs = studentDoc.documents.filter((doc) => {
        return (
          doc.submitted &&
          documentTypes.some(
            (type) =>
              type._id.toString() === doc.document_type_id.toString() &&
              type.required
          )
        );
      }).length;
      lastUpdated = studentDoc.updatedAt;
    }

    return {
      ...student.toObject(),
      documentStats: {
        totalDocs,
        submittedDocs,
        requiredDocs,
        submittedRequiredDocs,
        completionPercentage:
          totalDocs > 0 ? Math.round((submittedDocs / totalDocs) * 100) : 0,
        requiredCompletionPercentage:
          requiredDocs > 0
            ? Math.round((submittedRequiredDocs / requiredDocs) * 100)
            : 100,
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
    "Paginated students documents retrieved successfully"
  );
});
