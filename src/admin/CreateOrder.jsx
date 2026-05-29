import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaTrash, FaEye, FaDownload } from "react-icons/fa";

const CreateOrder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchPhone, setSearchPhone] = useState("");

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (phone = "") => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = `${API_BASE_URL}/orders`;
      if (phone) {
        endpoint += `?phone=${phone}`;
      }
      const response = await fetch(endpoint, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "x-phone-number": localStorage.getItem("phoneNumber") || "",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(searchPhone);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "x-phone-number": localStorage.getItem("phoneNumber") || "",
        },
      });

      if (response.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        setSelectedOrder(null);
      } else {
        alert("Failed to delete order");
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Error deleting order");
    }
  };

  const downloadOrderDetails = (order) => {
    const details = `
Order ID: ${order.id}
Date: ${order.created_at || new Date().toLocaleDateString()}
Phone: ${order.phone}
Total: ₹${order.total || 0}

Items:
${
  Array.isArray(order.items)
    ? order.items
        .map((item) => `- ${item.name} (${item.size}) x ${item.quantity} = ₹${item.price * item.quantity}`)
        .join("\n")
    : "No items"
}

Delivery Address:
${order.address?.first_name || ""} ${order.address?.last_name || ""}
${order.address?.address || ""}
${order.address?.city || ""}, ${order.address?.state || ""} - ${order.address?.pincode || ""}
`;

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(details));
    element.setAttribute("download", `order_${order.id}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-4 sm:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-1">View and manage all customer orders</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 transition"
          >
            ← Back
          </button>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          onSubmit={handleSearch}
          className="mb-8 bg-white rounded-lg shadow-md p-4"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by phone number..."
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchPhone("");
                fetchOrders();
              }}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              Reset
            </button>
          </div>
        </motion.form>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2">
            {loading ? (
              <motion.div
                animate={{ opacity: [0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-center py-12 bg-white rounded-lg shadow-md"
              >
                <p className="text-gray-500">Loading orders...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
              >
                <p className="font-semibold">Error loading orders</p>
                <p className="text-sm mt-1">{error}</p>
              </motion.div>
            ) : orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 bg-white rounded-lg shadow-md"
              >
                <p className="text-gray-500 text-lg">No orders found</p>
                <p className="text-gray-400 text-sm mt-2">Orders will appear here after customers place them</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <AnimatePresence>
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedOrder?.id === order.id
                          ? "bg-green-50 border-2 border-green-500 shadow-md"
                          : "bg-white border border-gray-200 hover:border-green-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600 mt-1">Phone: {order.phone}</p>
                          <p className="text-sm text-gray-600">Date: {new Date(order.created_at || Date.now()).toLocaleDateString()}</p>
                          <p className="text-lg font-bold text-green-600 mt-2">₹{parseFloat(order.total || 0).toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                            {order.status || "Pending"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Order Details */}
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-lg shadow-md p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>

              {/* Order Header */}
              <div className="mb-6 pb-4 border-b">
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-semibold text-gray-900">#{selectedOrder.id}</p>
                <p className="text-sm text-gray-600 mt-3">Date</p>
                <p className="font-semibold text-gray-900">{new Date(selectedOrder.created_at || Date.now()).toLocaleDateString()}</p>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.name} ({item.size}) x {item.quantity}
                        </span>
                        <span className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No items in this order</p>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              {selectedOrder.address && (
                <div className="mb-6 pb-4 border-b">
                  <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
                  <p className="text-sm text-gray-700">
                    {selectedOrder.address.first_name} {selectedOrder.address.last_name}
                  </p>
                  <p className="text-sm text-gray-700">{selectedOrder.address.address}</p>
                  {selectedOrder.address.apartment && (
                    <p className="text-sm text-gray-700">{selectedOrder.address.apartment}</p>
                  )}
                  <p className="text-sm text-gray-700">
                    {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">Phone: {selectedOrder.address.phone}</p>
                </div>
              )}

              {/* Total */}
              <div className="mb-6 pb-4 border-b">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-2xl font-bold text-green-600">₹{parseFloat(selectedOrder.total || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Status</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded">
                    {selectedOrder.status || "Pending"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => downloadOrderDetails(selectedOrder)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <FaDownload size={16} />
                  Download Details
                </button>
                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  <FaTrash size={16} />
                  Delete Order
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CreateOrder;
