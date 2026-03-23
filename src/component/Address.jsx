import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

const Address = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const isAdmin = user?.user_type === "admin";

  const [activeTab, setActiveTab] = useState("orders");
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
  });

  const [orders] = useState([]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const newAddress = {
      id: Date.now(),
      ...formData,
      country: "India",
    };

    if (formData.isDefault) {
      setAddresses((prev) =>
        prev.map((addr) => ({ ...addr, isDefault: false }))
      );
    }

    setAddresses((prev) => [...prev, newAddress]);
    setFormData({
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      isDefault: false,
    });
    setShowAddAddressForm(false);
  };

  const handleEditAddress = (id) => {
    const addressToEdit = addresses.find((addr) => addr.id === id);
    if (addressToEdit) {
      setFormData(addressToEdit);
      setShowAddAddressForm(true);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    }
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleLogout = () => {
    try {
      logout();
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      navigate("/login");
    }
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? "Admin Panel" : "My Account"}
          </h1>

          <div className="flex items-center space-x-3">
            {isAdmin ? (
              <>
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                >
                  Go to Admin Dashboard
                </button>

                <motion.button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Logout
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Tabs (hidden for admins; show admin panel instead) */}
        {!isAdmin && (
          <motion.div
            className="border-b border-gray-200 mb-8"
            variants={itemVariants}
          >
            <nav className="flex space-x-8">
              <motion.button
                onClick={() => setActiveTab("orders")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "orders"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                variants={tabVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Orders
              </motion.button>
              <motion.button
                onClick={() => setActiveTab("addresses")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "addresses"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                variants={tabVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Addresses
              </motion.button>
            </nav>
          </motion.div>
        )}

        {/* Content */}
        {isAdmin ? (
          <motion.div
            className="bg-white rounded-lg shadow-md p-6 text-center"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold mb-2">Administrator</h2>
            <p className="text-gray-600 mb-4">
              You are logged in as an admin. Use the admin dashboard to manage
              orders and products.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="px-5 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
              >
                Open Admin Dashboard
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                View User Dashboard
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            variants={itemVariants}
          >
            <AnimatePresence mode="wait">
              {activeTab === "orders" ? (
                <motion.div
                  key="orders"
                  className="text-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  {orders.length === 0 ? (
                    <motion.div
                      className="py-12"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        variants={itemVariants}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </motion.svg>
                      <motion.h3
                        className="mt-4 text-lg font-medium text-gray-900"
                        variants={itemVariants}
                      >
                        You haven't placed any orders yet.
                      </motion.h3>
                      <motion.p
                        className="mt-2 text-sm text-gray-500"
                        variants={itemVariants}
                      >
                        Start shopping to see your orders here.
                      </motion.p>
                      <motion.div className="mt-6" variants={itemVariants}>
                        <motion.button
                          onClick={handleContinueShopping}
                          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          Continue Shopping
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Your Orders
                      </h3>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="addresses"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Left Side - Address List */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Saved Addresses
                    </h2>

                    <AnimatePresence>
                      {addresses.length === 0 && !showAddAddressForm ? (
                        <motion.div
                          className="text-center py-8"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </motion.svg>
                          <h3 className="mt-4 text-lg font-medium text-gray-900">
                            You haven't saved any addresses yet
                          </h3>
                          <motion.button
                            onClick={() => setShowAddAddressForm(true)}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            Add Address
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.div
                          className="space-y-4"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <AnimatePresence>
                            {addresses.map((address, index) => (
                              <motion.div
                                key={address.id}
                                className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                layout
                              >
                                {address.isDefault && (
                                  <motion.span
                                    className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                  >
                                    Default address
                                  </motion.span>
                                )}
                                <h4 className="font-medium text-gray-900">
                                  {address.firstName} {address.lastName}
                                </h4>
                                <p className="text-gray-600">
                                  {address.address1}
                                </p>
                                {address.address2 && (
                                  <p className="text-gray-600">
                                    {address.address2}
                                  </p>
                                )}
                                <p className="text-gray-600">
                                  {address.zipCode} {address.city},{" "}
                                  {address.state}
                                </p>
                                <p className="text-gray-600">
                                  {address.country}
                                </p>

                                <div className="mt-3 flex space-x-2">
                                  <motion.button
                                    onClick={() =>
                                      handleEditAddress(address.id)
                                    }
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    Edit
                                  </motion.button>
                                  <motion.button
                                    onClick={() =>
                                      handleDeleteAddress(address.id)
                                    }
                                    className="text-red-600 hover:text-red-800 text-sm"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    Delete
                                  </motion.button>
                                  {!address.isDefault && (
                                    <motion.button
                                      onClick={() =>
                                        handleSetDefault(address.id)
                                      }
                                      className="text-green-600 hover:text-green-800 text-sm"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      Set as Default
                                    </motion.button>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>

                          {!showAddAddressForm && (
                            <motion.button
                              onClick={() => setShowAddAddressForm(true)}
                              className="w-full mt-4 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors"
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              + Add Another Address
                            </motion.button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Right Side - Add Address Form */}
                  <AnimatePresence>
                    {showAddAddressForm && (
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.4 }}
                      >
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                          {formData.id ? "Edit Address" : "Add Address"}
                        </h2>
                        <p className="text-gray-600 mb-6">
                          Please fill in the information below:
                        </p>

                        <motion.form
                          onSubmit={handleAddAddress}
                          className="space-y-4"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {/* Form fields with animations */}
                          <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            variants={itemVariants}
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name *
                              </label>
                              <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name *
                              </label>
                              <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>
                          </motion.div>

                          {/* Add other form fields here */}
                          <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Company
                            </label>
                            <input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                          </motion.div>

                          <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Address Line 1 *
                            </label>
                            <input
                              type="text"
                              name="address1"
                              value={formData.address1}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                          </motion.div>

                          <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Address Line 2
                            </label>
                            <input
                              type="text"
                              name="address2"
                              value={formData.address2}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                          </motion.div>

                          <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            variants={itemVariants}
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                City *
                              </label>
                              <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                State *
                              </label>
                              <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>
                          </motion.div>

                          <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ZIP/Postal Code *
                            </label>
                            <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                          </motion.div>

                          <motion.div
                            className="flex items-center"
                            variants={itemVariants}
                          >
                            <input
                              type="checkbox"
                              name="isDefault"
                              checked={formData.isDefault}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">
                              Set as default address
                            </label>
                          </motion.div>

                          <motion.div
                            className="flex space-x-3 pt-4"
                            variants={itemVariants}
                          >
                            <motion.button
                              type="submit"
                              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              Save
                            </motion.button>
                            <motion.button
                              type="button"
                              onClick={() => {
                                setShowAddAddressForm(false);
                                setFormData({
                                  firstName: "",
                                  lastName: "",
                                  company: "",
                                  address1: "",
                                  address2: "",
                                  city: "",
                                  state: "",
                                  zipCode: "",
                                  isDefault: false,
                                });
                              }}
                              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              Cancel
                            </motion.button>
                          </motion.div>
                        </motion.form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Address;
