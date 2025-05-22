import axios from 'axios';
import { CONFIG } from '../constants/config';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common responses and errors
api.interceptors.response.use(
  (response) => {
    // Return the response data in a consistent format
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
      error: null,
    };
  },
  (error) => {
    // Handle different types of errors
    let errorResponse = {
      data: null,
      status: error.response?.status || 500,
      headers: error.response?.headers || {},
      error: {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        details: null,
      },
    };

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem(CONFIG.TOKEN_KEY);
          localStorage.removeItem(CONFIG.ROLE_KEY);
          errorResponse.error = {
            message: data?.error || 'Authentication failed. Please login again.',
            code: 'UNAUTHORIZED',
            details: data,
          };
          // Redirect to login if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden
          errorResponse.error = {
            message: data?.error || 'You do not have permission to perform this action.',
            code: 'FORBIDDEN',
            details: data,
          };
          break;
          
        case 404:
          // Not found
          errorResponse.error = {
            message: data?.error || 'The requested resource was not found.',
            code: 'NOT_FOUND',
            details: data,
          };
          break;
          
        case 422:
          // Validation error
          errorResponse.error = {
            message: data?.error || 'Validation failed.',
            code: 'VALIDATION_ERROR',
            details: data,
          };
          break;
          
        case 500:
          // Server error
          errorResponse.error = {
            message: data?.error || 'Internal server error. Please try again later.',
            code: 'SERVER_ERROR',
            details: data,
          };
          break;
          
        default:
          errorResponse.error = {
            message: data?.error || `Request failed with status ${status}`,
            code: 'REQUEST_FAILED',
            details: data,
          };
      }
    } else if (error.request) {
      // Network error
      errorResponse.error = {
        message: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR',
        details: error.request,
      };
    } else {
      // Other error
      errorResponse.error = {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        details: error,
      };
    }

    return errorResponse;
  }
);

// Helper functions for different HTTP methods
export const apiClient = {
  // GET request
  get: async (url, config = {}) => {
    return await api.get(url, config);
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    return await api.post(url, data, config);
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    return await api.put(url, data, config);
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    return await api.patch(url, data, config);
  },

  // DELETE request
  delete: async (url, config = {}) => {
    return await api.delete(url, config);
  },

  // File upload
  upload: async (url, formData, config = {}) => {
    return await api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
    });
  },

  // Download file
  download: async (url, config = {}) => {
    return await api.get(url, {
      ...config,
      responseType: 'blob',
    });
  },
};

// Export the configured axios instance for direct use if needed
export default api;
