import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User } from '../types';
import { authService, LoginRequest } from '../services/authService';
import { log } from '../config/env';

// Storage keys
const STORAGE_KEYS = {
  TOKEN: '@educare_token',
  USER: '@educare_user',
} as const;

// Auth context interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that manages authentication state
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  /**
   * Initialize auth state from storage
   */
  const initializeAuth = async () => {
    log('Initializing auth state...');

    const [storedToken, storedUser] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
      AsyncStorage.getItem(STORAGE_KEYS.USER),
    ]);

    if (storedToken && storedUser) {
      const user = JSON.parse(storedUser);

      // Verify token is still valid
      const verifyResult = await authService.verifyToken();

      if (verifyResult.success && verifyResult.data?.valid) {
        log('Token verified successfully');
        setAuthState({
          user,
          token: storedToken,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        log('Token verification failed, clearing storage');
        await clearAuthStorage();
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } else {
      log('No stored auth data found');
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  /**
   * Clear auth storage
   */
  const clearAuthStorage = async () => {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER),
    ]);
  };

  /**
   * Login function
   */
  const login = async (credentials: LoginRequest): Promise<{ success: boolean; message?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    const result = await authService.login(credentials);

    if (result.success && result.data) {
      const { access_token, user: userData } = result.data;

      // Create user object
      const user: User = {
        _id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role as 'parent' | 'teacher' | 'admin',
      };

      // Store in AsyncStorage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, access_token),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
      ]);

      // Update state
      setAuthState({
        user,
        token: access_token,
        isLoading: false,
        isAuthenticated: true,
      });

      log('Login successful');
      return { success: true };
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        message: result.message || 'Login failed'
      };
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    log('Logging out...');
    await clearAuthStorage();
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
    log('Logout successful');
  };

  /**
   * Refresh auth state (re-verify token)
   */
  const refreshAuth = async () => {
    await initializeAuth();
  };

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
