import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaShippingFast,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { contactApi } from "../services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp_number: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ loading: false, error: "", success: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: false });
    try {
      await contactApi.submit(formData);
      setStatus({ loading: false, error: "", success: true });
      setFormData({ name: "", whatsapp_number: "", email: "", message: "" });
    } catch (err) {
      setStatus({ loading: false, error: err.message || "Failed to send message", success: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2"
        >
          Contact Us
        </motion.h1>
        <p className="text-gray-600 text-center mb-8">
          Have a question or need help? Fill in the form below and we'll get back to you.
        </p>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6 sm:p-8 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number *</label>
            <input
              type="tel"
              name="whatsapp_number"
              value={formData.whatsapp_number}
              onChange={handleChange}
              required
              pattern="[0-9+ ]{7,15}"
              placeholder="+91 9876543210"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {status.error && (
            <p className="text-red-600 text-sm">{status.error}</p>
          )}
          {status.success && (
            <p className="text-green-600 text-sm">
              Thank you! Your message has been sent successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={status.loading}
            className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {status.loading ? "Submitting..." : "Submit"}
          </button>
        </motion.form>

        {/* Address section (same details as shown in the site footer) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 sm:p-8 mt-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            Our Address
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0 text-[#2E8B57]" />
              <span>
                Panruti, Cuddalore District
                <br />
                Tamil Nadu, India
              </span>
            </li>
            <li className="flex items-center">
              <FaPhone className="mr-3 text-[#2E8B57]" />
              <a href="tel:+919080605735" className="hover:text-[#C1440E] transition-colors">
                +91 9080605735
              </a>
            </li>
            <li className="flex items-center">
              <FaEnvelope className="mr-3 text-[#2E8B57]" />
              <a
                href="mailto:redclaycashews2022@gmail.com"
                className="hover:text-[#C1440E] transition-colors"
              >
                redclaycashews2022@gmail.com
              </a>
            </li>
            <li className="flex items-center">
              <FaShippingFast className="mr-3 text-[#2E8B57]" />
              <span>All India Delivery</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
