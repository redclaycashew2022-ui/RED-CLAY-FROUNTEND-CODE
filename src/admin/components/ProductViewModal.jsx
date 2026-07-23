import React from "react";
import { resolveImageUrl } from "../../services/api";

const ProductViewModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-bold">{product.name}</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700 transition">
            &times;
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Main Image */}
          {product.image_url && (
            <img
              src={resolveImageUrl(product.image_url)}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          {/* Description */}
          <p className="text-gray-600 text-sm">{product.description}</p>

          {/* Sizes */}
          <div>
            <span className="font-semibold text-sm">Sizes:</span>
            {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
              <div className="mt-1 space-y-1">
                {product.sizes.map((sz, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium">{sz.size || sz.pack_size || "-"}</span> — ₹{sz.price}
                    {sz.mrp_price && (
                      <span className="ml-2 line-through text-gray-400">₹{sz.mrp_price}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm">₹{product.sale_price || product.price || 0}</div>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-semibold">Stock:</span> {product.stock}
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <span className={product.is_active ? "text-green-600" : "text-red-500"}>
                {product.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <span className="font-semibold">Main Category:</span>{" "}
              {product.maincategory || "Not set"}
            </div>
            <div>
              <span className="font-semibold">Sub Category:</span>{" "}
              {product.subcategory || "Not set"}
            </div>
            <div>
              <span className="font-semibold">Homepage Collection:</span>{" "}
              {product.homepage_collection || "Not set"}
            </div>
          </div>

          {/* All Images */}
          <div>
            <span className="font-semibold text-sm">All Images:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((i) => {
                const url = product[`image_url${i}`];
                return url ? (
                  <img
                    key={i}
                    src={resolveImageUrl(url)}
                    alt={`Image ${i}`}
                    className="h-16 w-16 object-cover rounded border"
                  />
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;