import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV, log, logError } from '../config/env';
import { ApiResponse } from '../types';

// Storage keys
const STORAGE_KEYS = {
  TOKEN: '@educare_token',
} as const;

// Create axios instance
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    async (config) => {
      try {
        // Add auth token if available
        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (ENV.DEBUG_MODE) {
          log('API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
          });
        }

        return config;
      } catch (error) {
        logError('Request interceptor error:', error);
        return config;
      }
    },
    (error) => {
      logError('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response in development
      if (ENV.DEBUG_MODE) {
        log('API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
      }

      return response;
    },
    async (error: AxiosError) => {
      // Log error in development
      if (ENV.DEBUG_MODE) {
        logError('API Error:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
          data: error.response?.data,
        });
      }

      // Handle 401 Unauthorized - token expired or invalid
      if (error.response?.status === 401) {
        try {
          // Clear stored token
          await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
          await AsyncStorage.removeItem('@educare_user');
          
          log('Token expired, cleared storage');
        } catch (storageError) {
          logError('Failed to clear storage on 401:', storageError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create the main API instance
export const api = createApiInstance();

// Error handler function
const handleError = (error: any): ApiResponse => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      // Server responded with error status - use backend's response structure
      const errorData = axiosError.response.data as any;
      return {
        success: false,
        message: errorData?.message || 'Server error occurred',
        error: errorData?.error || `HTTP ${axiosError.response.status}`,
      };
    } else if (axiosError.request) {
      // Network error
      return {
        success: false,
        message: 'Network error. Please check your connection.',
        error: 'NETWORK_ERROR',
      };
    }
  }

  // Generic error
  return {
    success: false,
    message: 'An unexpected error occurred',
    error: 'UNKNOWN_ERROR',
  };
};

// API helper functions
export const ApiService = {
  // Generic GET request
  get: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await api.get(endpoint, config);
      // Use backend's response structure directly
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // Generic POST request
  post: async <T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await api.post(endpoint, data, config);
      // Use backend's response structure directly
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // Generic PUT request
  put: async <T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await api.put(endpoint, data, config);
      // Use backend's response structure directly
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // Generic DELETE request
  delete: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await api.delete(endpoint, config);
      // Use backend's response structure directly
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // File upload helper
  uploadFile: async <T>(
    endpoint: string,
    file: any,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<ApiResponse<T>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });

      // Use backend's response structure directly
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // Utility to check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      return !!token;
    } catch {
      return false;
    }
  },

  // Utility to get stored token
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch {
      return null;
    }
  },
};

// Export default instance
export default api;
