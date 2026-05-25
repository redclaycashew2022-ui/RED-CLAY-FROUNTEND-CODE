// src/component/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [animateCards, setAnimateCards] = useState(false);

  // Trigger entrance animation after component mounts
  useEffect(() => {
    setTimeout(() => setAnimateCards(true), 100);
    // Log when component mounts
    console.log("AdminDashboard mounted");
    console.log("Current location:", location.pathname);
    console.log("Location state:", location.state);
    console.log("History length:", window.history.length);
  }, [location]);

  const handleBack = () => {
    console.log("=== Back Button Clicked ===");
    console.log("History length:", window.history.length);
    console.log("Current path:", location.pathname);
    console.log("Location state:", location.state);
    
    // Try different methods
    if (window.history.length > 1) {
      console.log("Attempting navigate(-1)");
      navigate(-1);
      
      // Check if navigation happened after a small delay
      setTimeout(() => {
        console.log("After navigation attempt, current path:", window.location.pathname);
        if (window.location.pathname === location.pathname) {
          console.log("Navigation failed! Still on same page.");
          // Force navigation to home/products
          navigate("/");
        }
      }, 100);
    } else {
      console.log("No history found, navigating to home");
      navigate("/");
    }
  };

  // Alternative back method using window.history directly
  const handleBackAlternative = () => {
    console.log("Using alternative back method");
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  const statsData = [
    { title: "Total Orders", value: "1,234", color: "text-[#2E8B57]" },
    { title: "Revenue", value: "₹ 2,45,670", color: "text-[#C1440E]" },
    { title: "Users", value: "456", color: "text-[#2E8B57]" },
  ];

  const quickActions = [
    {
      label: "Manage Products",
      path: "/admin/products",
      color: "bg-[#2E8B57] hover:bg-[#1a6b3a]",
      state: { openCreate: true },
    },
    {
      label: "Manage Premium Cashews",
      path: "/admin/premium-cashews",
      color: "bg-[#2E8B57] hover:bg-[#1a6b3a]",
      state: { openCreate: true },
    },
    {
      label: "View Orders",
      path: "/admin/orders",
      color: "bg-[#C1440E] hover:bg-[#a1360b]",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="w-8"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Desktop Back Button & Title */}
        <div className="hidden md:flex items-center mb-6">
          <button
            onClick={handleBack}
            className="mr-4 px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 transition"
          >
            ← Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Add a test button for alternative back method */}
        <div className="mb-4 p-2 bg-yellow-100 rounded hidden">
          <button onClick={handleBackAlternative} className="text-sm text-blue-600">
            Test Alternative Back
          </button>
        </div>

        {/* Stats Cards with Entrance Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={`bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 transform transition-all duration-500 ease-out ${
                animateCards ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <h3 className="text-sm sm:text-base font-semibold text-gray-600 mb-1 sm:mb-2">
                {stat.title}
              </h3>
              <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  console.log(`Navigating to: ${action.path}`);
                  navigate(action.path, { state: action.state });
                }}
                className={`${action.color} text-white py-3 px-4 rounded-lg transition text-sm sm:text-base font-medium w-full`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Information */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Admin Information</h2>
          <div className="space-y-2 text-sm sm:text-base">
            <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium text-gray-700">Logged in as:</span>
              <span className="text-gray-900 break-all">{user?.phone_number || user?.email || "Admin User"}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">User Type:</span>{" "}
              <span className="text-[#2E8B57] font-medium">Administrator</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Last Login:</span>{" "}
              <span className="text-gray-900">{new Date().toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;