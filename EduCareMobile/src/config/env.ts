import Constants from 'expo-constants';

// Environment variables configuration
interface EnvConfig {
  API_BASE_URL: string;
  SERVER_URL: string;
  APP_NAME: string;
  APP_VERSION: string;
  DEBUG_MODE: boolean;
  ENABLE_LOGGING: boolean;
  NODE_ENV: string;
}

// Get environment variables from Expo Constants
const getEnvVars = (): EnvConfig => {
  // In development, Expo automatically loads .env files
  // In production, these would come from build-time configuration
  
  const env = {
    API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://10.0.2.2:5000/api',
    SERVER_URL: process.env.EXPO_PUBLIC_SERVER_URL || process.env.SERVER_URL || 'http://10.0.2.2:5000',
    APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || process.env.APP_NAME || 'EduCare Mobile',
    APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION || process.env.APP_VERSION || '1.0.0',
    DEBUG_MODE: (process.env.EXPO_PUBLIC_DEBUG_MODE || process.env.DEBUG_MODE || 'true') === 'true',
    ENABLE_LOGGING: (process.env.EXPO_PUBLIC_ENABLE_LOGGING || process.env.ENABLE_LOGGING || 'true') === 'true',
    NODE_ENV: process.env.NODE_ENV || 'development',
  };

  return env;
};

// Export the configuration
export const ENV = getEnvVars();

// Helper functions
export const isProduction = () => ENV.NODE_ENV === 'production';
export const isDevelopment = () => ENV.NODE_ENV === 'development';
export const isDebugMode = () => ENV.DEBUG_MODE;

// API URL builders
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = ENV.API_BASE_URL.endsWith('/') 
    ? ENV.API_BASE_URL.slice(0, -1) 
    : ENV.API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

export const buildMediaUrl = (mediaPath: string): string => {
  if (!mediaPath) return '';

  // If it's already a full URL, return as is
  if (mediaPath.startsWith('http')) return mediaPath;

  const baseUrl = ENV.SERVER_URL.endsWith('/')
    ? ENV.SERVER_URL.slice(0, -1)
    : ENV.SERVER_URL;
  const cleanPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
  return `${baseUrl}${cleanPath}`;
};

// Backward compatibility - alias for buildMediaUrl
export const buildImageUrl = buildMediaUrl;

// Logging helper
export const log = (...args: any[]) => {
  if (ENV.ENABLE_LOGGING && isDevelopment()) {
    console.log('[EduCare]', ...args);
  }
};

export const logError = (...args: any[]) => {
  if (ENV.ENABLE_LOGGING) {
    console.error('[EduCare Error]', ...args);
  }
};

// Export default configuration
export default ENV;
