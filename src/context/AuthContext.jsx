import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Base URL for your backend - SIMPLIFIED VERSION
  const API_BASE_URL = "http://localhost:5000"; // Directly set to your backend URL

  // Admin configuration — store numbers as 10-digit strings (no country code)
  const ADMIN_PHONES = ["8754201900"]; // Add admin phone numbers (10-digit format)

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const isAuthenticated =
          localStorage.getItem("isAuthenticated") === "true";

        if (isAuthenticated) {
          const userData = localStorage.getItem("userData");
          if (userData) {
            const parsedData = JSON.parse(userData);
            setUser(parsedData);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid auth data
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userData");
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Listen for storage changes and custom authChange so same-tab updates work
    window.addEventListener("storage", initializeAuth);
    window.addEventListener("authChange", initializeAuth);

    return () => {
      window.removeEventListener("storage", initializeAuth);
      window.removeEventListener("authChange", initializeAuth);
    };
  }, []);

  // Check user type
  const getUserType = () => {
    return user?.user_type || "user";
  };

  const isAdmin = () => {
    // Check if user is admin based on phone number (last 10 digits) or user_type
    if (user?.phone_number) {
      const cleanNumber = user.phone_number.replace(/\D/g, "");
      const last10 = cleanNumber.slice(-10);
      return ADMIN_PHONES.includes(last10) || user.user_type === "admin";
    }
    return user?.user_type === "admin";
  };

  const isAuthenticated = () => {
    return !!user;
  };

  // OTP Authentication Methods
  const requestOTP = async (phoneNumber) => {
    try {
      setIsLoading(true);

      // Format phone number if not already formatted
      let formattedPhone = phoneNumber;
      if (!phoneNumber.startsWith("+")) {
        formattedPhone = `+91${phoneNumber}`;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/request-otp`,
        {
          phoneNumber: formattedPhone,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if this is an admin number (normalize to last 10 digits)
      const cleanNumber = phoneNumber.replace(/\D/g, "");
      const last10 = cleanNumber.slice(-10);
      const isAdminPhone = ADMIN_PHONES.includes(last10);

      return {
        success: true,
        isAdmin: isAdminPhone,
        message: "OTP sent successfully",
        data: response.data,
      };
    } catch (error) {
      console.error("OTP request error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to send OTP. Please try again.";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phoneNumber, otp) => {
    try {
      setIsLoading(true);

      // Format phone number if not already formatted
      let formattedPhone = phoneNumber;
      if (!phoneNumber.startsWith("+")) {
        formattedPhone = `+91${phoneNumber}`;
      }

      // Try the main endpoint first
      const endpoint = `${API_BASE_URL}/api/verify-otp`;

      const response = await axios.post(
        endpoint,
        {
          phoneNumber: formattedPhone,
          otp: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if verification was successful
      if (response.data.success || response.data.message === "OTP verified") {
        // Get user data from response
        const userData = response.data.user || {
          phone_number: formattedPhone,
          phoneNumber: formattedPhone,
          verified_at: new Date().toISOString(),
        };

        // Determine user type (normalize to last 10 digits)
        const cleanNumber = phoneNumber.replace(/\D/g, "");
        const last10 = cleanNumber.slice(-10);
        const isAdminPhone = ADMIN_PHONES.includes(last10);

        // Set user_type based on response or phone number check
        userData.user_type =
          response.data.user?.user_type || (isAdminPhone ? "admin" : "user");
        userData.isAdmin = userData.user_type === "admin";

        // Set user state
        setUser(userData);

        // Store in localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userType", userData.user_type);
        localStorage.setItem("phoneNumber", userData.phone_number);
        localStorage.setItem("userData", JSON.stringify(userData));

        // Trigger updates in other components
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("authChange"));

        return {
          success: true,
          user: userData,
          message: "OTP verified successfully",
          isAdmin: userData.isAdmin,
          data: response.data,
        };
      } else {
        throw new Error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid OTP. Please try again.";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      // Clear user state
      setUser(null);

      // Clear localStorage
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userType");
      localStorage.removeItem("phoneNumber");
      localStorage.removeItem("userData");

      console.log("Logout successful");

      // Trigger updates in other components
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("authChange"));

      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed. Please try again.");
    }
  };

  // Check if phone number is admin
  const checkIfAdminPhone = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const last10 = cleanNumber.slice(-10);
    return ADMIN_PHONES.includes(last10);
  };

  // Clear auth (for testing/debugging)
  const clearAuth = () => {
    logout();
    setIsLoading(false);
    setIsInitialized(true);
  };

  const value = {
    // State
    user,
    isLoading,
    isInitialized,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    userType: getUserType(),

    // Auth Methods
    requestOTP,
    verifyOTP,
    logout,
    clearAuth,

    // Utility Methods
    checkIfAdminPhone,

    // Direct state setter (use carefully)
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
