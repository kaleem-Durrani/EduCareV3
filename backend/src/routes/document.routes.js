import express from "express";
import {
  getDocumentTypes,
  getPaginatedDocumentTypes,
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
  getStudentDocuments,
  updateStudentDocuments,
  getAllStudentsDocuments,
  getDocumentStatistics,
  getPaginatedStudentsDocuments,
} from "../controllers/document.controller.js";
import {
  authenticate,
  requireAdmin,
  requireAdminOrTeacher,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/documents/types
 * @desc    Get all document types
 * @access  Private (All authenticated users)
 */
router.get("/documents/types", authenticate, getDocumentTypes);

/**
 * @route   GET /api/documents/types/paginated
 * @desc    Get paginated document types
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/documents/types/paginated",
  authenticate,
  requireAdminOrTeacher,
  getPaginatedDocumentTypes
);

/**
 * @route   POST /api/documents/types
 * @desc    Create document type
 * @access  Private (Admin only)
 */
router.post("/documents/types", authenticate, requireAdmin, createDocumentType);

/**
 * @route   PUT /api/documents/types/:document_id
 * @desc    Update document type
 * @access  Private (Admin only)
 */
router.put(
  "/documents/types/:document_id",
  authenticate,
  requireAdmin,
  updateDocumentType
);

/**
 * @route   DELETE /api/documents/types/:document_id
 * @desc    Delete document type
 * @access  Private (Admin only)
 */
router.delete(
  "/documents/types/:document_id",
  authenticate,
  requireAdmin,
  deleteDocumentType
);

/**
 * @route   GET /api/documents/student/:student_id
 * @desc    Get student documents
 * @access  Private (Admin/Teacher/Parent with restrictions)
 */
router.get("/documents/student/:student_id", authenticate, getStudentDocuments);

/**
 * @route   PUT /api/documents/student/:student_id
 * @desc    Update student documents
 * @access  Private (Admin only)
 */
router.put(
  "/documents/student/:student_id",
  authenticate,
  requireAdmin,
  updateStudentDocuments
);

/**
 * @route   GET /api/documents/students/all
 * @desc    Get all students with their document statistics
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/documents/students/all",
  authenticate,
  requireAdminOrTeacher,
  getAllStudentsDocuments
);

/**
 * @route   GET /api/documents/statistics
 * @desc    Get overall document statistics (cached)
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/documents/statistics",
  authenticate,
  requireAdminOrTeacher,
  getDocumentStatistics
);

/**
 * @route   GET /api/documents/students/paginated
 * @desc    Get paginated students with their document statistics
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/documents/students/paginated",
  authenticate,
  requireAdminOrTeacher,
  getPaginatedStudentsDocuments
);

export default router;
