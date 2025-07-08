import { body } from "express-validator";

export const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .isIn(["parent", "teacher", "admin"])
    .withMessage("Role must be one of: parent, teacher, admin"),
];

export const registerValidation = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .isIn(["parent", "teacher", "admin"])
    .withMessage("Role must be one of: parent, teacher, admin"),
  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
];

export const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
];

export const updateProfileValidation = [
  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
  body("address")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters long"),
];
