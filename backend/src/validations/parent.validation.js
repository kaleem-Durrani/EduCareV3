import { body } from "express-validator";

export const createParentStudentRelationValidation = [
  body("parent_id")
    .isMongoId()
    .withMessage("Invalid parent ID"),
  body("student_id")
    .isMongoId()
    .withMessage("Invalid student ID"),
  body("relationshipType")
    .optional()
    .isIn(["parent", "guardian", "mother", "father", "grandparent"])
    .withMessage("Invalid relationship type"),
];
