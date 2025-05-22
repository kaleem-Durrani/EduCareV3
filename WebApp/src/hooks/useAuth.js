import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';
import useApi from './useApi';

/**
 * Enhanced authentication hook
 * @returns {Object} - Authentication state and functions
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);

  // API hooks for auth operations
  const loginApi = useApi(authService.login);
  const logoutApi = useApi(authService.logout);
  const verifyTokenApi = useApi(authService.verifyToken);

  /**
   * Initialize authentication state
   */
  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Check if user is authenticated
      if (authService.isAuthenticated()) {
        // Verify token with server
        const response = await verifyTokenApi.request();
        
        if (response && !response.error) {
          setUser(response.data.user || authService.getCurrentUser());
          setRole(response.data.user?.role || localStorage.getItem('role'));
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear auth
          authService.clearAuth();
          setUser(null);
          setRole(null);
          setIsAuthenticated(false);
        }
      } else {
        // No valid token
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      authService.clearAuth();
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [verifyTokenApi]);

  /**
   * Login function
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} userRole - User role
   * @returns {Promise} - Login result
   */
  const login = useCallback(async (email, password, userRole = 'admin') => {
    const response = await loginApi.request(email, password, userRole);
    
    if (response && !response.error) {
      const userData = response.data.user || authService.getCurrentUser();
      setUser(userData);
      setRole(response.data.role || userRole);
      setIsAuthenticated(true);
    }
    
    return response;
  }, [loginApi]);

  /**
   * Logout function
   */
  const logout = useCallback(async () => {
    await logoutApi.request();
    
    // Clear state regardless of API response
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    
    // Redirect to login page
    window.location.href = '/login';
  }, [logoutApi]);

  /**
   * Check if user has specific role
   * @param {string} requiredRole - Required role
   * @returns {boolean} - Role check result
   */
  const hasRole = useCallback((requiredRole) => {
    return role === requiredRole;
  }, [role]);

  /**
   * Check if user has any of the specified roles
   * @param {Array} roles - Array of roles
   * @returns {boolean} - Role check result
   */
  const hasAnyRole = useCallback((roles) => {
    return roles.includes(role);
  }, [role]);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    if (isAuthenticated) {
      await initializeAuth();
    }
  }, [isAuthenticated, initializeAuth]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    // State
    user,
    role,
    isAuthenticated,
    isLoading: isLoading || loginApi.isLoading || logoutApi.isLoading,
    
    // Functions
    login,
    logout,
    hasRole,
    hasAnyRole,
    refreshUser,
    
    // API states
    loginError: loginApi.error,
    loginErrorMessage: loginApi.errorMessage,
    logoutError: logoutApi.error,
    
    // Utility functions
    clearLoginError: loginApi.clearError,
    clearLogoutError: logoutApi.clearError,
  };
}

/**
 * Hook for checking authentication status without full auth context
 * @returns {Object} - Simple auth status
 */
export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
}

/**
 * Hook for role-based access control
 * @param {string|Array} requiredRoles - Required role(s)
 * @returns {Object} - Access control state
 */
export function useRoleAccess(requiredRoles) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      const userRole = localStorage.getItem('role');
      
      if (Array.isArray(requiredRoles)) {
        setHasAccess(requiredRoles.includes(userRole));
      } else {
        setHasAccess(userRole === requiredRoles);
      }
      
      setIsLoading(false);
    };

    checkAccess();
  }, [requiredRoles]);

  return { hasAccess, isLoading };
}
