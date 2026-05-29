import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

// All Indian states
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const Address = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const isAdmin = user?.user_type === "admin";

  const [activeTab, setActiveTab] = useState("orders");
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [addresses, setAddresses] = useState(() => {
    // Load addresses from localStorage on mount
    const saved = localStorage.getItem("userAddresses");
    return saved ? JSON.parse(saved) : [];
  });
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "Tamil Nadu",
    zipCode: "",
    isDefault: false,
  });

  const [orders] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Persist addresses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userAddresses", JSON.stringify(addresses));
  }, [addresses]);

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
    
    if (editingAddressId) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((addr) => {
          if (addr.id === editingAddressId) {
            return {
              ...addr,
              ...formData,
              isDefault: formData.isDefault ? true : (addresses.length === 1 ? true : addr.isDefault),
            };
          }
          // Remove isDefault from other addresses if this one is set as default
          if (formData.isDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        })
      );
      setEditingAddressId(null);
    } else {
      // Add new address
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
    }

    // Reset form
    setFormData({
      id: "",
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state: "Tamil Nadu",
      zipCode: "",
      isDefault: false,
    });
    setShowAddAddressForm(false);
  };

  const handleEditAddress = (id) => {
    const addressToEdit = addresses.find((addr) => addr.id === id);
    if (addressToEdit) {
      setFormData({
        id: addressToEdit.id,
        firstName: addressToEdit.firstName,
        lastName: addressToEdit.lastName,
        company: addressToEdit.company,
        address1: addressToEdit.address1,
        address2: addressToEdit.address2,
        city: addressToEdit.city,
        state: addressToEdit.state || "Tamil Nadu",
        zipCode: addressToEdit.zipCode,
        isDefault: addressToEdit.isDefault,
      });
      setEditingAddressId(id);
      setShowAddAddressForm(true);
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
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Improved Mobile Responsive */}
        <motion.div
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-10"
          variants={itemVariants}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center sm:text-left">
            {isAdmin ? "Admin Panel" : "My Account"}
          </h1>

          {/* Mobile Menu Button - Only for Admin */}
          {isAdmin && (
            <div className="sm:hidden flex justify-end">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}

          {/* Desktop Action Buttons */}
          <div className={`${isAdmin ? 'hidden sm:flex' : 'flex'} items-center justify-center sm:justify-end space-x-3`}>
            {isAdmin && (
              <>
                <motion.button
                  onClick={handleLogout}
                  className="px-5 sm:px-6 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base font-medium shadow-sm"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Logout
                </motion.button>
              </>
            )}
            {!isAdmin && (
              <motion.button
                onClick={handleLogout}
                className="px-5 sm:px-6 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base font-medium shadow-sm"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Logout
              </motion.button>
            )}
          </div>

          {/* Mobile Dropdown Menu for Admin */}
          {isAdmin && isMobileMenuOpen && (
            <motion.div
              className="sm:hidden bg-white rounded-lg shadow-lg p-4 space-y-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
             
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                Logout
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Tabs (hidden for admins; show admin panel instead) */}
        {!isAdmin && (
          <motion.div
            className="border-b border-gray-200 mb-8 sm:mb-10 overflow-x-auto"
            variants={itemVariants}
          >
            <nav className="flex space-x-6 sm:space-x-8 min-w-max">
              <motion.button
                onClick={() => setActiveTab("orders")}
                className={`py-3 sm:py-4 px-1 border-b-2 font-semibold text-sm sm:text-base transition-all ${
                  activeTab === "orders"
                    ? "border-green-600 text-green-700"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                }`}
                variants={tabVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Orders
              </motion.button>
              <motion.button
                onClick={() => setActiveTab("addresses")}
                className={`py-3 sm:py-4 px-1 border-b-2 font-semibold text-sm sm:text-base transition-all ${
                  activeTab === "addresses"
                    ? "border-green-600 text-green-700"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
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
            className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center"
            variants={itemVariants}
          >
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">Administrator</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
              You are logged in as an admin. Use the admin dashboard to manage
              orders and products.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="w-full sm:w-auto px-5 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors text-sm sm:text-base"
              >
                Open Admin Dashboard
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                View User Dashboard
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-white rounded-lg shadow-md p-4 sm:p-6"
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
                      className="py-8 sm:py-12"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.svg
                        className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
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
                        className="mt-4 text-base sm:text-lg font-medium text-gray-900"
                        variants={itemVariants}
                      >
                        You haven't placed any orders yet.
                      </motion.h3>
                      <motion.p
                        className="mt-2 text-xs sm:text-sm text-gray-500"
                        variants={itemVariants}
                      >
                        Start shopping to see your orders here.
                      </motion.p>
                      <motion.div className="mt-6" variants={itemVariants}>
                        <motion.button
                          onClick={handleContinueShopping}
                          className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base"
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
                      <h3 className="text-base sm:text-lg font-medium text-gray-900">
                        Your Orders
                      </h3>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="addresses"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Left Side - Address List */}
                  <div>
<h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
                      Saved Addresses
                    </h2>

                    <AnimatePresence>
                      {addresses.length === 0 && !showAddAddressForm ? (
                        <motion.div
                          className="text-center py-6 sm:py-8"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.svg
                            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
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
                          <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900">
                            No saved addresses
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Add your first address to get started
                          </p>
                          <motion.button
                            onClick={() => setShowAddAddressForm(true)}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            Add Address
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.div
                          className="space-y-3 sm:space-y-4"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <AnimatePresence>
                            {addresses.map((address, index) => (
                              <motion.div
                                key={address.id}
                                className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-green-300 transition-colors"
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
                                    Default
                                  </motion.span>
                                )}
                                <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                                  {address.firstName} {address.lastName}
                                </h4>
                                <p className="text-gray-600 text-xs sm:text-sm">
                                  {address.address1}
                                </p>
                                {address.address2 && (
                                  <p className="text-gray-600 text-xs sm:text-sm">
                                    {address.address2}
                                  </p>
                                )}
                                <p className="text-gray-600 text-xs sm:text-sm">
                                  {address.zipCode} {address.city},{" "}
                                  {address.state}
                                </p>
                                <p className="text-gray-600 text-xs sm:text-sm">
                                  {address.country}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  <motion.button
                                    onClick={() =>
                                      handleEditAddress(address.id)
                                    }
                                    className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    Edit
                                  </motion.button>
                                  <motion.button
                                    onClick={() =>
                                      handleDeleteAddress(address.id)
                                    }
                                    className="text-red-600 hover:text-red-800 text-xs sm:text-sm"
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
                                      className="text-green-600 hover:text-green-800 text-xs sm:text-sm"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      Set Default
                                    </motion.button>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>

                          {!showAddAddressForm && (
                            <motion.button
                              onClick={() => setShowAddAddressForm(true)}
                              className="w-full mt-3 sm:mt-4 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors text-sm sm:text-base"
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
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                          {editingAddressId ? "Edit Address" : "Add Address"}
                        </h2>
                        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                          Please fill in the information below:
                        </p>

                        <motion.form
                          onSubmit={handleAddAddress}
                          className="space-y-3 sm:space-y-4"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                              />
                            </div>
                          </motion.div>

                          <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Company (Optional)
                            </label>
                            <input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                            />
                          </motion.div>

                          <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Address Line 2 (Optional)
                            </label>
                            <input
                              type="text"
                              name="address2"
                              value={formData.address2}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                            />
                          </motion.div>

                          <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                State *
                              </label>
                              <select
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base bg-white"
                              >
                                <option value="">Select a state</option>
                                {INDIAN_STATES.map((state) => (
                                  <option key={state} value={state}>
                                    {state}
                                  </option>
                                ))}
                              </select>
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
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
                            className="flex flex-col sm:flex-row gap-3 pt-4"
                            variants={itemVariants}
                          >
                            <motion.button
                              type="submit"
                              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base"
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              Save Address
                            </motion.button>
                            <motion.button
                              type="button"
                              onClick={() => {
                                setShowAddAddressForm(false);
                                setEditingAddressId(null);
                                setFormData({
                                  id: "",
                                  firstName: "",
                                  lastName: "",
                                  company: "",
                                  address1: "",
                                  address2: "",
                                  city: "",
                                  state: "Tamil Nadu",
                                  zipCode: "",
                                  isDefault: false,
                                });
                              }}
                              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base"
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