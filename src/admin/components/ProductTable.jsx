import React from "react";
import { resolveImageUrl } from "../../services/api";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><rect width='100%25' height='100%25' fill='%23e5e7eb'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='7' fill='%236b7280'>No Image</text></svg>";

const ProductTable = ({ products, onView, onEdit, onDelete }) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price / Sizes
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Main Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sub Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Homepage Collection
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              {/* Product Name + Image */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {product.image_url ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={resolveImageUrl(product.image_url)}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = FALLBACK_IMAGE;
                        }}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {product.description || "No description"}
                    </div>
                  </div>
                </div>
              </td>

              {/* Price / Sizes */}
              <td className="px-6 py-4 whitespace-nowrap">
                {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {product.sizes.map((sz, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="font-medium">{sz.pack_size || sz.size || "-"}</span>
                        <span>₹{sz.price}</span>
                        {sz.mrp_price && (
                          <span className="line-through text-gray-400">₹{sz.mrp_price}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-900">
                    ₹{product.sale_price || product.price || 0}
                  </div>
                )}
              </td>

              {/* Stock */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.stock > 10
                      ? "bg-green-100 text-green-800"
                      : product.stock > 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock} in stock
                </span>
              </td>

              {/* Main Category */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  className={`px-2 py-1 rounded ${
                    product.maincategory ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {product.maincategory || "Not set"}
                </span>
              </td>

              {/* Sub Category */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  className={`px-2 py-1 rounded ${
                    product.subcategory ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {product.subcategory || "Not set"}
                </span>
              </td>

              {/* Homepage Collection */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  className={`px-2 py-1 rounded ${
                    product.homepage_collection
                      ? "bg-amber-50 text-amber-700"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {product.homepage_collection || "Not set"}
                </span>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.is_active ? "Active" : "Inactive"}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onView(product)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(product)}
                    className="text-[#2E8B57] hover:text-[#1a6b3a]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.id, product.name)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;