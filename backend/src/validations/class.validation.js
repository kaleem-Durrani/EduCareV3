import { body, param } from "express-validator";

export const createClassValidation = [
  body("name")
    .isLength({ min: 2 })
    .withMessage("Class name must be at least 2 characters long"),
  body("description")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long"),
  body("grade")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Grade is required"),
  body("section")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Section is required"),
  body("academic_year")
    .optional()
    .matches(/^\d{4}-\d{4}$/)
    .withMessage("Academic year must be in format YYYY-YYYY"),
];

export const updateClassValidation = [
  param("class_id").isMongoId().withMessage("Invalid class ID"),
  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Class name must be at least 2 characters long"),
  body("description")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long"),
  body("grade")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Grade is required"),
  body("section")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Section is required"),
  body("academic_year")
    .optional()
    .matches(/^\d{4}-\d{4}$/)
    .withMessage("Academic year must be in format YYYY-YYYY"),
];

export const classIdValidation = [
  param("class_id").isMongoId().withMessage("Invalid class ID"),
];

export const enrollTeacherValidation = [
  param("class_id").isMongoId().withMessage("Invalid class ID"),
  body("teacher_id").isMongoId().withMessage("Invalid teacher ID"),
];

export const removeTeacherValidation = [
  param("class_id").isMongoId().withMessage("Invalid class ID"),
  param("teacher_id").isMongoId().withMessage("Invalid teacher ID"),
];

export const addStudentValidation = [
  param("class_id").isMongoId().withMessage("Invalid class ID"),
  body("student_id").isMongoId().withMessage("Invalid student ID"),
];

export const removeStudentValidation = [
  param("class_id").isMongoId().withMessage("Invalid class ID"),
  param("student_id").isMongoId().withMessage("Invalid student ID"),
];
