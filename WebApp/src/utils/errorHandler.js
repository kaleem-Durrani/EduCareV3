import { message, notification } from "antd";

/**
 * Enhanced error handler for API responses
 * Handles validation errors, general errors, and provides flexible display options
 */

export const ERROR_DISPLAY_TYPES = {
  MESSAGE: 'message',           // Ant Design message (toast)
  NOTIFICATION: 'notification', // Ant Design notification (detailed)
  CONSOLE: 'console',          // Console only (silent)
  RETURN: 'return',            // Return errors for manual handling
};

export const ERROR_TYPES = {
  VALIDATION: 'validation',
  NETWORK: 'network',
  SERVER: 'server',
  UNKNOWN: 'unknown',
};

/**
 * Parse error response and extract relevant information
 * @param {Object} error - Axios error object
 * @returns {Object} Parsed error information
 */
export const parseError = (error) => {
  const errorInfo = {
    type: ERROR_TYPES.UNKNOWN,
    message: 'An unexpected error occurred',
    details: [],
    statusCode: null,
    originalError: error,
  };

  if (error.response) {
    // Server responded with error status
    const { data, status } = error.response;
    errorInfo.statusCode = status;

    if (status === 400 && data?.errors && Array.isArray(data.errors)) {
      // Validation errors
      errorInfo.type = ERROR_TYPES.VALIDATION;
      errorInfo.message = data.message || 'Validation failed';
      errorInfo.details = data.errors;
    } else if (status >= 500) {
      // Server errors
      errorInfo.type = ERROR_TYPES.SERVER;
      errorInfo.message = data?.message || 'Server error occurred';
    } else {
      // Other client errors
      errorInfo.message = data?.message || `Error ${status}`;
    }
  } else if (error.request) {
    // Network error
    errorInfo.type = ERROR_TYPES.NETWORK;
    errorInfo.message = 'Network error - please check your connection';
  } else {
    // Request setup error
    errorInfo.message = error.message || 'Request failed';
  }

  return errorInfo;
};

/**
 * Format validation errors for display
 * @param {Array} errors - Array of validation error objects
 * @returns {String} Formatted error message
 */
export const formatValidationErrors = (errors) => {
  if (!Array.isArray(errors) || errors.length === 0) {
    return 'Validation failed';
  }

  // Group errors by field if they have field information
  const fieldErrors = {};
  const generalErrors = [];

  errors.forEach(error => {
    if (error.field || error.path) {
      const field = error.field || error.path;
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(error.message || error.msg || String(error));
    } else {
      generalErrors.push(error.message || error.msg || String(error));
    }
  });

  let formattedMessage = '';

  // Add field-specific errors
  Object.keys(fieldErrors).forEach(field => {
    const fieldMessages = fieldErrors[field];
    formattedMessage += `${field}: ${fieldMessages.join(', ')}\n`;
  });

  // Add general errors
  if (generalErrors.length > 0) {
    formattedMessage += generalErrors.join('\n');
  }

  return formattedMessage.trim();
};

/**
 * Display error using specified method
 * @param {Object} errorInfo - Parsed error information
 * @param {String} displayType - How to display the error
 * @param {Object} options - Additional options for display
 */
export const displayError = (errorInfo, displayType = ERROR_DISPLAY_TYPES.MESSAGE, options = {}) => {
  const {
    title = 'Error',
    duration = 4.5,
    showDetails = true,
  } = options;

  switch (displayType) {
    case ERROR_DISPLAY_TYPES.MESSAGE:
      if (errorInfo.type === ERROR_TYPES.VALIDATION && showDetails && errorInfo.details.length > 0) {
        const formattedErrors = formatValidationErrors(errorInfo.details);
        message.error({
          content: formattedErrors,
          duration,
          style: { whiteSpace: 'pre-line' },
        });
      } else {
        message.error({
          content: errorInfo.message,
          duration,
        });
      }
      break;

    case ERROR_DISPLAY_TYPES.NOTIFICATION:
      if (errorInfo.type === ERROR_TYPES.VALIDATION && showDetails && errorInfo.details.length > 0) {
        const formattedErrors = formatValidationErrors(errorInfo.details);
        notification.error({
          message: title,
          description: formattedErrors,
          duration,
          style: { whiteSpace: 'pre-line' },
        });
      } else {
        notification.error({
          message: title,
          description: errorInfo.message,
          duration,
        });
      }
      break;

    case ERROR_DISPLAY_TYPES.CONSOLE:
      console.error('API Error:', errorInfo);
      break;

    case ERROR_DISPLAY_TYPES.RETURN:
      // Don't display, just return for manual handling
      break;

    default:
      console.warn('Unknown error display type:', displayType);
      message.error(errorInfo.message);
  }

  return errorInfo;
};

/**
 * Main error handler function
 * @param {Object} error - Axios error object
 * @param {Object} options - Configuration options
 * @returns {Object} Parsed error information
 */
export const handleApiError = (error, options = {}) => {
  const {
    displayType = ERROR_DISPLAY_TYPES.MESSAGE,
    showValidationDetails = true,
    customMessage = null,
    onError = null,
    ...displayOptions
  } = options;

  const errorInfo = parseError(error);

  // Use custom message if provided
  if (customMessage) {
    errorInfo.message = customMessage;
  }

  // Display error unless it's RETURN type
  if (displayType !== ERROR_DISPLAY_TYPES.RETURN) {
    displayError(errorInfo, displayType, {
      ...displayOptions,
      showDetails: showValidationDetails,
    });
  }

  // Call custom error handler if provided
  if (typeof onError === 'function') {
    onError(errorInfo);
  }

  return errorInfo;
};

/**
 * Convenience function for handling validation errors specifically
 * @param {Object} error - Axios error object
 * @param {Object} options - Configuration options
 * @returns {Object} Parsed error information
 */
export const handleValidationError = (error, options = {}) => {
  return handleApiError(error, {
    displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
    showValidationDetails: true,
    title: 'Validation Error',
    ...options,
  });
};

/**
 * Convenience function for silent error handling (returns errors for manual processing)
 * @param {Object} error - Axios error object
 * @returns {Object} Parsed error information
 */
export const getErrorInfo = (error) => {
  return handleApiError(error, {
    displayType: ERROR_DISPLAY_TYPES.RETURN,
  });
};
