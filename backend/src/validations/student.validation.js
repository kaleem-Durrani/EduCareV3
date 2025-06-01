import { body, param } from "express-validator";

export const createStudentValidation = [
  body("fullName")
    .isLength({ min: 2 })
    .withMessage("Full name must be at least 2 characters long"),
  body("birthdate").isISO8601().withMessage("Please provide a valid birthdate"),
  body("rollNum")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Roll number must be a positive integer"),
  body("allergies")
    .optional()
    .isArray()
    .withMessage("Allergies must be an array"),
  body("likes").optional().isArray().withMessage("Likes must be an array"),
  body("additionalInfo")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Additional info must not exceed 500 characters"),
  body("authorizedPhotos")
    .optional()
    .isBoolean()
    .withMessage("Authorized photos must be a boolean"),
  body("schedule.time")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Schedule time is required"),
  body("schedule.days")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Schedule days is required"),
];

export const updateStudentValidation = [
  param("student_id").isMongoId().withMessage("Invalid student ID"),
  body("fullName")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Full name must be at least 2 characters long"),
  body("birthdate")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid birthdate"),
  body("rollNum")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Roll number must be a positive integer"),
  body("allergies")
    .optional()
    .isArray()
    .withMessage("Allergies must be an array"),
  body("likes").optional().isArray().withMessage("Likes must be an array"),
  body("additionalInfo")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Additional info must not exceed 500 characters"),
  body("authorizedPhotos")
    .optional()
    .isBoolean()
    .withMessage("Authorized photos must be a boolean"),
];

export const studentIdValidation = [
  param("student_id").isMongoId().withMessage("Invalid student ID"),
];

export const enrollStudentValidation = [
  param("student_id").isMongoId().withMessage("Invalid student ID"),
  body("class_id").isMongoId().withMessage("Invalid class ID"),
  body("academic_year")
    .optional()
    .matches(/^\d{4}-\d{4}$/)
    .withMessage("Academic year must be in format YYYY-YYYY"),
];

export const transferStudentValidation = [
  param("student_id").isMongoId().withMessage("Invalid student ID"),
  body("new_class_id").isMongoId().withMessage("Invalid new class ID"),
  body("reason")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Reason must be at least 5 characters long"),
];

export const withdrawStudentValidation = [
  param("student_id").isMongoId().withMessage("Invalid student ID"),
  body("reason")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Reason must be at least 5 characters long"),
];

export const classIdValidation = [
  param("class_id").isMongoId().withMessage("Invalid class ID"),
];
