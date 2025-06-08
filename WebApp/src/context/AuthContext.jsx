import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/index.js";
import { message } from "antd";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Listen for logout events from API interceptor
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      message.warning("Session expired. Please login again.");
    };

    window.addEventListener("auth:forceLogout", handleForceLogout);

    return () => {
      window.removeEventListener("auth:forceLogout", handleForceLogout);
    };
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
      console.log(response);

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

    // Reset any logout flags in the API client
    window.dispatchEvent(new CustomEvent("auth:manualLogout"));
  };

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token) {
        setLoading(false);
        return;
      }

      // If we have stored user data, use it immediately
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Try to verify token with backend (optional verification)
      try {
        const response = await authService.verifyToken();
        if (response.success) {
          setUser(response.data.user);
        }
      } catch (verifyError) {
        // If token verification fails but we have stored user, keep them logged in
        // Only logout if we don't have stored user data
        if (!storedUser) {
          console.warn("Token verification failed and no stored user data");
          logout();
        } else {
          console.warn("Token verification failed but using stored user data");
        }
      }
    } catch (error) {
      // Only logout if we don't have any stored user data
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        logout();
      } else {
        setUser(JSON.parse(storedUser));
      }
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
