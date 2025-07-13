import express from "express";
import {
  getStudentNotes,
  createNote,
  updateNote,
  deleteNote,
  getStudentNotesForParent,
} from "../controllers/note.controller.js";
import {
  authenticate,
  requireAdminOrTeacher,
  requireParent,
} from "../middleware/auth.middleware.js";
import { handleValidationErrors } from "../middleware/validation.middleware.js";
import {
  createNoteValidation,
  updateNoteValidation,
  getNoteValidation,
  getStudentNotesValidation,
} from "../validations/note.validation.js";

const router = express.Router();

/**
 * @route   GET /api/notes/student/:student_id
 * @desc    Get notes for a specific student (with pagination and filters)
 * @access  Private (Admin/Teacher)
 */
router.get(
  "/notes/student/:student_id",
  authenticate,
  getStudentNotesValidation,
  handleValidationErrors,
  getStudentNotes
);

/**
 * @route   POST /api/notes
 * @desc    Create note
 * @access  Private (Admin/Teacher)
 */
router.post(
  "/notes",
  authenticate,
  requireAdminOrTeacher,
  createNoteValidation,
  handleValidationErrors,
  createNote
);

/**
 * @route   PUT /api/notes/:note_id
 * @desc    Update note
 * @access  Private (Admin/Teacher)
 */
router.put(
  "/notes/:note_id",
  authenticate,
  requireAdminOrTeacher,
  updateNoteValidation,
  handleValidationErrors,
  updateNote
);

/**
 * @route   DELETE /api/notes/:note_id
 * @desc    Delete note
 * @access  Private (Admin/Teacher)
 */
router.delete(
  "/notes/:note_id",
  authenticate,
  requireAdminOrTeacher,
  getNoteValidation,
  handleValidationErrors,
  deleteNote
);

/**
 * @route   GET /api/notes/parent/:student_id
 * @desc    Get notes for parent's child
 * @access  Private (Parent)
 */
router.get(
  "/notes/parent/:student_id",
  authenticate,
  requireParent,
  getStudentNotesValidation,
  handleValidationErrors,
  getStudentNotesForParent
);

export default router;
