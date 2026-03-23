// src/component/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = ["user", "admin"] }) => {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (isLoading) {
    return React.createElement(
      "div",
      { className: "flex justify-center items-center h-[60vh]" },
      React.createElement("div", {
        className:
          "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C1440E]",
      })
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return React.createElement(Navigate, {
      to: "/login",
      state: { from: location.pathname },
      replace: true,
    });
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(userType)) {
    // Show access denied for unauthorized roles
    return React.createElement(
      "div",
      { className: "container mx-auto p-8 text-center" },
      [
        React.createElement(
          "h1",
          { key: "title", className: "text-2xl font-bold text-red-600 mb-4" },
          "Access Denied"
        ),
        React.createElement(
          "p",
          { key: "message", className: "text-gray-600 mb-4" },
          "You don't have permission to access this page."
        ),
        React.createElement(
          "button",
          {
            key: "button",
            onClick: () => window.history.back(),
            className:
              "bg-[#2E8B57] text-white px-6 py-2 rounded-lg hover:bg-[#C1440E] transition",
          },
          "Go Back"
        ),
      ]
    );
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;
