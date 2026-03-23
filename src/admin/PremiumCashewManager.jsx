import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PremiumCashewManager = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("manage"); // "manage" or "export"
  
  // Manage Premium Cashew state
  const [premiumProducts, setPremiumProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null);
  
  // Export Premium Cashew state
  const [exportProducts, setExportProducts] = useState([]);
  const [exportFormData, setExportFormData] = useState({
    name: "",
    sizes: [{ size: "", price: "" }],
  });
  const [exportEditingId, setExportEditingId] = useState(null);
  
  // Common state
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, type: null });

  // Get admin phone from localStorage/session
  const getAdminPhone = () => {
    return localStorage.getItem("adminPhone") || sessionStorage.getItem("adminPhone");
  };

  // Show message function
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // ============= MANAGE PREMIUM CASHEW API CALLS =============

  // GET /api/premium-cashews - Get all products
  const getAllPremiumCashews = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://red-clay-backend.onrender.com/api/premium-cashews", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setPremiumProducts(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // GET /api/premium-cashews/:id - Get single product by ID
  const getPremiumCashewById = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://red-clay-backend.onrender.com/api/premium-cashews/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setFormData({
          name: data.data.name,
          size: data.data.size,
          price: data.data.price,
        });
        setEditingId(id);
      } else {
        showMessage("error", data.message || "Failed to fetch product");
      }
    } catch (error) {
      console.error("Fetch by ID error:", error);
      showMessage("error", "Network error while fetching product");
    } finally {
      setLoading(false);
    }
  };

  // POST /api/premium-cashews - Create new product
  const createPremiumCashew = async (productData) => {
    setLoading(true);
    try {
      const payload = {
        name: productData.name,
        size: productData.size,
        price: parseFloat(productData.price)
      };

      const response = await fetch("https://red-clay-backend.onrender.com/api/premium-cashews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-phone-number": getAdminPhone(),
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (data.success) {
        showMessage("success", "Product added successfully!");
        getAllPremiumCashews();
        setFormData({ name: "", size: "", price: "" });
      } else {
        showMessage("error", data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Create error:", error);
      showMessage("error", "Network error while adding product");
    } finally {
      setLoading(false);
    }
  };

  // PUT /api/premium-cashews/:id - Update product
  const updatePremiumCashew = async (id, productData) => {
    setLoading(true);
    try {
      const response = await fetch(`https://red-clay-backend.onrender.com/api/premium-cashews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-phone-number": getAdminPhone(),
        },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      
      if (data.success) {
        showMessage("success", "Product updated successfully!");
        getAllPremiumCashews();
        setFormData({ name: "", size: "", price: "" });
        setEditingId(null);
      } else {
        showMessage("error", data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Update error:", error);
      showMessage("error", "Network error while updating product");
    } finally {
      setLoading(false);
    }
  };

  // DELETE /api/premium-cashews/:id - Delete product
  const deletePremiumCashew = async (id) => {
    setLoading(true);
    
    try {
      const response = await fetch(`https://red-clay-backend.onrender.com/api/premium-cashews/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-phone-number": getAdminPhone(),
        },
      });
      const data = await response.json();
      
      if (data.success) {
        showMessage("success", "Product deleted successfully!");
        getAllPremiumCashews();
      } else {
        showMessage("error", data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showMessage("error", "Network error while deleting product");
    } finally {
      setLoading(false);
    }
  };

  // ============= EXPORT PREMIUM CASHEW API CALLS =============

  // GET /api/export-premium-cashews - Get all export products
  const getAllExportPremiumCashews = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://red-clay-backend.onrender.com/api/export-premium-cashews", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setExportProducts(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // GET /api/export-premium-cashews/:id - Get single export product by ID
  const getExportPremiumCashewById = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://red-clay-backend.onrender.com/api/export-premium-cashews/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      
      if (data.success) {
        // Transform the data for the form
        const sizes = data.data.sizes.map(s => ({
          size: s.size,
          price: s.price.toString()
        }));
        
        setExportFormData({
          name: data.data.name,
          sizes: sizes.length ? sizes : [{ size: "", price: "" }],
        });
        setExportEditingId(id);
      } else {
        showMessage("error", data.message || "Failed to fetch export product");
      }
    } catch (error) {
      console.error("Fetch export by ID error:", error);
      showMessage("error", "Network error while fetching export product");
    } finally {
      setLoading(false);
    }
  };

  // POST /api/export-premium-cashews - Create new export product
  const createExportPremiumCashew = async (productData) => {
    setLoading(true);
    try {
      const payload = {
        name: productData.name,
        sizes: productData.sizes.map(s => ({
          size: s.size,
          price: parseFloat(s.price)
        })).filter(s => s.size && !isNaN(s.price))
      };

      const response = await fetch("https://red-clay-backend.onrender.com/api/export-premium-cashews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-phone-number": getAdminPhone(),
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (data.success) {
        showMessage("success", "Export product added successfully!");
        getAllExportPremiumCashews();
        setExportFormData({ name: "", sizes: [{ size: "", price: "" }] });
      } else {
        showMessage("error", data.message || "Failed to add export product");
      }
    } catch (error) {
      console.error("Create export error:", error);
      showMessage("error", "Network error while adding export product");
    } finally {
      setLoading(false);
    }
  };

  // PUT /api/export-premium-cashews/:id - Update export product
  const updateExportPremiumCashew = async (id, productData) => {
    setLoading(true);
    try {
      const payload = {
        name: productData.name,
        sizes: productData.sizes.map(s => ({
          size: s.size,
          price: parseFloat(s.price)
        })).filter(s => s.size && !isNaN(s.price))
      };

      const response = await fetch(`https://red-clay-backend.onrender.com/api/export-premium-cashews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-phone-number": getAdminPhone(),
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      
      if (data.success) {
        showMessage("success", "Export product updated successfully!");
        getAllExportPremiumCashews();
        setExportFormData({ name: "", sizes: [{ size: "", price: "" }] });
        setExportEditingId(null);
      } else {
        showMessage("error", data.message || "Failed to update export product");
      }
    } catch (error) {
      console.error("Update export error:", error);
      showMessage("error", "Network error while updating export product");
    } finally {
      setLoading(false);
    }
  };

  // DELETE /api/export-premium-cashews/:id - Delete export product
  const deleteExportPremiumCashew = async (id) => {
    setLoading(true);
    
    try {
      const response = await fetch(`https://red-clay-backend.onrender.com/api/export-premium-cashews/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-phone-number": getAdminPhone(),
        },
      });
      const data = await response.json();
      
      if (data.success) {
        showMessage("success", "Export product deleted successfully!");
        getAllExportPremiumCashews();
      } else {
        showMessage("error", data.message || "Failed to delete export product");
      }
    } catch (error) {
      console.error("Delete export error:", error);
      showMessage("error", "Network error while deleting export product");
    } finally {
      setLoading(false);
    }
  };

  // Load products based on active tab
  useEffect(() => {
    if (activeTab === "manage") {
      getAllPremiumCashews();
    } else {
      getAllExportPremiumCashews();
    }
  }, [activeTab]);

  // Handle form submit for manage tab
  const handleManageSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.size || !formData.price) {
      showMessage("error", "Please fill all fields");
      return;
    }

    const productData = {
      name: formData.name,
      size: formData.size,
      price: parseFloat(formData.price),
    };

    if (editingId) {
      updatePremiumCashew(editingId, productData);
    } else {
      createPremiumCashew(productData);
    }
  };

  // Handle form submit for export tab
  const handleExportSubmit = (e) => {
    e.preventDefault();
    
    if (!exportFormData.name) {
      showMessage("error", "Please enter product name");
      return;
    }

    const validSizes = exportFormData.sizes.filter(s => s.size && s.price);
    if (validSizes.length === 0) {
      showMessage("error", "Please add at least one size with price");
      return;
    }

    const productData = {
      name: exportFormData.name,
      sizes: validSizes,
    };

    if (exportEditingId) {
      updateExportPremiumCashew(exportEditingId, productData);
    } else {
      createExportPremiumCashew(productData);
    }
  };

  // Handle adding new size field
  const addSizeField = () => {
    setExportFormData({
      ...exportFormData,
      sizes: [...exportFormData.sizes, { size: "", price: "" }],
    });
  };

  // Handle removing size field
  const removeSizeField = (index) => {
    if (exportFormData.sizes.length > 1) {
      const newSizes = exportFormData.sizes.filter((_, i) => i !== index);
      setExportFormData({ ...exportFormData, sizes: newSizes });
    }
  };

  // Handle size field change
  const handleSizeChange = (index, field, value) => {
    const newSizes = [...exportFormData.sizes];
    newSizes[index][field] = value;
    setExportFormData({ ...exportFormData, sizes: newSizes });
  };

  // Handle edit button click for manage tab
  const handleEdit = (product) => {
    getPremiumCashewById(product.id);
    if (window.innerWidth < 768) {
      document.querySelector('form').scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle edit button click for export tab
  const handleExportEdit = (product) => {
    // Use the first size's id for fetching details
    if (product.sizes && product.sizes.length > 0) {
      getExportPremiumCashewById(product.sizes[0].id);
    } else {
      showMessage("error", "No size found for this product");
    }
    if (window.innerWidth < 768) {
      document.querySelector('form').scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle delete button click
  const handleDeleteClick = (id, type) => {
    setDeleteConfirm({ show: true, id, type });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.id) {
      if (deleteConfirm.type === "manage") {
        deletePremiumCashew(deleteConfirm.id);
      } else {
        deleteExportPremiumCashew(deleteConfirm.id);
      }
      setDeleteConfirm({ show: false, id: null, type: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ show: false, id: null, type: null });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    if (activeTab === "manage") {
      setFormData({ name: "", size: "", price: "" });
      setEditingId(null);
    } else {
      setExportFormData({ name: "", sizes: [{ size: "", price: "" }] });
      setExportEditingId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleCancelDelete}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Product
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  This will permanently delete the product. Are you sure?
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition order-2 sm:order-1"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition order-1 sm:order-2"
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button and Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-[#2E8B57] transition"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
        
        <h2 className="text-xl sm:text-2xl font-bold text-[#2E8B57]">
          Premium Cashew Management
        </h2>
        
        <div className="hidden sm:block w-20"></div>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setActiveTab("manage");
            handleCancelEdit();
          }}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            activeTab === "manage"
              ? "bg-[#2E8B57] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Manage Premium Cashew
        </button>
        <button
          onClick={() => {
            setActiveTab("export");
            handleCancelEdit();
          }}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            activeTab === "export"
              ? "bg-[#2E8B57] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Export Premium Cashew
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-2 text-[#2E8B57]">
          Loading...
        </div>
      )}

      {/* Message */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Manage Premium Cashew Tab */}
      {activeTab === "manage" && (
        <>
          {/* Add/Edit Form */}
          <form onSubmit={handleManageSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Product" : "Add New Product"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-[#2E8B57]"
                  placeholder="e.g. Whole White-180"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Size</label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-[#2E8B57]"
                  placeholder="e.g. 250g"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-[#2E8B57]"
                  placeholder="e.g. 450"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2E8B57] text-white px-6 py-3 rounded hover:bg-[#1a6b3a] transition disabled:opacity-50 flex-1"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition disabled:opacity-50 flex-1"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Products List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Products ({premiumProducts.length})
            </h3>
            
            {premiumProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No products found.</p>
            ) : (
              <div className="space-y-3">
                {premiumProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border rounded-lg p-4 hover:shadow-lg transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{product.name}</h4>
                        <p className="text-gray-600">{product.size}</p>
                        <p className="text-[#2E8B57] font-semibold">₹{product.price}</p>
                      </div>
                      
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => handleEdit(product)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50 px-3 py-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.id, "manage")}
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 px-3 py-2"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Export Premium Cashew Tab */}
      {activeTab === "export" && (
        <>
          {/* Add/Edit Form */}
          <form onSubmit={handleExportSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              {exportEditingId ? "Edit Export Product" : "Add New Export Product"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  value={exportFormData.name}
                  onChange={(e) => setExportFormData({ ...exportFormData, name: e.target.value })}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-[#2E8B57]"
                  placeholder="e.g. Premium Cashew Export Grade"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Sizes and Prices</label>
                {exportFormData.sizes.map((sizeItem, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={sizeItem.size}
                      onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                      className="flex-1 p-3 border rounded focus:ring-2 focus:ring-[#2E8B57]"
                      placeholder="e.g. 500g"
                      disabled={loading}
                    />
                    <input
                      type="number"
                      value={sizeItem.price}
                      onChange={(e) => handleSizeChange(index, "price", e.target.value)}
                      className="flex-1 p-3 border rounded focus:ring-2 focus:ring-[#2E8B57]"
                      placeholder="Price (₹)"
                      disabled={loading}
                    />
                    {exportFormData.sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSizeField(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                        disabled={loading}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addSizeField}
                  className="mt-2 text-[#2E8B57] hover:text-[#1a6b3a] text-sm font-medium flex items-center"
                  disabled={loading}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Size
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2E8B57] text-white px-6 py-3 rounded hover:bg-[#1a6b3a] transition disabled:opacity-50 flex-1"
              >
                {exportEditingId ? "Update Export Product" : "Add Export Product"}
              </button>
              
              {exportEditingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition disabled:opacity-50 flex-1"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Export Products List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Export Products ({exportProducts.length})
            </h3>
            
            {exportProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No export products found.</p>
            ) : (
              <div className="space-y-3">
                {exportProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border rounded-lg p-4 hover:shadow-lg transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{product.name}</h4>
                        <div className="mt-2 space-y-1">
                          {product.sizes && product.sizes.map((size, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-600">{size.size}</span>
                              <span className="text-[#2E8B57] font-semibold">₹{size.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => handleExportEdit(product)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50 px-3 py-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.id, "export")}
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 px-3 py-2"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PremiumCashewManager;