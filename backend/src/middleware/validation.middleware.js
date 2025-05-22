import { validationResult } from "express-validator";
import { sendValidationError } from "../utils/response.utils.js";

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return sendValidationError(res, formattedErrors);
  }
  
  next();
};
