/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
export const sendSuccess = (
  res,
  data = null,
  message = "Success",
  statusCode = 200
) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {*} errors - Validation errors or additional error details
 */
export const sendError = (
  res,
  message = "Error",
  statusCode = 500,
  errors = null
) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }
  console.log(response);

  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors array
 */
export const sendValidationError = (res, errors) => {
  return sendError(res, "Validation failed", 400, errors);
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {string} resource - Resource name that was not found
 */
export const sendNotFound = (res, resource = "Resource") => {
  return sendError(res, `${resource} not found`, 404);
};

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Unauthorized message
 */
export const sendUnauthorized = (res, message = "Unauthorized") => {
  return sendError(res, message, 401);
};

/**
 * Send forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Forbidden message
 */
export const sendForbidden = (res, message = "Forbidden") => {
  return sendError(res, message, 403);
};
