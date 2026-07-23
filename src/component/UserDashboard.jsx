import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const statusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "paid":
    case "delivered":
      return "bg-green-100 text-green-700";
    case "failed":
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
      <rect width="64" height="64" fill="#f3f4f6"/>
      <text x="32" y="36" font-size="9" text-anchor="middle" fill="#9ca3af" font-family="sans-serif">No Image</text>
    </svg>`
  );

const ORDER_STATUS_OPTIONS = [
  { value: "pending",     label: "Pending" },
  { value: "confirmed",   label: "Order Confirmed" },
  { value: "shipped",     label: "Shipped" },
  { value: "on_the_way",  label: "On the Way" },
  { value: "delivered",   label: "Delivered" },
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const phone = localStorage.getItem("phoneNumber") || localStorage.getItem("phone");
    if (!phone) {
      setLoading(false);
      return;
    }
    orderApi
      .getByPhone(phone)
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await orderApi.updateStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: status } : o))
      );
    } catch (e) {
      alert(e.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/address")}
          className="text-[#2E8B57] hover:underline font-medium text-sm mb-4 inline-block"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-[#2E8B57] mb-6">View Orders</h1>

        {loading && <p className="text-gray-500 text-sm">Loading your orders…</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400 text-sm">
            You haven't placed any orders yet.
          </div>
        )}

        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-4">
                <div>
                  <p className="text-sm font-bold text-gray-800">Order #{order.id}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusColor(order.payment_status)}`}>
                    Payment: {order.payment_status || "pending"}
                  </span>
                  {isAdmin ? (
                    <select
                      value={order.order_status || "pending"}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border-0 cursor-pointer
                        disabled:opacity-60 ${statusColor(order.order_status)}`}
                    >
                      {ORDER_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusColor(order.order_status)}`}>
                      {ORDER_STATUS_OPTIONS.find((o) => o.value === order.order_status)?.label
                        || order.order_status || "Pending"}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="h-14 w-14 flex-shrink-0 bg-gray-50 rounded-xl border border-gray-100 p-1.5">
                      <img
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.name}
                        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Size: {item.size} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-start justify-between gap-3 border-t border-gray-100 pt-4">
                <div className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-bold text-gray-700">Delivered to: </span>
                  {order.first_name} {order.last_name}, {order.address}, {order.city},{" "}
                  {order.state} — {order.pincode}
                  {order.phone && (
                    <>
                      <br />
                      <span className="font-bold text-gray-700">Phone: </span>
                      {order.phone}
                    </>
                  )}
                </div>
                <p className="text-base font-extrabold text-[#C1440E] flex-shrink-0">
                  ₹{Number(order.total_amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
