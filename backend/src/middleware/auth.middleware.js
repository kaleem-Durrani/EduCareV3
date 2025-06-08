import { verifyToken } from "../utils/jwt.utils.js";
import { sendUnauthorized, sendForbidden } from "../utils/response.utils.js";
import User from "../models/user.model.js";

/**
 * Middleware to authenticate JWT token
 * Extracts token from Authorization header (Bearer token)
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendUnauthorized(res, "Access token required");
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      return sendUnauthorized(res, "Access token required");
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists and is active
    const user = await User.findById(decoded.user_id);
    if (!user || !user.is_active) {
      return sendUnauthorized(res, "Invalid or expired token");
    }

    // Add user info to request object
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return sendUnauthorized(res, "Invalid token format");
    } else if (error.name === "TokenExpiredError") {
      return sendUnauthorized(res, "Session expired. Please login again.");
    } else if (error.name === "NotBeforeError") {
      return sendUnauthorized(res, "Token not active yet");
    }

    console.error("Authentication error:", error);
    return sendUnauthorized(res, "Authentication failed");
  }
};

/**
 * Middleware to authorize specific roles
 * @param {Array} allowedRoles - Array of allowed roles
 */
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendUnauthorized(res, "Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendForbidden(res, "Insufficient permissions");
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = authorize(["admin"]);

/**
 * Middleware to check if user is admin or teacher
 */
export const requireAdminOrTeacher = authorize(["admin", "teacher"]);

/**
 * Middleware to check if user is parent
 */
export const requireParent = authorize(["parent"]);

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.substring(7);

    if (!token) {
      return next();
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.user_id);

    if (user && user.is_active) {
      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      };
    }

    next();
  } catch (error) {
    // Ignore authentication errors for optional auth
    next();
  }
};
