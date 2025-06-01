import { body, param } from "express-validator";

export const createMenuValidation = [
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
    .withMessage("Each menu item must be a string"),
];

export const updateMenuValidation = [
  param("menu_id").isMongoId().withMessage("Invalid menu ID"),
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
    .withMessage("Each menu item must be a string"),
];

export const menuIdValidation = [
  param("menu_id").isMongoId().withMessage("Invalid menu ID"),
];
