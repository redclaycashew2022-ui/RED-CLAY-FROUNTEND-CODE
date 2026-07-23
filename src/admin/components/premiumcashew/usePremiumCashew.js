import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../services/api";

const usePremiumCashew = (activeTab) => {
  const [premiumProducts, setPremiumProducts] = useState([]);
  const [formData, setFormData] = useState({ name: "", size: "", price: "" });
  const [editingId, setEditingId] = useState(null);

  const [exportProducts, setExportProducts] = useState([]);
  const [exportFormData, setExportFormData] = useState({
    name: "",
    sizes: [{ size: "", price: "" }],
  });
  const [exportEditingId, setExportEditingId] = useState(null);

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, type: null });

  const getAdminPhone = () =>
    localStorage.getItem("phoneNumber") || sessionStorage.getItem("phoneNumber");

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // ─── Manage Premium Cashew API ───────────────────────────────────────────────

  const getAllPremiumCashews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/premium-cashews`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) setPremiumProducts(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getPremiumCashewById = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/premium-cashews/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setFormData({ name: data.data.name, size: data.data.size, price: data.data.price });
        setEditingId(id);
        showMessage("success", "Product loaded for editing");
      } else {
        showMessage("error", data.message || "Product not found");
      }
    } catch (error) {
      console.error("Fetch by ID error:", error);
      showMessage("error", "Network error while fetching product");
    } finally {
      setLoading(false);
    }
  };

  const createPremiumCashew = async (productData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/premium-cashews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-phone-number": getAdminPhone() },
        body: JSON.stringify({ ...productData, price: parseFloat(productData.price) }),
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

  const updatePremiumCashew = async (id, productData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/premium-cashews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-phone-number": getAdminPhone() },
        body: JSON.stringify({ ...productData, price: parseFloat(productData.price) }),
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

  const deletePremiumCashew = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/premium-cashews/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-phone-number": getAdminPhone() },
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

  // ─── Export Premium Cashew API ───────────────────────────────────────────────

  const getAllExportPremiumCashews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/export-premium-cashews`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) setExportProducts(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getExportPremiumCashewById = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/export-premium-cashews/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        const sizes = data.data.sizes.map((s) => ({ size: s.size, price: s.price.toString() }));
        setExportFormData({ name: data.data.name, sizes: sizes.length ? sizes : [{ size: "", price: "" }] });
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

  const createExportPremiumCashew = async (productData) => {
    setLoading(true);
    try {
      const payload = {
        name: productData.name,
        sizes: productData.sizes
          .map((s) => ({ size: s.size, price: parseFloat(s.price) }))
          .filter((s) => s.size && !isNaN(s.price)),
      };
      const response = await fetch(`${API_BASE_URL}/export-premium-cashews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-phone-number": getAdminPhone() },
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

  const updateExportPremiumCashew = async (id, productData) => {
    setLoading(true);
    try {
      const payload = {
        name: productData.name,
        sizes: productData.sizes
          .map((s) => ({ size: s.size, price: parseFloat(s.price) }))
          .filter((s) => s.size && !isNaN(s.price)),
      };
      const response = await fetch(`${API_BASE_URL}/export-premium-cashews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-phone-number": getAdminPhone() },
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

  const deleteExportPremiumCashew = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/export-premium-cashews/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-phone-number": getAdminPhone() },
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

  // ─── useEffect ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (activeTab === "manage") {
      getAllPremiumCashews();
    } else {
      getAllExportPremiumCashews();
    }
  }, [activeTab]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleManageSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.size || !formData.price) {
      showMessage("error", "Please fill all fields");
      return;
    }
    const productData = { name: formData.name, size: formData.size, price: parseFloat(formData.price) };
    if (editingId) {
      updatePremiumCashew(editingId, productData);
    } else {
      createPremiumCashew(productData);
    }
  };

  const handleExportSubmit = (e) => {
    e.preventDefault();
    if (!exportFormData.name) {
      showMessage("error", "Please enter product name");
      return;
    }
    const validSizes = exportFormData.sizes.filter((s) => s.size && s.price);
    if (validSizes.length === 0) {
      showMessage("error", "Please add at least one size with price");
      return;
    }
    const productData = { name: exportFormData.name, sizes: validSizes };
    if (exportEditingId) {
      updateExportPremiumCashew(exportEditingId, productData);
    } else {
      createExportPremiumCashew(productData);
    }
  };

  const addSizeField = () => {
    setExportFormData({ ...exportFormData, sizes: [...exportFormData.sizes, { size: "", price: "" }] });
  };

  const removeSizeField = (index) => {
    if (exportFormData.sizes.length > 1) {
      setExportFormData({ ...exportFormData, sizes: exportFormData.sizes.filter((_, i) => i !== index) });
    }
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...exportFormData.sizes];
    newSizes[index][field] = value;
    setExportFormData({ ...exportFormData, sizes: newSizes });
  };

  const handleEdit = (product) => {
    getPremiumCashewById(product.id);
    if (window.innerWidth < 768) {
      const form = document.querySelector("form");
      if (form) form.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExportEdit = (product) => {
    if (product.sizes && product.sizes.length > 0) {
      const idToUse = product.id || (product.ids && product.ids[0]);
      if (!idToUse) {
        showMessage("error", "Product ID not found");
        return;
      }
      getExportPremiumCashewById(idToUse);
    } else {
      showMessage("error", "No size found for this product");
    }
    if (window.innerWidth < 768) {
      const form = document.querySelector("form");
      if (form) form.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  const handleCancelEdit = () => {
    setFormData({ name: "", size: "", price: "" });
    setEditingId(null);
    setExportFormData({ name: "", sizes: [{ size: "", price: "" }] });
    setExportEditingId(null);
  };

  return {
    // Manage state
    premiumProducts,
    formData,
    setFormData,
    editingId,
    // Export state
    exportProducts,
    exportFormData,
    setExportFormData,
    exportEditingId,
    // Common state
    message,
    loading,
    deleteConfirm,
    // Manage handlers
    handleManageSubmit,
    handleEdit,
    // Export handlers
    handleExportSubmit,
    handleExportEdit,
    addSizeField,
    removeSizeField,
    handleSizeChange,
    // Shared handlers
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleCancelEdit,
  };
};

export default usePremiumCashew;