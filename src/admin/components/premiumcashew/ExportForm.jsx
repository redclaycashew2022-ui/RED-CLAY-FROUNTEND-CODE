import React from "react";
import { motion } from "framer-motion";

const ExportForm = ({
  exportFormData,
  setExportFormData,
  exportEditingId,
  loading,
  exportProducts,
  onSubmit,
  onEdit,
  onDelete,
  onCancelEdit,
  onAddSize,
  onRemoveSize,
  onSizeChange,
}) => {
  return (
    <>
      {/* Add / Edit Form */}
      <form onSubmit={onSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          {exportEditingId ? "Edit Export Product" : "Add New Export Product"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input
              type="text"
              value={exportFormData.name}
              onChange={(e) =>
                setExportFormData({ ...exportFormData, name: e.target.value })
              }
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
                  onChange={(e) => onSizeChange(index, "size", e.target.value)}
                  className="flex-1 p-3 border rounded focus:ring-2 focus:ring-[#2E8B57]"
                  placeholder="e.g. 500g"
                  disabled={loading}
                />
                <input
                  type="number"
                  value={sizeItem.price}
                  onChange={(e) => onSizeChange(index, "price", e.target.value)}
                  className="flex-1 p-3 border rounded focus:ring-2 focus:ring-[#2E8B57]"
                  placeholder="Price (₹)"
                  disabled={loading}
                />
                {exportFormData.sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveSize(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                    disabled={loading}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={onAddSize}
              className="mt-2 text-[#2E8B57] hover:text-[#1a6b3a] text-sm font-medium flex items-center"
              disabled={loading}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
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
              onClick={onCancelEdit}
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
                      {product.sizes &&
                        product.sizes.map((size, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">{size.size}</span>
                            <span className="text-[#2E8B57] font-semibold">₹{size.price}</span>
                          </div>
                        ))}
                    </div>
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
                      onClick={() =>
                        onDelete(product.id || (product.ids && product.ids[0]), "export")
                      }
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

export default ExportForm;