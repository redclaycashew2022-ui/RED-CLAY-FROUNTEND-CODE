import React from "react";
import { motion } from "framer-motion";

const ManageForm = ({
  formData,
  setFormData,
  editingId,
  loading,
  premiumProducts,
  onSubmit,
  onEdit,
  onDelete,
  onCancelEdit,
}) => {
  return (
    <>
      {/* Add / Edit Form */}
      <form onSubmit={onSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg">
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
              onClick={onCancelEdit}
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
                      onClick={() => onEdit(product)}
                      disabled={loading}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50 px-3 py-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product.id, "manage")}
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
  );
};

export default ManageForm;