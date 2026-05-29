// src/component/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        {/* Desktop Back Button & Title */}
        <div className="hidden md:flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 transition font-medium"
          >
            ← Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Add a test button for alternative back method */}
        <div className="mb-4 p-2 bg-yellow-100 rounded hidden">
          <button onClick={handleBackAlternative} className="text-sm text-blue-600">
            Test Alternative Back
          </button>
        </div>

        {/* Stats Cards with Entrance Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={animateCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-white p-5 sm:p-6 lg:p-7 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-sm sm:text-base font-semibold text-gray-600 mb-2 sm:mb-3">
                {stat.title}
              </h3>
              <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sm:p-6 lg:p-7 mb-8 sm:mb-10">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {quickActions.map((action, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  console.log(`Navigating to: ${action.path}`);
                  navigate(action.path, { state: action.state });
                }}
                className={`${action.color} text-white py-3 sm:py-4 px-4 sm:px-5 rounded-lg hover:opacity-90 transition text-sm sm:text-base font-semibold w-full shadow-sm`}
              >
                {action.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Admin Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sm:p-6 lg:p-7"
        >
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-6">Admin Information</h2>
          <div className="space-y-4 text-sm sm:text-base">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <span className="font-semibold text-gray-700 min-w-fit">Logged in as:</span>
              <span className="text-gray-900 break-all bg-gray-50 px-3 py-1 rounded">{user?.phone_number || user?.email || "Admin User"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <span className="font-semibold text-gray-700 min-w-fit">User Type:</span>
              <span className="text-[#2E8B57] font-semibold bg-green-50 px-3 py-1 rounded">Administrator</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <span className="font-semibold text-gray-700 min-w-fit">Last Login:</span>
              <span className="text-gray-900">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
