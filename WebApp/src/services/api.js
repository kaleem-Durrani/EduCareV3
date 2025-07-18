import axios from "axios";
import { API_BASE_URL, SERVER_URL } from "../constants/api.js";

// Flag to prevent multiple logout events
let isLoggingOut = false;

// Listen for manual logout events to reset the flag
window.addEventListener("auth:manualLogout", () => {
  isLoggingOut = false;
});

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token and handle FormData
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If data is FormData, remove Content-Type header to let axios set it automatically
    // This is crucial for file uploads to work properly
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Prevent multiple logout events
      if (!isLoggingOut) {
        isLoggingOut = true;

        // Unauthorized - clear token and trigger logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Dispatch custom event to notify AuthContext
        window.dispatchEvent(new CustomEvent("auth:forceLogout"));

        // Redirect to login page after a short delay to allow context to update
        setTimeout(() => {
          window.location.href = "/login";
          // Reset flag after redirect
          isLoggingOut = false;
        }, 100);
      }
    }

    // Log the full error response for debugging
    console.log("API Error Response:", error.response?.data);
    console.log("API Error Status:", error.response?.status);
    console.log("API Error Headers:", error.response?.headers);

    // DON'T transform the error - preserve the original axios error structure
    // This allows our error handling utilities to access the full response
    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  // GET request
  get: async (url, config = {}) => {
    try {
      const response = await apiClient.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    try {
      const response = await apiClient.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Re-export services from individual files
export { authService } from "./authService.js";
export { adminService } from "./adminService.js";
export { classService } from "./classService.js";
export { studentService } from "./studentService.js";
export { teacherService } from "./teacherService.js";
export { parentService } from "./parentService.js";
export { menuService } from "./menuService.js";
export { reportService } from "./reportService.js";
export { planService } from "./planService.js";
export { activityService } from "./activityService.js";
export { healthService } from "./healthService.js";
export { feeService } from "./feeService.js";
export { boxService } from "./boxService.js";
export { documentService } from "./documentService.js";
export { postService } from "./postService.js";
export { lostItemService } from "./lostItemService.js";

// Export SERVER_URL for use in components (e.g., for image URLs)
export { SERVER_URL };

export default apiClient;
