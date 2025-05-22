import { body, param } from "express-validator";

export const createMenuValidation = [
  body("startDate")
    .isISO8601()
    .withMessage("Please provide a valid start date"),
  body("endDate")
    .isISO8601()
    .withMessage("Please provide a valid end date"),
  body("menuItems")
    .isArray({ min: 1 })
    .withMessage("Menu items must be an array with at least one item"),
  body("menuItems.*.day")
    .isIn(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
    .withMessage("Day must be a valid day of the week"),
  body("menuItems.*.breakfast")
    .optional()
    .isString()
    .withMessage("Breakfast must be a string"),
  body("menuItems.*.lunch")
    .optional()
    .isString()
    .withMessage("Lunch must be a string"),
  body("menuItems.*.snack")
    .optional()
    .isString()
    .withMessage("Snack must be a string"),
  body("menuItems.*.dinner")
    .optional()
    .isString()
    .withMessage("Dinner must be a string"),
];

export const updateMenuValidation = [
  param("menu_id")
    .isMongoId()
    .withMessage("Invalid menu ID"),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid start date"),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid end date"),
  body("menuItems")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Menu items must be an array with at least one item"),
  body("menuItems.*.day")
    .optional()
    .isIn(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
    .withMessage("Day must be a valid day of the week"),
  body("menuItems.*.breakfast")
    .optional()
    .isString()
    .withMessage("Breakfast must be a string"),
  body("menuItems.*.lunch")
    .optional()
    .isString()
    .withMessage("Lunch must be a string"),
  body("menuItems.*.snack")
    .optional()
    .isString()
    .withMessage("Snack must be a string"),
  body("menuItems.*.dinner")
    .optional()
    .isString()
    .withMessage("Dinner must be a string"),
];

export const menuIdValidation = [
  param("menu_id")
    .isMongoId()
    .withMessage("Invalid menu ID"),
];
