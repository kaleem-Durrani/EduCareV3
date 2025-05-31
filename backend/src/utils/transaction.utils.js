import mongoose from "mongoose";

/**
 * Executes a function within a MongoDB transaction if replica set is available,
 * otherwise executes without transaction
 *
 * @param {Function} callback Function to execute within the transaction
 * @returns {Promise} Result of the callback function
 */
export const withTransaction = async (callback) => {
  // Check if we're running on a replica set
  const isReplicaSet = await checkReplicaSet();

  if (isReplicaSet) {
    // Use transactions
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } else {
    // Execute without transaction (for standalone MongoDB)
    console.warn(
      "⚠️  Running without transactions - MongoDB standalone mode detected"
    );
    return await callback(null);
  }
};

/**
 * Check if MongoDB is running as a replica set
 * @returns {Promise<boolean>} True if replica set, false if standalone
 */
const checkReplicaSet = async () => {
  try {
    const admin = mongoose.connection.db.admin();
    const result = await admin.command({ isMaster: 1 });
    return !!result.setName; // Returns true if part of a replica set
  } catch (error) {
    console.warn("Could not check replica set status:", error.message);
    return false;
  }
};

/**
 * Helper function to execute Mongoose operations with optional session
 * @param {Object} model - Mongoose model
 * @param {string} operation - Operation name (findOne, save, findByIdAndUpdate, etc.)
 * @param {Array} args - Arguments for the operation
 * @param {Object|null} session - MongoDB session (null for standalone)
 * @returns {Promise} Result of the operation
 */
export const executeWithSession = async (model, operation, args, session) => {
  if (session && typeof model[operation] === "function") {
    // For query operations, add session to the query
    if (
      [
        "findOne",
        "find",
        "findById",
        "findByIdAndUpdate",
        "findOneAndUpdate",
      ].includes(operation)
    ) {
      return await model[operation](...args).session(session);
    }
    // For save operations, pass session as option
    if (operation === "save") {
      return await model[operation]({ session });
    }
  }

  // Execute without session
  return await model[operation](...args);
};

/**
 * Executes multiple operations within a single transaction
 * Useful for complex operations that need to be atomic
 *
 * @param {Array} operations Array of operation functions
 * @returns {Promise} Array of results from all operations
 */
export const withMultipleOperations = async (operations) => {
  return withTransaction(async (session) => {
    const results = [];
    for (const operation of operations) {
      const result = await operation(session);
      results.push(result);
    }
    return results;
  });
};

/**
 * Custom error class for API errors with status codes
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Wrapper for async functions to handle errors consistently
 * Eliminates the need for try-catch blocks in controllers
 *
 * @param {Function} fn Async function to wrap
 * @returns {Function} Wrapped function with error handling
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Helper functions to throw specific errors
 */
export const throwNotFound = (resource = "Resource") => {
  throw new ApiError(`${resource} not found`, 404);
};

export const throwBadRequest = (message, errors = null) => {
  throw new ApiError(message, 400, errors);
};

export const throwUnauthorized = (message = "Unauthorized") => {
  throw new ApiError(message, 401);
};

export const throwForbidden = (message = "Forbidden") => {
  throw new ApiError(message, 403);
};

export const throwConflict = (message) => {
  throw new ApiError(message, 409);
};

export const throwValidationError = (message, errors) => {
  throw new ApiError(message, 422, errors);
};
