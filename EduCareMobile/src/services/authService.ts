import { api } from './api';

// Types for auth requests and responses
export interface LoginRequest {
  email: string;
  password: string;
  role: 'parent' | 'teacher' | 'admin';
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'parent' | 'teacher' | 'admin';
  name: string;
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

// Backend response wrapper
export interface BackendResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

export interface AuthResponse {
  access_token: string;
  role: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface UserResponse {
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    address?: string;
    role: string;
  };
}

export interface VerifyTokenResponse {
  valid: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Auth Service Class
export class AuthService {
  /**
   * User login
   * POST /api/login
   */
  static async login(data: LoginRequest) {
    return api.post<BackendResponse<AuthResponse>>('/login', data);
  }

  /**
   * User registration
   * POST /api/register
   */
  static async register(data: RegisterRequest) {
    return api.post<BackendResponse<UserResponse>>('/register', data);
  }

  /**
   * Forgot password
   * POST /api/forgot-password
   */
  static async forgotPassword(data: ForgotPasswordRequest) {
    return api.post<BackendResponse<null>>('/forgot-password', data);
  }

  /**
   * Verify token
   * GET /api/verify-token
   */
  static async verifyToken() {
    return api.get<BackendResponse<VerifyTokenResponse>>('/verify-token');
  }

  /**
   * Update user profile
   * PUT /api/update-profile
   */
  static async updateProfile(data: UpdateProfileRequest) {
    return api.put<BackendResponse<UserResponse>>('/update-profile', data);
  }
}

// Export default
export default AuthService;
