// Export API services
export { default as api, ApiService } from './api';
export type { ApiResponse, ApiError } from './api';

// Export auth services
export { AuthService } from './authService';
export type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  UpdateProfileRequest,
  AuthResponse,
  UserResponse,
  VerifyTokenResponse,
  BackendResponse
} from './authService';

// Export other services (will be created later)
// export * from './studentService';
// export * from './teacherService';
