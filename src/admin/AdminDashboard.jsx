// src/component/AdminDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProductList from "./ProductList";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // keep a local toggle to avoid ReferenceErrors from older bundles/users
  const [showProducts, setShowProducts] = useState(false);

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-2xl font-bold text-[#2E8B57]">1,234</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-2xl font-bold text-[#C1440E]">₹ 2,45,670</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Users</h3>
          <p className="text-2xl font-bold text-[#2E8B57]">456</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() =>
              navigate("/admin/products", { state: { openCreate: true } })
            }
            className="bg-[#2E8B57] text-white py-3 rounded-lg hover:bg-[#1a6b3a] transition"
          >
            Manage Products
          </button>
          <button
            onClick={() =>
              navigate("/admin/premium-cashews", { state: { openCreate: true } })
            }
            className="bg-[#2E8B57] text-white py-3 rounded-lg hover:bg-[#1a6b3a] transition"
          >
            Manage Premium Cashew Products
          </button>

          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-[#C1440E] text-white py-3 rounded-lg hover:bg-[#a1360b] transition"
          >
            View Orders
          </button>
          
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Admin Information</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Logged in as:</span>{" "}
            {user?.phone_number || user?.email}
          </p>
          <p>
            <span className="font-medium">User Type:</span> Admin
          </p>
          <p>
            <span className="font-medium">Last Login:</span> Just now
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
