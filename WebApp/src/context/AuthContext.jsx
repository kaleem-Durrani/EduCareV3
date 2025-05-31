import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api.js";
import { message } from "antd";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await authService.login({ email, password, role });

      if (response.success) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        message.success("Login successful!");
        return response.data;
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      message.error(error.message || "Login failed");
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);

      if (response.success) {
        message.success("Registration successful! Please login.");
        return response.data;
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      message.error(error.message || "Registration failed");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    message.success("Logged out successfully");
  };

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token) {
        setLoading(false);
        return;
      }

      // Try to verify token with backend
      const response = await authService.verifyToken();

      if (response.success) {
        setUser(response.data.user);
      } else {
        // If verification fails, use stored user data if available
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          logout();
        }
      }
    } catch (error) {
      // If verification fails, clear auth data
      logout();
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);

      if (response.success) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        message.success("Profile updated successfully!");
        return response.data;
      } else {
        throw new Error(response.message || "Profile update failed");
      }
    } catch (error) {
      message.error(error.message || "Profile update failed");
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);

      if (response.success) {
        message.success("Password reset instructions sent to your email!");
        return response.data;
      } else {
        throw new Error(response.message || "Password reset failed");
      }
    } catch (error) {
      message.error(error.message || "Password reset failed");
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
