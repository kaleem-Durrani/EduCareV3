import { ApiService } from './api';
import { ApiResponse, User } from '../types';

// Auth request/response types
export interface LoginRequest {
  email: string;
  password: string;
  role: 'parent' | 'teacher' | 'admin';
}

export interface LoginResponse {
  access_token: string;
  role: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'parent' | 'teacher' | 'admin';
  name?: string;
  phone?: string;
  address?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

/**
 * Authentication service for handling all auth-related API calls
 */
export const authService = {
  /**
   * Login user with email, password, and role
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return ApiService.post<LoginResponse>('/login', credentials);
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterRequest): Promise<ApiResponse<any>> => {
    return ApiService.post('/register', userData);
  },

  /**
   * Send forgot password email
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<any>> => {
    return ApiService.post('/forgot-password', data);
  },

  /**
   * Verify if current token is valid
   */
  verifyToken: async (): Promise<ApiResponse<VerifyTokenResponse>> => {
    return ApiService.get<VerifyTokenResponse>('/verify-token');
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData: UpdateProfileRequest): Promise<ApiResponse<any>> => {
    return ApiService.put('/update-profile', profileData);
  },
};
