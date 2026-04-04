// // src/services/api.js
// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ||
//   import.meta.env.VITE_REACT_APP_API_URL ||
//   // "https://red-clay-backend.onrender.com/api"
//   "http://localhost:5000/api"


export const API_BASE_URL = "https://red-clay-backend.onrender.com/api";
// const API_BASE_URL = "http://localhost:5000/api"; 
// const API_BASE_URL = "https://red-clay-backend.onrender.com/api";

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  // Get token from localStorage (you need to store it during login)
  const token =
    localStorage.getItem("token") || localStorage.getItem("auth_token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    // Include the logged-in phone number so server can authorize admin actions
    ...(localStorage.getItem("phoneNumber") && {
      "x-phone-number": localStorage.getItem("phoneNumber"),
    }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Something went wrong" }));
      throw new Error(error.message || "Request failed");
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Product APIs
export const productApi = {
  // Get products by subcategory (returns all products for a subcategory)
  getBySubcategory: (subcategory) =>
    apiRequest("/products/by-subcategory", {
      method: "POST",
      body: JSON.stringify({ value: "subcategory", data: subcategory }),
    }),

  // Get all products (POST with payload for explicit intent)
  getAll: () =>
    apiRequest("/products", {
      method: "POST",
      body: JSON.stringify({ type: "allproducts" }),
    }),

  // Get single product
  getById: (id) => apiRequest(`/products/${id}`),

  // Unified search: by product name, main category, or subcategory
  search: (keyword) =>
    apiRequest("/products/search", {
      method: "POST",
      body: JSON.stringify({ keyword }),
    }),

  // Get all subcategories for a main category
  getSubcategoriesByMain: (maincategory) =>
    fetch(
      `${API_BASE_URL}/categories/sub?maincategory=${encodeURIComponent(
        maincategory
      )}`
    ).then((res) => res.json()),

  // Get all products for a main category (search by maincategory)
  getByMainCategory: (maincategory) => productApi.search(maincategory),

  // Get all products for a subcategory (alias for getBySubcategory)
  getAllProductsBySubcategory: (subcategory) =>
    productApi.getBySubcategory(subcategory),

  // Search by product name (returns products matching the name)
  searchByProductName: (name) => productApi.search(name),

  // Create product
  create: (productData) =>
    apiRequest("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }),

  // Update product
  update: (id, productData) =>
    apiRequest(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }),

  // Delete product (soft delete - sets is_active=false)
  delete: (id) =>
    apiRequest(`/products/${id}`, {
      method: "DELETE",
    }),
};

// Upload helper for image files (sends FormData and includes x-phone-number header)
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  // Build URL using API_BASE_URL (which already includes `/api` by default)
  const url = `${API_BASE_URL.replace(/\/+$/, "")}/upload-image`;

  // Include admin phone header if available
  const headers = {
    Accept: "application/json",
    ...(localStorage.getItem("phoneNumber") && {
      "x-phone-number": localStorage.getItem("phoneNumber"),
    }),
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers,
    });

    // Read text first to avoid "Unexpected end of JSON input" on empty responses
    const text = await response.text();
    if (!text) {
      throw new Error(`Empty response from server (status ${response.status})`);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      throw new Error(`Invalid JSON response: ${parseErr.message} - ${text}`);
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || `Upload failed (status ${response.status})`
      );
    }

    // Prefer fullUrl when provided by the server
    let imageUrl = data.fullUrl || data.url;
    if (!imageUrl.startsWith("http")) {
      imageUrl = `${window.location.origin}${
        imageUrl.startsWith("/") ? "" : "/"
      }${imageUrl}`;
    }

    return { url: imageUrl, relative: data.url };
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

// ✅ FIXED: Use API_BASE_URL instead of API_URL
export const categoryApi = {
  getMainCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories/main`);
    return response.json();
  },

  getSubCategories: async (mainCategory) => {
    const response = await fetch(
      `${API_BASE_URL}/categories/sub?maincategory=${encodeURIComponent(
        mainCategory
      )}`
    );
    return response.json();
  },
};

// Auth APIs (for completeness)
export const authApi = {
  requestOTP: (phone) =>
    apiRequest("/request-otp", {
      method: "POST",
      body: JSON.stringify({ phone_number: phone }),
    }),

  verifyOTP: (phone, otp) =>
    apiRequest("/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        phone_number: phone,
        otp: otp,
      }),
    }),
};
