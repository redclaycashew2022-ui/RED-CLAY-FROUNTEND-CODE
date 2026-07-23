import React from "react";
import { resolveImageUrl } from "../../services/api";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%25' height='100%25' fill='%23e5e7eb'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='9' fill='%236b7280'>No Image</text></svg>";

const ProductCard = ({ product, onView, onEdit, onDelete }) => {
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-start space-x-3">
        {/* Product Image */}
        <div className="flex-shrink-0">
          {product.image_url ? (
            <img
              className="h-16 w-16 rounded-lg object-cover"
              src={resolveImageUrl(product.image_url)}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMAGE;
              }}
            />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs">No Image</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {product.description || "No description"}
          </p>

          {/* Sizes/Prices */}
          <div className="mt-2">
            {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
              <div className="space-y-1">
                {product.sizes.slice(0, 2).map((sz, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="font-medium bg-gray-100 px-1.5 py-0.5 rounded">
                      {sz.pack_size || sz.size || "-"}
                    </span>
                    <span>₹{sz.price}</span>
                    {sz.mrp_price && (
                      <span className="line-through text-gray-400">₹{sz.mrp_price}</span>
                    )}
                  </div>
                ))}
                {product.sizes.length > 2 && (
                  <span className="text-xs text-gray-400">+{product.sizes.length - 2} more</span>
                )}
              </div>
            ) : (
              <div className="text-sm font-semibold text-gray-900">
                ₹{product.sale_price || product.price || 0}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mt-2 flex flex-wrap gap-1">
            <span
              className={`px-1.5 py-0.5 text-xs rounded-full ${
                product.stock > 10
                  ? "bg-green-100 text-green-800"
                  : product.stock > 0
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              Stock: {product.stock}
            </span>
            <span
              className={`px-1.5 py-0.5 text-xs rounded-full ${
                product.maincategory ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-500"
              }`}
            >
              {product.maincategory || "No category"}
            </span>
            <span
              className={`px-1.5 py-0.5 text-xs rounded-full ${
                product.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {product.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-3 flex space-x-3">
            <button
              onClick={() => onView(product)}
              className="text-xs text-blue-600 hover:text-blue-900"
            >
              View
            </button>
            <button
              onClick={() => onEdit(product)}
              className="text-xs text-[#2E8B57] hover:text-[#1a6b3a]"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(product.id, product.name)}
              className="text-xs text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;