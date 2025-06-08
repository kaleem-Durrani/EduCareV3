import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { log, logError } from "../config/env";
import { AuthService } from "../services/authService";

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "parent" | "teacher" | "admin";
  profileImage?: string;
  // Add other user properties as needed
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string,
    role: "parent" | "teacher" | "admin"
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  error: string | null;
}

// Storage keys
const STORAGE_KEYS = {
  TOKEN: "@educare_token",
  USER: "@educare_user",
} as const;

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from storage
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      log("Initializing auth state...");

      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
      ]);

      if (storedToken && storedUser) {
        const user = JSON.parse(storedUser);
        setState({
          user,
          token: storedToken,
          isLoading: false,
          isAuthenticated: true,
        });
        log("Auth state restored from storage");
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
        log("No stored auth state found");
      }
    } catch (error) {
      logError("Failed to initialize auth state:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const login = async (
    email: string,
    password: string,
    role: "parent" | "teacher" | "admin"
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setError(null);
      setState((prev) => ({ ...prev, isLoading: true }));

      log("Login attempt for:", email, "as", role);

      // Call the actual auth service
      const response = await AuthService.login({ email, password, role });

      // Backend wraps response in { data: { data: {...}, success: true, message: "..." } }
      const { access_token, user: userData } = response.data.data;

      // Map backend user format to our User interface
      const user: User = {
        _id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role as "parent" | "teacher" | "admin",
      };

      // Store in AsyncStorage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, access_token),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
      ]);

      // Update state
      setState({
        user,
        token: access_token,
        isLoading: false,
        isAuthenticated: true,
      });

      log("Login successful");
      return { success: true };
    } catch (error: any) {
      logError("Login error:", error);
      setState((prev) => ({ ...prev, isLoading: false }));

      // Extract error message from axios error
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      log("Logging out...");

      // Clear storage
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
      ]);

      // Reset state
      setState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });

      setError(null);
      log("Logout successful");
    } catch (error) {
      logError("Logout error:", error);
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    setState((prev) => {
      if (!prev.user) return prev;

      const updatedUser = { ...prev.user, ...userData };

      // Update storage
      AsyncStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(updatedUser)
      ).catch((error) => logError("Failed to update user in storage:", error));

      return {
        ...prev,
        user: updatedUser,
      };
    });
  };

  const clearError = (): void => {
    setError(null);
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export default
export default AuthContext;
