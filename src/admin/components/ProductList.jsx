

import React, { useState, useEffect } from "react";
import { productApi } from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";

import ProductCard from "./ProductCard";
import ProductTable from "./ProductTable";
import ProductViewModal from "./ProductViewModal";
import ProductForm from "./product-form";

const ProductList = ({
  products = [],
  loading = false,
  onEdit = () => {},
  onDelete = () => {},
  refresh = false,
  initialShowForm = false,
}) => {
  const [localProducts, setLocalProducts] = useState(products);
  const [localLoading, setLocalLoading] = useState(loading);
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Auto-open create form when navigated from dashboard
  useEffect(() => {
    if (location?.state?.openCreate) {
      openCreateForm();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location?.state?.openCreate, navigate]);

  useEffect(() => {
    if (initialShowForm) openCreateForm();
  }, [initialShowForm]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (refresh) fetchProducts();
  }, [refresh]);

  const fetchProducts = async () => {
    try {
      setLocalLoading(true);
      setError(null);
      const data = await productApi.getAll();
      setLocalProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to fetch products");
    } finally {
      setLocalLoading(false);
    }
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = async (payload, editingId) => {
    try {
      setLocalLoading(true);
      setError(null);
      if (editingId) {
        const res = await productApi.update(editingId, payload);
        setLocalProducts((prev) =>
          prev.map((p) => (p.id === res.product.id ? res.product : p))
        );
      } else {
        const res = await productApi.create(payload);
        setLocalProducts((prev) => [res.product, ...prev]);
      }
      closeForm();
    } catch (err) {
      console.error("Submit product error:", err);
      setError(err.message || "Failed to save product");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDelete = async (id, productName) => {
    if (!window.confirm(`Delete "${productName}"?`)) return;
    try {
      await productApi.delete(id);
      setLocalProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteMessage(`Product "${productName}" deleted successfully.`);
      setTimeout(() => setDeleteMessage(""), 3000);
      onDelete(id);
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  const isStandaloneAdminPage = location.pathname.startsWith("/admin/products");

  // ── Loading State ──────────────────────────────────────────────
  if (localLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Products</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-[#2E8B57] text-white rounded-md hover:bg-[#1a6b3a] transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Main Render ────────────────────────────────────────────────
  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          {isStandaloneAdminPage && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h2 className="text-lg font-semibold text-gray-900 flex-1 text-center">Manage Products</h2>
          <button
            onClick={openCreateForm}
            className="px-3 py-1 text-sm bg-[#2E8B57] text-white rounded hover:bg-[#246a46] transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      {isStandaloneAdminPage && (
        <div className="hidden md:flex bg-white p-4 shadow items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-700 cursor-pointer">
            ← Back
          </button>
          <h2 className="text-lg font-semibold">Manage Products</h2>
          <div />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Desktop Action Bar */}
        <div className="hidden md:flex px-4 sm:px-6 py-4 border-b border-gray-200 justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            All Products ({localProducts.length})
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={openCreateForm}
              className="px-3 py-1 text-sm bg-[#2E8B57] text-white rounded hover:bg-[#246a46] transition"
            >
              Add Product
            </button>
            <button
              onClick={fetchProducts}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Mobile Stats Bar */}
        <div className="md:hidden px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Products: {localProducts.length}</span>
          <button onClick={fetchProducts} className="text-xs text-[#2E8B57]">Refresh</button>
        </div>

        {/* Delete Success Message */}
        {deleteMessage && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 text-center text-sm mx-4 mt-4">
            {deleteMessage}
          </div>
        )}

        <div className="overflow-x-auto">
          {/* Empty State */}
          {localProducts.length === 0 && (
            <div className="p-6 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Start by adding your first product</p>
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={openCreateForm}
                  className="px-3 py-2 text-sm bg-[#2E8B57] text-white rounded hover:bg-[#246a46] transition"
                >
                  Add Product
                </button>
                <button
                  onClick={fetchProducts}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                >
                  Refresh
                </button>
              </div>
            </div>
          )}

          {localProducts.length > 0 && (
            <>
              {/* Mobile: Card List */}
              <div className="md:hidden divide-y divide-gray-200">
                {localProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onView={setViewProduct}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Desktop: Table */}
              <ProductTable
                products={localProducts}
                onView={setViewProduct}
                onEdit={openEditForm}
                onDelete={handleDelete}
              />
            </>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          editingProduct={editingProduct}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
          loading={localLoading}
        />
      )}

      {/* Product View Modal */}
      {viewProduct && (
        <ProductViewModal product={viewProduct} onClose={() => setViewProduct(null)} />
      )}
    </>
  );
};

export default ProductList;