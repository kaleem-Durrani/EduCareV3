import { apiClient } from "./api";
import { API_ENDPOINTS } from "../constants/api";
import { CONFIG } from "../constants/config";

/**
 * Authentication service functions
 */
export const authService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} role - User role (admin, teacher, parent, student)
   * @returns {Promise} - API response
   */
  login: async (email, password, role = "admin") => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
      role,
    });

    // Store token and role if login successful
    if (response.data && !response.error) {
      if (response.data.access_token) {
        localStorage.setItem(CONFIG.TOKEN_KEY, response.data.access_token);
      }
      if (response.data.role) {
        localStorage.setItem(CONFIG.ROLE_KEY, response.data.role);
      }
    }

    return response;
  },

  /**
   * Register new admin user
   * @param {Object} userData - User registration data
   * @returns {Promise} - API response
   */
  register: async (userData) => {
    return await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },

  /**
   * Logout user
   * Note: Backend doesn't have logout endpoint, so we just clear local storage
   * @returns {Promise} - API response
   */
  logout: async () => {
    try {
      // TODO: Implement logout endpoint in backend for proper token invalidation
      // const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);

      // For now, just clear local storage (client-side logout only)
      localStorage.removeItem(CONFIG.TOKEN_KEY);
      localStorage.removeItem(CONFIG.ROLE_KEY);

      return {
        data: { message: "Logged out successfully" },
        error: null,
      };
    } catch (error) {
      // Even if logout fails on server, clear local storage
      localStorage.removeItem(CONFIG.TOKEN_KEY);
      localStorage.removeItem(CONFIG.ROLE_KEY);

      return {
        data: { message: "Logged out successfully" },
        error: null,
      };
    }
  },

  /**
   * Verify current token
   * @returns {Promise} - API response
   */
  verifyToken: async () => {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    if (!token) {
      return {
        data: null,
        error: {
          message: "No token found",
          code: "NO_TOKEN",
        },
      };
    }

    return await apiClient.get(API_ENDPOINTS.AUTH.VERIFY_TOKEN);
  },

  /**
   * Refresh authentication token
   * @returns {Promise} - API response
   */
  refreshToken: async () => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);

    // Update token if refresh successful
    if (response.data && !response.error && response.data.access_token) {
      localStorage.setItem(CONFIG.TOKEN_KEY, response.data.access_token);
    }

    return response;
  },

  /**
   * Get current user from token
   * @returns {Object|null} - Current user data or null
   */
  getCurrentUser: () => {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    const role = localStorage.getItem(CONFIG.ROLE_KEY);

    if (!token) {
      return null;
    }

    try {
      // Decode JWT token to get user info (basic implementation)
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        ...payload,
        role,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    if (!token) {
      return false;
    }

    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return false;
    }
  },

  /**
   * Check if user has specific role
   * @param {string} requiredRole - Required role
   * @returns {boolean} - Role check result
   */
  hasRole: (requiredRole) => {
    const role = localStorage.getItem(CONFIG.ROLE_KEY);
    return role === requiredRole;
  },

  /**
   * Clear authentication data
   */
  clearAuth: () => {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.ROLE_KEY);
  },
};
