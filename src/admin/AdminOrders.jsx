// src/admin/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../services/api";

const STATUS_FLOW = ["pending", "confirmed", "packed", "shipped", "delivered"];

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  packed: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const NEXT_STATUS_LABEL = {
  pending: "Confirm Order",
  confirmed: "Mark Packed",
  packed: "Mark Shipped",
  shipped: "Mark Delivered",
};

const nextStatus = (current) => {
  const idx = STATUS_FLOW.indexOf(current);
  return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
};

const formatDate = (d) =>
  new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const OrderRow = ({ order, onUpdateStatus, updatingId }) => {
  const [expanded, setExpanded] = useState(false);
  const isUpdating = updatingId === order.id;
  const next = nextStatus(order.order_status);
  const isFinal = order.order_status === "delivered" || order.order_status === "cancelled";
  const customerName = `${order.first_name || ""} ${order.last_name || ""}`.trim() || "—";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-left"
          >
            <p className="font-bold text-gray-900">
              Order #{order.id}{" "}
              <span className="text-xs font-normal text-gray-400">
                {expanded ? "▲" : "▼"}
              </span>
            </p>
            <p className="text-sm text-gray-600">{customerName} · {order.phone}</p>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
              STATUS_STYLES[order.order_status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {order.order_status}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
              order.payment_status === "paid"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {order.payment_status}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Delivery Address</p>
            <p className="text-gray-600 leading-relaxed">
              {order.address}
              {order.apartment ? `, ${order.apartment}` : ""}
              <br />
              {order.city}, {order.state} — {order.pincode}
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Products</p>
            <ul className="text-gray-600 space-y-0.5">
              {(order.items || []).map((item, idx) => (
                <li key={idx}>
                  • {item.name}
                  {item.size ? ` (${item.size})` : ""} × {item.quantity} — ₹{item.price}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Order Date</p>
            <p className="text-gray-600">{formatDate(order.created_at)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Amount</p>
            <p className="text-gray-900 font-bold">
              ₹{Number(order.total_amount).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {next && (
          <button
            disabled={isUpdating}
            onClick={() => onUpdateStatus(order.id, next)}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#2E8B57] hover:bg-[#246645] transition disabled:opacity-50"
          >
            {isUpdating ? "Updating…" : NEXT_STATUS_LABEL[order.order_status]}
          </button>
        )}
        {!isFinal && (
          <button
            disabled={isUpdating}
            onClick={() => {
              if (window.confirm(`Cancel order #${order.id}? The customer will be notified.`)) {
                onUpdateStatus(order.id, "cancelled");
              }
            }}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition disabled:opacity-50"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const loadOrders = () => {
    setLoading(true);
    orderApi
      .getAll()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await orderApi.updateStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, order_status: status } : o))
      );
    } catch (err) {
      alert(err.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.order_status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:hidden bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Orders</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="hidden md:flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 transition"
          >
            ← Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Orders</h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {["all", ...STATUS_FLOW, "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                filter === s
                  ? "bg-[#2E8B57] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading && <p className="text-gray-500">Loading orders…</p>}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {!loading && !error && filteredOrders.length === 0 && (
          <p className="text-gray-400 text-center py-12">No orders found.</p>
        )}

        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
              updatingId={updatingId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
