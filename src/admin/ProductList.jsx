import React, { useState, useEffect } from "react";
import { productApi, uploadImage } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";

// Category configuration - defined at the top of the file
const CATEGORY_CONFIG = {
  mainCategories: [
    { label: "Seeds", value: "Seeds" },
    { label: "Nuts", value: "Nuts" },
    { label: "Fruits", value: "Fruits" },
  ],

  subCategories: {
    Nuts: [
      { label: "Cashew Nuts (Mundhiri)", value: "Cashew Nuts (Mundhiri)" },
      { label: "Almonds (Badam)", value: "Almonds (Badam)" },
      { label: "Pistachios (Pista)", value: "Pistachios (Pista)" },
    ],
    Seeds: [
      { label: "Pumpkin Seeds", value: "Pumpkin Seeds" },
      { label: "Sunflower Seeds", value: "Sunflower Seeds" },
      { label: "Chia Seeds", value: "Chia Seeds" },
      { label: "Watermelon Seeds", value: "Watermelon Seeds" },
      { label: "Basil Seeds (Sabja)", value: "Basil Seeds (Sabja)" },
      { label: "Cucumber Seeds", value: "Cucumber Seeds" },
    ],
    Fruits: [
      { label: "Dates", value: "Dates" },
      { label: "Athipazham (Fig / Anjeer)", value: "Athipazham (Fig / Anjeer)" },
      { label: "Black Raisins", value: "Black Raisins" },
      { label: "Golden Raisins (Seedless Raisins)", value: "Golden Raisins (Seedless Raisins)" },
    ],
  },
};

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

  // Category state
  const [subCategories, setSubCategories] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Modal state for viewing product details
  const [viewProduct, setViewProduct] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Auto-open create form when navigated from dashboard with state
  useEffect(() => {
    if (location?.state?.openCreate) {
      openCreateForm();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location?.state?.openCreate, navigate]);

  // CRUD form state with maincategory and subcategory
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    sizes: [],
    stock: 0,
    pack_of: [],
    category: "",
    maincategory: "",
    subcategory: "",
    images: [],
    is_active: true,
  });

  // For adding a new size/price/mrp row
  const [sizeInput, setSizeInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [mrpInput, setMrpInput] = useState("");

  // For adding Gram (g) and Pack Of values
  const [gInput, setGInput] = useState("");
  const [packOfInput, setPackOfInput] = useState("");

  const [uploadingImages, setUploadingImages] = useState(false);

  const openCreateForm = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      description: "",
      sizes: [],
      stock: 0,
      pack_of: [],
      category: "",
      maincategory: "",
      subcategory: "",
      images: [],
      is_active: true,
    });
    setSizeInput("");
    setPriceInput("");
    setMrpInput("");
    setSubCategories([]);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    const images = [];
    for (let i = 1; i <= 5; i++) {
      const imageKey = `image_url${i}`;
      if (product[imageKey]) {
        images.push(product[imageKey]);
      }
    }

    let processedSizes = [];
    if (Array.isArray(product.sizes)) {
      processedSizes = product.sizes.map((sizeItem) => ({
        size: sizeItem.size || sizeItem.pack_size || "",
        price: sizeItem.price || "",
        mrp_price: sizeItem.mrp_price || "",
      }));
    }

    setForm({
      name: product.name || "",
      description: product.description || "",
      sizes: processedSizes,
      stock: product.stock || 0,
      pack_of: Array.isArray(product.pack_of) ? product.pack_of : product.pack_of ? [product.pack_of] : [],
      category: product.category || "",
      maincategory: product.maincategory || "",
      subcategory: product.subcategory || "",
      images: images,
      is_active: product.is_active !== undefined ? product.is_active : true,
    });
    
    setSizeInput("");
    setPriceInput("");
    setMrpInput("");

    if (product.maincategory && CATEGORY_CONFIG.subCategories[product.maincategory]) {
      setSubCategories(CATEGORY_CONFIG.subCategories[product.maincategory]);
    } else {
      setSubCategories([]);
    }

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setForm({
      name: "",
      description: "",
      sizes: [],
      stock: 0,
      pack_of: [],
      category: "",
      maincategory: "",
      subcategory: "",
      images: [],
      is_active: true,
    });
    setSizeInput("");
    setPriceInput("");
    setMrpInput("");
    setSubCategories([]);
  };

  const handleMainCategoryChange = (e) => {
    const value = e.target.value;
    setForm((f) => ({
      ...f,
      maincategory: value,
      subcategory: "",
    }));

    if (value && CATEGORY_CONFIG.subCategories[value]) {
      setSubCategories(CATEGORY_CONFIG.subCategories[value]);
    } else {
      setSubCategories([]);
    }
  };

  const handleMultipleFilesChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      e.target.value = null;
      return;
    }

    if (files.length + form.images.length > 5) {
      alert(`You can only upload ${5 - form.images.length} more images`);
      e.target.value = null;
      return;
    }

    if (files.length === 0) return;

    setUploadingImages(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadImage(file);

        if (res && res.url) {
          const baseUrl = window.location.origin;
          const imageUrl = res.url.startsWith("/") ? `${baseUrl}${res.url}` : res.url.startsWith("http") ? res.url : `${baseUrl}/${res.url}`;
          setForm((f) => ({
            ...f,
            images: [...f.images, imageUrl],
          }));
        } else {
          throw new Error(`Upload failed for file ${i + 1}`);
        }
      }
    } catch (err) {
      console.error("Image upload error:", err);
      alert(err.message || "Failed to upload images");
    } finally {
      setUploadingImages(false);
      e.target.value = null;
    }
  };

  const removeImage = (index) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));
  };

  const clearAllImages = () => {
    if (form.images.length > 0 && window.confirm("Clear all images?")) {
      setForm((f) => ({
        ...f,
        images: [],
      }));
    }
  };

  const moveImage = (index, direction) => {
    const newImages = [...form.images];
    if (direction === "up" && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    } else if (direction === "down" && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    setForm((f) => ({ ...f, images: newImages }));
  };

  const triggerFileInput = () => {
    document.getElementById("imageUploadInput").click();
  };

  useEffect(() => {
    if (initialShowForm) {
      openCreateForm();
    }
  }, [initialShowForm]);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      setLocalLoading(true);
      setError(null);

      const imageData = {};
      form.images.forEach((image, index) => {
        const baseUrl = window.location.origin;
        const relativeUrl = image.replace(baseUrl, "");
        imageData[`image_url${index + 1}`] = relativeUrl;
      });

      for (let i = form.images.length + 1; i <= 5; i++) {
        imageData[`image_url${i}`] = null;
      }

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.sale_price || form.price || 0),
        mrp_price: form.mrp_price ? Number(form.mrp_price) : null,
        sale_price: form.sale_price ? Number(form.sale_price) : null,
        stock: Number(form.stock),
        g: form.g,
        pack_of: form.pack_of,
        category: form.category,
        maincategory: form.maincategory,
        subcategory: form.subcategory,
        image_url: form.images[0] ? form.images[0].replace(window.location.origin, "") : null,
        ...imageData,
        is_active: form.is_active,
        sizes: Array.isArray(form.sizes) ? form.sizes.map((item) => ({
          pack_size: item.size,
          price: Number(item.price),
          mrp_price: Number(item.mrp_price),
        })) : [],
      };

      if (editingProduct) {
        const res = await productApi.update(editingProduct.id, payload);
        setLocalProducts((prev) => prev.map((p) => (p.id === res.product.id ? res.product : p)));
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

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchProducts();
    }
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

  const [deleteMessage, setDeleteMessage] = useState("");
  const handleDelete = async (id, productName) => {
    try {
      await productApi.delete(id);
      setLocalProducts(localProducts.filter((product) => product.id !== id));
      setDeleteMessage(`Product "${productName}" deleted successfully.`);
      setTimeout(() => setDeleteMessage(""), 3000);
      onDelete(id);
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  if (localLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Products</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button onClick={fetchProducts} className="px-4 py-2 bg-[#2E8B57] text-white rounded-md hover:bg-[#1a6b3a] transition">
          Retry
        </button>
      </div>
    );
  }

  const isStandaloneAdminPage = location.pathname.startsWith("/admin/products");

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          {isStandaloneAdminPage && (
            <button onClick={() => navigate(-1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h2 className="text-lg font-semibold text-gray-900 flex-1 text-center">Manage Products</h2>
          <button onClick={openCreateForm} className="px-3 py-1 text-sm bg-[#2E8B57] text-white rounded hover:bg-[#246a46] transition">
            Add
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      {isStandaloneAdminPage && (
        <div className="hidden md:block bg-white p-4 shadow flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-700 cursor-pointer">
            ← Back
          </button>
          <h2 className="text-lg font-semibold">Manage Products</h2>
          <div />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Desktop Header with Actions */}
        <div className="hidden md:flex px-4 sm:px-6 py-4 border-b border-gray-200 justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">All Products ({localProducts.length})</h2>
          <div className="flex items-center space-x-2">
            <button onClick={openCreateForm} className="px-3 py-1 text-sm bg-[#2E8B57] text-white rounded hover:bg-[#246a46] transition">
              Add Product
            </button>
            <button onClick={fetchProducts} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition">
              Refresh
            </button>
          </div>
        </div>

        {/* Mobile Stats Bar */}
        <div className="md:hidden px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Products: {localProducts.length}</span>
          <button onClick={fetchProducts} className="text-xs text-[#2E8B57]">
            Refresh
          </button>
        </div>

        {deleteMessage && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 text-center text-sm mx-4 mt-4">
            {deleteMessage}
          </div>
        )}

        <div className="overflow-x-auto">
          {localProducts.length === 0 && (
            <div className="p-6 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Start by adding your first product</p>
              <div className="flex items-center justify-center space-x-2">
                <button onClick={openCreateForm} className="px-3 py-2 text-sm bg-[#2E8B57] text-white rounded hover:bg-[#246a46] transition">
                  Add Product
                </button>
                <button onClick={fetchProducts} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition">
                  Refresh
                </button>
              </div>
            </div>
          )}

          {/* Mobile Card View - Better for mobile */}
          {localProducts.length > 0 && (
            <div className="md:hidden divide-y divide-gray-200">
              {localProducts.map((product) => (
                <div key={product.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {product.image_url ? (
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={product.image_url.startsWith("/") ? `${window.location.origin}${product.image_url}` : product.image_url}
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
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
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description || "No description"}</p>
                      
                      {/* Sizes/Prices */}
                      <div className="mt-2">
                        {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                          <div className="space-y-1">
                            {product.sizes.slice(0, 2).map((sz, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <span className="font-medium bg-gray-100 px-1.5 py-0.5 rounded">{sz.pack_size || sz.size || "-"}</span>
                                <span>₹{sz.price}</span>
                                {sz.mrp_price && <span className="line-through text-gray-400">₹{sz.mrp_price}</span>}
                              </div>
                            ))}
                            {product.sizes.length > 2 && <span className="text-xs text-gray-400">+{product.sizes.length - 2} more</span>}
                          </div>
                        ) : (
                          <div className="text-sm font-semibold text-gray-900">
                            ₹{product.sale_price || product.price || 0}
                          </div>
                        )}
                      </div>

                      {/* Stock & Category Tags */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                          product.stock > 10 ? "bg-green-100 text-green-800" : product.stock > 0 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                        }`}>
                          Stock: {product.stock}
                        </span>
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                          product.maincategory ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-500"
                        }`}>
                          {product.maincategory || "No category"}
                        </span>
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                          product.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-3 flex space-x-3">
                        <button onClick={() => setViewProduct(product)} className="text-xs text-blue-600 hover:text-blue-900">
                          View
                        </button>
                        <button onClick={() => openEditForm(product)} className="text-xs text-[#2E8B57] hover:text-[#1a6b3a]">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(product.id, product.name)} className="text-xs text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Desktop Table View */}
          {localProducts.length > 0 && (
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price / Sizes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Main Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {localProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {product.image_url ? (
                              <img className="h-10 w-10 rounded-full object-cover" src={product.image_url.startsWith("/") ? `${window.location.origin}${product.image_url}` : product.image_url} alt={product.name} onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/40x40?text=No+Image";
                              }} />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-xs">No</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{product.description || "No description"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {product.sizes.map((sz, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <span className="font-medium">{sz.pack_size || sz.size || "-"}</span>
                                <span>₹{sz.price}</span>
                                {sz.mrp_price && <span className="line-through text-gray-400">₹{sz.mrp_price}</span>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-900">
                            ₹{product.sale_price || product.price || 0}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.stock > 10 ? "bg-green-100 text-green-800" : product.stock > 0 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                        }`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded ${product.maincategory ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-500"}`}>
                          {product.maincategory || "Not set"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded ${product.subcategory ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
                          {product.subcategory || "Not set"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => setViewProduct(product)} className="text-blue-600 hover:text-blue-900">View</button>
                          <button onClick={() => openEditForm(product)} className="text-[#2E8B57] hover:text-[#1a6b3a]">Edit</button>
                          <button onClick={() => handleDelete(product.id, product.name)} className="text-red-600 hover:text-red-900">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal - Mobile Responsive */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-semibold">{editingProduct ? "Edit Product" : "Add Product"}</h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <form onSubmit={submitForm} className="p-4 sm:p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Name <span className="text-red-500">*</span></label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full mt-1 p-2 border rounded text-sm sm:text-base" placeholder="Enter product name" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full mt-1 p-2 border rounded text-sm sm:text-base" placeholder="Enter product description" rows="3" />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium">Stock <span className="text-red-500">*</span></label>
                <input type="number" min="0" required value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="w-full mt-1 p-2 border rounded text-sm sm:text-base" placeholder="Enter stock quantity" />
              </div>

              {/* Sizes Section */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
                <label className="block text-sm font-medium mb-3">Sizes with Price & MRP</label>
                
                {/* Add Size Row */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <input type="text" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} className="flex-1 min-w-[100px] p-2 border rounded text-sm" placeholder="Size (e.g. 200g)" />
                  <input type="number" min="0" step="0.01" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} className="flex-1 min-w-[100px] p-2 border rounded text-sm" placeholder="Price" />
                  <input type="number" min="0" step="0.01" value={mrpInput} onChange={(e) => setMrpInput(e.target.value)} className="flex-1 min-w-[100px] p-2 border rounded text-sm" placeholder="MRP" />
                  <button type="button" onClick={() => {
                    if (sizeInput && priceInput && mrpInput) {
                      if (Number(priceInput) > Number(mrpInput)) {
                        alert("Selling price cannot be greater than MRP");
                        return;
                      }
                      setForm((f) => ({ ...f, sizes: [...f.sizes, { size: sizeInput, price: priceInput, mrp_price: mrpInput }] }));
                      setSizeInput(""); setPriceInput(""); setMrpInput("");
                    }
                  }} className="px-3 py-2 bg-[#2E8B57] text-white rounded text-sm whitespace-nowrap">
                    Add
                  </button>
                </div>

                {/* Sizes List */}
                <div className="space-y-2">
                  {form.sizes.length === 0 ? (
                    <div className="text-xs text-gray-400 italic p-3 text-center border border-dashed rounded">No sizes added yet</div>
                  ) : (
                    form.sizes.map((item, idx) => (
                      <div key={idx} className="flex flex-wrap gap-2 items-center text-sm bg-white p-2 rounded border">
                        <input type="text" value={item.size} onChange={(e) => {
                          const newSizes = [...form.sizes];
                          newSizes[idx] = { ...newSizes[idx], size: e.target.value };
                          setForm((f) => ({ ...f, sizes: newSizes }));
                        }} className="w-20 p-1 border rounded text-sm" />
                        <input type="number" value={item.price} onChange={(e) => {
                          const newSizes = [...form.sizes];
                          newSizes[idx] = { ...newSizes[idx], price: e.target.value };
                          setForm((f) => ({ ...f, sizes: newSizes }));
                        }} className="w-20 p-1 border rounded text-sm" />
                        <input type="number" value={item.mrp_price} onChange={(e) => {
                          const newSizes = [...form.sizes];
                          newSizes[idx] = { ...newSizes[idx], mrp_price: e.target.value };
                          setForm((f) => ({ ...f, sizes: newSizes }));
                        }} className="w-20 p-1 border rounded text-sm" />
                        <button type="button" onClick={() => setForm((f) => ({ ...f, sizes: f.sizes.filter((_, i) => i !== idx) }))} className="text-red-500 text-sm ml-auto">✕</button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">Category (Legacy)</label>
                  <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full mt-1 p-2 border rounded text-sm" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Main Category <span className="text-red-500">*</span></label>
                  <select required value={form.maincategory} onChange={handleMainCategoryChange} className="w-full mt-1 p-2 border rounded text-sm">
                    <option value="">Select</option>
                    {CATEGORY_CONFIG.mainCategories.map((cat) => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Sub Category</label>
                  <select value={form.subcategory} onChange={(e) => setForm((f) => ({ ...f, subcategory: e.target.value }))} className="w-full mt-1 p-2 border rounded text-sm" disabled={!form.maincategory}>
                    <option value="">Select</option>
                    {subCategories.map((sub) => (<option key={sub.value} value={sub.value}>{sub.label}</option>))}
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium">Product Images (Up to 5)</label>
                  <span className="text-xs text-gray-500">{form.images.length}/5</span>
                </div>

                <input id="imageUploadInput" type="file" accept="image/*" onChange={handleMultipleFilesChange} multiple className="hidden" disabled={uploadingImages || form.images.length >= 5} />

                <div onClick={triggerFileInput} className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${uploadingImages || form.images.length >= 5 ? "opacity-50" : "hover:border-[#2E8B57]"}`}>
                  <div className="text-sm text-gray-600">{uploadingImages ? "Uploading..." : "Click to upload images"}</div>
                </div>

                {/* Image Grid */}
                {form.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                    {form.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img src={image} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded border" onError={(e) => { e.target.src = "https://via.placeholder.com/100x100?text=Error"; }} />
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100">✕</button>
                        {index === 0 && <span className="absolute bottom-1 left-1 bg-[#2E8B57] text-white text-xs px-1 rounded">Primary</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Checkbox */}
              <div className="flex items-center space-x-3">
                <input id="isActive" type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="h-4 w-4" />
                <label htmlFor="isActive" className="text-sm">Active</label>
              </div>

              {/* Form Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                <button type="button" onClick={closeForm} className="px-4 py-2 border rounded hover:bg-gray-50 transition text-sm">Cancel</button>
                <button type="submit" disabled={form.images.length === 0} className="px-4 py-2 bg-[#2E8B57] text-white rounded hover:bg-[#1a6b3a] disabled:opacity-50 transition text-sm">
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Details Modal - Mobile Responsive */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
              <h2 className="text-lg font-bold">{viewProduct.name}</h2>
              <button onClick={() => setViewProduct(null)} className="text-gray-500 text-2xl">&times;</button>
            </div>
            <div className="p-4 space-y-3">
              {/* Main Image */}
              {viewProduct.image_url && (
                <img src={viewProduct.image_url.startsWith("/") ? `${window.location.origin}${viewProduct.image_url}` : viewProduct.image_url} alt={viewProduct.name} className="w-full h-48 object-cover rounded-lg" />
              )}
              
              <p className="text-gray-600 text-sm">{viewProduct.description}</p>
              
              <div>
                <span className="font-semibold text-sm">Sizes:</span>
                {Array.isArray(viewProduct.sizes) && viewProduct.sizes.length > 0 ? (
                  <div className="mt-1 space-y-1">
                    {viewProduct.sizes.map((sz, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium">{sz.size || sz.pack_size || "-"}</span> - ₹{sz.price}
                        {sz.mrp_price && <span className="ml-2 line-through text-gray-400">₹{sz.mrp_price}</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm">₹{viewProduct.sale_price || viewProduct.price || 0}</div>
                )}
              </div>
              
              <div className="text-sm"><span className="font-semibold">Stock:</span> {viewProduct.stock}</div>
              <div className="text-sm"><span className="font-semibold">Main Category:</span> {viewProduct.maincategory || "Not set"}</div>
              <div className="text-sm"><span className="font-semibold">Sub Category:</span> {viewProduct.subcategory || "Not set"}</div>
              <div className="text-sm"><span className="font-semibold">Status:</span> {viewProduct.is_active ? "Active" : "Inactive"}</div>
              
              {/* All Images */}
              <div>
                <span className="font-semibold text-sm">All Images:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((i) => {
                    const url = viewProduct[`image_url${i}`];
                    return url ? (
                      <img key={i} src={url.startsWith("/") ? `${window.location.origin}${url}` : url} alt={`Image ${i}`} className="h-16 w-16 object-cover rounded border" />
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductList;