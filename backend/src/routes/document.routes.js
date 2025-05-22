import express from "express";
import {
  getDocumentTypes,
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
  getStudentDocuments,
  updateStudentDocuments,
} from "../controllers/document.controller.js";
import { authenticate, requireAdmin, requireAdminOrTeacher } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/documents/types
 * @desc    Get all document types
 * @access  Private (All authenticated users)
 */
router.get("/documents/types", authenticate, getDocumentTypes);

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
router.put("/documents/types/:document_id", authenticate, requireAdmin, updateDocumentType);

/**
 * @route   DELETE /api/documents/types/:document_id
 * @desc    Delete document type
 * @access  Private (Admin only)
 */
router.delete("/documents/types/:document_id", authenticate, requireAdmin, deleteDocumentType);

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
router.put("/documents/student/:student_id", authenticate, requireAdmin, updateStudentDocuments);

export default router;
