import express from "express";
import {
  getStudentNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";
import {
  authenticate,
  requireAdminOrTeacher,
} from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
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
  requireAdminOrTeacher,
  validate(getStudentNotesValidation),
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
  validate(createNoteValidation),
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
  validate(updateNoteValidation),
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
  validate(getNoteValidation),
  deleteNote
);

export default router;
