import { body, param } from "express-validator";

export const createReportValidation = [
  body("student_id")
    .isMongoId()
    .withMessage("Invalid student ID"),
  body("weekStart")
    .isISO8601()
    .withMessage("Please provide a valid week start date"),
  body("weekEnd")
    .isISO8601()
    .withMessage("Please provide a valid week end date"),
  body("activities")
    .optional()
    .isArray()
    .withMessage("Activities must be an array"),
  body("activities.*.day")
    .optional()
    .isIn(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
    .withMessage("Day must be a valid day of the week"),
  body("activities.*.description")
    .optional()
    .isString()
    .withMessage("Activity description must be a string"),
  body("behavior")
    .optional()
    .isString()
    .withMessage("Behavior must be a string"),
  body("mood")
    .optional()
    .isString()
    .withMessage("Mood must be a string"),
  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string"),
];

export const updateReportValidation = [
  param("report_id")
    .isMongoId()
    .withMessage("Invalid report ID"),
  body("weekStart")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid week start date"),
  body("weekEnd")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid week end date"),
  body("activities")
    .optional()
    .isArray()
    .withMessage("Activities must be an array"),
  body("activities.*.day")
    .optional()
    .isIn(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
    .withMessage("Day must be a valid day of the week"),
  body("activities.*.description")
    .optional()
    .isString()
    .withMessage("Activity description must be a string"),
  body("behavior")
    .optional()
    .isString()
    .withMessage("Behavior must be a string"),
  body("mood")
    .optional()
    .isString()
    .withMessage("Mood must be a string"),
  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string"),
];

export const studentIdValidation = [
  param("student_id")
    .isMongoId()
    .withMessage("Invalid student ID"),
];

export const reportIdValidation = [
  param("report_id")
    .isMongoId()
    .withMessage("Invalid report ID"),
];

export const batchReportValidation = [
  param("student_id")
    .isMongoId()
    .withMessage("Invalid student ID"),
  body("reports")
    .isArray({ min: 1 })
    .withMessage("Reports must be an array with at least one report"),
  body("reports.*.weekStart")
    .isISO8601()
    .withMessage("Please provide a valid week start date"),
  body("reports.*.weekEnd")
    .isISO8601()
    .withMessage("Please provide a valid week end date"),
  body("reports.*.activities")
    .optional()
    .isArray()
    .withMessage("Activities must be an array"),
  body("reports.*.behavior")
    .optional()
    .isString()
    .withMessage("Behavior must be a string"),
  body("reports.*.mood")
    .optional()
    .isString()
    .withMessage("Mood must be a string"),
  body("reports.*.notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string"),
];
