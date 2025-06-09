import { body, param } from "express-validator";

export const createMenuValidation = [
  body("title")
    .notEmpty()
    .withMessage("Menu title is required")
    .isLength({ max: 100 })
    .withMessage("Title must be less than 100 characters"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),
  body("status")
    .optional()
    .isIn(["draft", "active", "archived"])
    .withMessage("Status must be draft, active, or archived"),
  body("startDate")
    .isISO8601()
    .withMessage("Please provide a valid start date"),
  body("endDate").isISO8601().withMessage("Please provide a valid end date"),
  body("menuData")
    .isArray({ min: 1 })
    .withMessage("Menu data must be an array with at least one day"),
  body("menuData.*.day")
    .isIn(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
    .withMessage("Day must be a valid weekday (Monday-Friday)"),
  body("menuData.*.items").isArray().withMessage("Items must be an array"),
  body("menuData.*.items.*")
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "Each menu item must be a non-empty string with max 100 characters"
    ),
];

export const updateMenuValidation = [
  param("menu_id").isMongoId().withMessage("Invalid menu ID"),
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Menu title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Title must be less than 100 characters"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),
  body("status")
    .optional()
    .isIn(["draft", "active", "archived"])
    .withMessage("Status must be draft, active, or archived"),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid start date"),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid end date"),
  body("menuData")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Menu data must be an array with at least one day"),
  body("menuData.*.day")
    .optional()
    .isIn(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
    .withMessage("Day must be a valid weekday (Monday-Friday)"),
  body("menuData.*.items")
    .optional()
    .isArray()
    .withMessage("Items must be an array"),
  body("menuData.*.items.*")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "Each menu item must be a non-empty string with max 100 characters"
    ),
];

export const menuIdValidation = [
  param("menu_id").isMongoId().withMessage("Invalid menu ID"),
];
