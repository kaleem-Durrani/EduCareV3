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
  const documentTypes = await DocumentType.find({ isActive: true }).sort({
    name: 1,
  });

  return sendSuccess(
    res,
    documentTypes,
    "Document types retrieved successfully"
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

  // Soft delete by setting isActive to false
  await DocumentType.findByIdAndUpdate(document_id, {
    isActive: false,
    updatedBy: req.user.id,
  });

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
    const allDocumentTypes = await DocumentType.find({ isActive: true });
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
