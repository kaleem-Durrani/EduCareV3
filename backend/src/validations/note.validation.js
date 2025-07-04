import { body, param, query } from "express-validator";

export const createNoteValidation = [
  body("student_id")
    .isMongoId()
    .withMessage("Please provide a valid student ID"),
  body("content")
    .isLength({ min: 1, max: 2000 })
    .withMessage("Note content must be between 1 and 2000 characters"),
];

export const updateNoteValidation = [
  param("note_id")
    .isMongoId()
    .withMessage("Please provide a valid note ID"),
  body("content")
    .optional()
    .isLength({ min: 1, max: 2000 })
    .withMessage("Note content must be between 1 and 2000 characters"),
];

export const getNoteValidation = [
  param("note_id")
    .isMongoId()
    .withMessage("Please provide a valid note ID"),
];

export const getStudentNotesValidation = [
  param("student_id")
    .isMongoId()
    .withMessage("Please provide a valid student ID"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("dateFrom")
    .optional()
    .isISO8601()
    .withMessage("Date from must be a valid ISO date"),
  query("dateTo")
    .optional()
    .isISO8601()
    .withMessage("Date to must be a valid ISO date"),
  query("createdBy")
    .optional()
    .isMongoId()
    .withMessage("Created by must be a valid user ID"),
  query("sortBy")
    .optional()
    .isIn(['createdAt', 'updatedAt', 'content'])
    .withMessage("Sort by must be one of: createdAt, updatedAt, content"),
  query("sortOrder")
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage("Sort order must be either 'asc' or 'desc'"),
];
