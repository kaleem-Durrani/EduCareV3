// Application configuration constants
export const CONFIG = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://tallal.info:5500',
  API_TIMEOUT: 10000, // 10 seconds
  
  // Authentication
  TOKEN_KEY: 'token',
  ROLE_KEY: 'role',
  
  // App Settings
  APP_NAME: 'EduCare Admin',
  APP_VERSION: '1.0.0',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  
  // UI Settings
  SIDEBAR_WIDTH: 256,
  HEADER_HEIGHT: 64,
  
  // Theme
  THEME: {
    PRIMARY_COLOR: '#7f56da',
    SECONDARY_COLOR: '#2c2143',
    SUCCESS_COLOR: '#10b981',
    WARNING_COLOR: '#f59e0b',
    ERROR_COLOR: '#ef4444',
    INFO_COLOR: '#3b82f6',
  }
};

// Environment check
export const IS_DEVELOPMENT = import.meta.env.MODE === 'development';
export const IS_PRODUCTION = import.meta.env.MODE === 'production';
