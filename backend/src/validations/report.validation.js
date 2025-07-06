import { body, param } from "express-validator";

// Custom validation function for week period
const validateWeekPeriod = (value, { req }) => {
  const { weekStart, weekEnd } = req.body;
  if (weekStart && weekEnd) {
    const startDate = new Date(weekStart);
    const endDate = new Date(weekEnd);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    if (daysDiff !== 6) {
      throw new Error("Week period must be exactly 7 days (Monday to Sunday)");
    }
  }
  return true;
};

// Custom validation function for daily reports uniqueness
const validateDailyReportsUniqueness = (dailyReports) => {
  if (dailyReports && Array.isArray(dailyReports)) {
    const days = dailyReports.map(report => report.day);
    const uniqueDays = [...new Set(days)];

    if (days.length !== uniqueDays.length) {
      throw new Error("Each day can only appear once in daily reports");
    }

    // Ensure only valid weekdays (Sunday to Saturday)
    const validDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const invalidDays = days.filter(day => !validDays.includes(day));
    if (invalidDays.length > 0) {
      throw new Error(`Invalid days found: ${invalidDays.join(", ")}. Only Sun, Mon, Tue, Wed, Thu, Fri, Sat are allowed`);
    }
  }
  return true;
};

export const createReportValidation = [
  body("student_id")
    .isMongoId()
    .withMessage("Invalid student ID"),
  body("weekStart")
    .isISO8601()
    .withMessage("Please provide a valid week start date"),
  body("weekEnd")
    .isISO8601()
    .withMessage("Please provide a valid week end date")
    .custom(validateWeekPeriod),
  body("dailyReports")
    .optional()
    .isArray()
    .withMessage("Daily reports must be an array")
    .custom(validateDailyReportsUniqueness),
  body("dailyReports.*.day")
    .optional()
    .isIn(["M", "T", "W", "Th", "F"])
    .withMessage("Day must be one of: M, T, W, Th, F"),
  body("dailyReports.*.toilet")
    .optional()
    .isString()
    .withMessage("Toilet field must be a string"),
  body("dailyReports.*.food_intake")
    .optional()
    .isString()
    .withMessage("Food intake field must be a string"),
  body("dailyReports.*.friends_interaction")
    .optional()
    .isString()
    .withMessage("Friends interaction field must be a string"),
  body("dailyReports.*.studies_mood")
    .optional()
    .isString()
    .withMessage("Studies mood field must be a string"),
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
    .withMessage("Please provide a valid week end date")
    .custom(validateWeekPeriod),
  body("dailyReports")
    .optional()
    .isArray()
    .withMessage("Daily reports must be an array")
    .custom(validateDailyReportsUniqueness),
  body("dailyReports.*.day")
    .optional()
    .isIn(["M", "T", "W", "Th", "F"])
    .withMessage("Day must be one of: M, T, W, Th, F"),
  body("dailyReports.*.toilet")
    .optional()
    .isString()
    .withMessage("Toilet field must be a string"),
  body("dailyReports.*.food_intake")
    .optional()
    .isString()
    .withMessage("Food intake field must be a string"),
  body("dailyReports.*.friends_interaction")
    .optional()
    .isString()
    .withMessage("Friends interaction field must be a string"),
  body("dailyReports.*.studies_mood")
    .optional()
    .isString()
    .withMessage("Studies mood field must be a string"),
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
  body("reports.*.dailyReports")
    .optional()
    .isArray()
    .withMessage("Daily reports must be an array"),
  body("reports.*.dailyReports.*.day")
    .optional()
    .isIn(["M", "T", "W", "Th", "F"])
    .withMessage("Day must be one of: M, T, W, Th, F"),
  body("reports.*.dailyReports.*.toilet")
    .optional()
    .isString()
    .withMessage("Toilet field must be a string"),
  body("reports.*.dailyReports.*.food_intake")
    .optional()
    .isString()
    .withMessage("Food intake field must be a string"),
  body("reports.*.dailyReports.*.friends_interaction")
    .optional()
    .isString()
    .withMessage("Friends interaction field must be a string"),
  body("reports.*.dailyReports.*.studies_mood")
    .optional()
    .isString()
    .withMessage("Studies mood field must be a string"),
];
