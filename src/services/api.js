// // src/services/api.js






// export const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ||
//   "https://red-clay-backend.onrender.com/api";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_REACT_APP_API_URL ||
  "http://localhost:5000/api";

// Origin of the backend server (strips trailing "/api"), used to resolve
// image paths like "/uploadimage/foo.jpg" that the backend returns.
// Do NOT use window.location.origin for this — in dev that's the Vite
// frontend (5173), not the backend (5000), so images would 404.
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

// Turns a relative path returned by the backend into a full, loadable URL.
export const resolveImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
};

// Inverse of resolveImageUrl: strips the backend origin so only the
// relative path (e.g. "/uploadimage/foo.jpg") is stored in the DB.
export const toRelativeImagePath = (url) => {
  if (!url) return null;
  return url.startsWith(API_ORIGIN) ? url.slice(API_ORIGIN.length) : url;
};

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

  const url = `${API_BASE_URL}${endpoint}`;
  console.groupCollapsed(`API Request: ${config.method || "GET"} ${url}`);
  console.log("Request config:", config);

  try {
    const response = await fetch(url, config);
    const responseText = await response.text();
    let responseBody = null;

    try {
      responseBody = responseText ? JSON.parse(responseText) : null;
    } catch (parseError) {
      responseBody = responseText;
      console.warn("Failed to parse JSON response:", parseError);
    }

    console.log("Response:", {
      url,
      status: response.status,
      statusText: response.statusText,
      body: responseBody,
    });
    console.groupEnd();

    if (!response.ok) {
      const errorMessage =
        responseBody?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return responseBody;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    console.groupEnd();
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

  // Get products by homepage collection (the 6 homepage banner cards)
  getByHomepageCollection: (homepageCollection) =>
    apiRequest("/products/by-homepage-collection", {
      method: "POST",
      body: JSON.stringify({
        value: "homepage_collection",
        data: homepageCollection,
      }),
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
    const imageUrl = resolveImageUrl(data.fullUrl || data.url);

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

// Address APIs
export const addressApi = {
  getByPhone: (phone) => apiRequest(`/address/${phone}`),
  create: (payload) =>
    apiRequest("/address", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    apiRequest(`/address/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  delete: (id) =>
    apiRequest(`/address/${id}`, {
      method: "DELETE",
    }),
};

// Order APIs
export const orderApi = {
  getAll: () => apiRequest("/orders"),
  getByPhone: (phone) => apiRequest(`/orders/user/${phone}`),
  updateStatus: (id, status) =>
    apiRequest(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// Payment APIs (Razorpay)
export const paymentApi = {
  createOrder: (amount) =>
    apiRequest("/payments/create-order", {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),

  verifyPayment: (payload) =>
    apiRequest("/payments/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// Contact APIs
export const contactApi = {
  submit: (data) =>
    apiRequest("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () => apiRequest("/contact"),

  delete: (id) =>
    apiRequest(`/contact/${id}`, {
      method: "DELETE",
    }),
};

// Admin Dashboard Stats API
export const adminApi = {
  getStats: () => apiRequest("/admin/stats"),
};

// Billing SSO: fetches a one-time redirect URL (with a short-lived signed
// token) into the billing project, so the admin lands there already logged in.
export const billingApi = {
  getSsoUrl: () => apiRequest("/admin/billing-sso"),
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
