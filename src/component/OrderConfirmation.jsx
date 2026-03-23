// OrderConfirmation.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentMethod = location.state?.paymentMethod || "online";

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Order Received!
        </h2>

        {paymentMethod === "whatsapp" ? (
          <>
            <p className="text-gray-600 mb-4">
              Thank you for your order! We've received your request via WhatsApp
              and will contact you shortly to confirm your order details and
              arrange payment.
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-green-800">
                Please keep your phone handy for our WhatsApp message to
                complete your order.
              </p>
            </div>
          </>
        ) : (
          <p className="text-gray-600 mb-4">
            Thank you for your order! Your payment was successful and your order
            is being processed.
          </p>
        )}

        <button
          onClick={() => navigate("/products")}
          className="w-full bg-[#2E8B57] text-white py-2 px-4 rounded-md hover:bg-[#1a6b3a] transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
