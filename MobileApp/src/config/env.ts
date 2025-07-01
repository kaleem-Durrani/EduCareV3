import Constants from 'expo-constants';

// Environment configuration
const ENV = {
  // API Configuration
  API_BASE_URL: Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:5500/api',
  SERVER_URL: Constants.expoConfig?.extra?.serverUrl || 'http://localhost:5500',
  
  // Debug Configuration
  DEBUG_MODE: Constants.expoConfig?.extra?.debugMode || __DEV__,
  ENABLE_LOGGING: Constants.expoConfig?.extra?.enableLogging || __DEV__,
  
  // App Configuration
  APP_NAME: 'EduCare Mobile',
  APP_VERSION: Constants.expoConfig?.version || '1.0.0',
};

// Helper functions for building URLs
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = ENV.API_BASE_URL.endsWith('/') 
    ? ENV.API_BASE_URL.slice(0, -1) 
    : ENV.API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

export const buildMediaUrl = (path: string): string => {
  const baseUrl = ENV.SERVER_URL.endsWith('/') 
    ? ENV.SERVER_URL.slice(0, -1) 
    : ENV.SERVER_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

// Logging functions
export const log = (...args: any[]): void => {
  if (ENV.ENABLE_LOGGING) {
    console.log('[EduCare]', ...args);
  }
};

export const logError = (...args: any[]): void => {
  if (ENV.ENABLE_LOGGING) {
    console.error('[EduCare Error]', ...args);
  }
};

export const logWarn = (...args: any[]): void => {
  if (ENV.ENABLE_LOGGING) {
    console.warn('[EduCare Warning]', ...args);
  }
};

export { ENV };
export default ENV;
