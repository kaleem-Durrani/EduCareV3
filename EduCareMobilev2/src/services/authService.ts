import { api } from './api';
import { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
  role: 'parent' | 'teacher' | 'admin';
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface AuthResponse {
  data: LoginResponse;
  success: boolean;
  message: string;
}

export class AuthService {
  static async login(credentials: LoginRequest) {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response;
  }

  static async logout() {
    // If you have a logout endpoint
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Handle logout error if needed
    }
  }

  static async forgotPassword(email: string) {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  }

  static async resetPassword(token: string, password: string) {
    const response = await api.post('/auth/reset-password', { token, password });
    return response;
  }

  static async refreshToken() {
    const response = await api.post('/auth/refresh');
    return response;
  }

  static async verifyToken() {
    const response = await api.get('/auth/verify');
    return response;
  }
}
