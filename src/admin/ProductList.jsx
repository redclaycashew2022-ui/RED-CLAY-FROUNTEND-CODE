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
      {
        label: "Athipazham (Fig / Anjeer)",
        value: "Athipazham (Fig / Anjeer)",
      },
      { label: "Black Raisins", value: "Black Raisins" },
      {
        label: "Golden Raisins (Seedless Raisins)",
        value: "Golden Raisins (Seedless Raisins)",
      },
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
    sizes: [], // Array of { size, price, mrp_price }
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
    setSubCategories([]); // Reset subcategories
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

    // Process sizes to ensure they have the correct structure
    let processedSizes = [];
    if (Array.isArray(product.sizes)) {
      processedSizes = product.sizes.map((sizeItem) => ({
        // Handle both possible property names
        size: sizeItem.size || sizeItem.pack_size || "",
        price: sizeItem.price || "",
        mrp_price: sizeItem.mrp_price || "",
      }));
    }

    setForm({
      name: product.name || "",
      description: product.description || "",
      sizes: processedSizes, // Use the processed sizes
      stock: product.stock || 0,
      pack_of: Array.isArray(product.pack_of)
        ? product.pack_of
        : product.pack_of
        ? [product.pack_of]
        : [],
      category: product.category || "",
      maincategory: product.maincategory || "",
      subcategory: product.subcategory || "",
      images: images,
      is_active: product.is_active !== undefined ? product.is_active : true,
    });
    
    setSizeInput("");
    setPriceInput("");
    setMrpInput("");

    // Set subcategories based on product's maincategory
    if (
      product.maincategory &&
      CATEGORY_CONFIG.subCategories[product.maincategory]
    ) {
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

  // Handle multiple file uploads
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
          // Create absolute URL
          const baseUrl = window.location.origin;
          const imageUrl = res.url.startsWith("/")
            ? `${baseUrl}${res.url}`
            : res.url.startsWith("http")
            ? res.url
            : `${baseUrl}/${res.url}`;

          console.log("Uploaded image URL:", imageUrl);

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
      [newImages[index], newImages[index - 1]] = [
        newImages[index - 1],
        newImages[index],
      ];
    } else if (direction === "down" && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ];
    }
    setForm((f) => ({ ...f, images: newImages }));
  };

  const triggerFileInput = () => {
    document.getElementById("imageUploadInput").click();
  };

  // Open add form if initialShowForm is true
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
        // Convert to relative URL for database
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
        image_url: form.images[0]
          ? form.images[0].replace(window.location.origin, "")
          : null,
        ...imageData,
        is_active: form.is_active,
        sizes: Array.isArray(form.sizes)
          ? form.sizes.map((item) => ({
              pack_size: item.size,
              price: Number(item.price),
              mrp_price: Number(item.mrp_price),
            }))
          : [],
      };

      if (editingProduct) {
        const res = await productApi.update(editingProduct.id, payload);
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

  // Fetch products on mount and if refresh prop changes
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
      console.log("🔄 Starting to fetch products...");
      setLocalLoading(true);
      setError(null);

      console.log("📞 Calling productApi.getAll()");
      const data = await productApi.getAll();
      console.log("✅ Products fetched successfully:", data.length, "products");

      setLocalProducts(data);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      console.error("Error details:", {
        message: err.message,
        stack: err.stack,
      });
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Show delete confirmation message
  const showDeleteMessage = deleteMessage && (
    <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 text-center">
      {deleteMessage}
    </div>
  );

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-red-500 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading Products
        </h3>
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

  const isStandaloneAdminPage = location.pathname.startsWith("/admin/products");

  return (
    <>
      {isStandaloneAdminPage && (
        <div className="bg-white p-4 shadow flex items-center justify-between">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/admin/dashboard");
              }
            }}
            aria-label="Back to admin dashboard"
            className="text-sm text-gray-700 cursor-pointer"
          >
            ← Back
          </button>
          <h2 className="text-lg font-semibold">Manage Products</h2>
          <div />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
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

        <div className="overflow-x-auto">
          {localProducts.length === 0 && (
            <div className="p-6 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-4">
                Start by adding your first product
              </p>
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

          {showForm && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg w-[720px] max-w-full p-6 max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h3>
                <form onSubmit={submitForm} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full mt-1 p-2 border rounded"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                      className="w-full mt-1 p-2 border rounded"
                      placeholder="Enter product description"
                      rows="3"
                    />
                  </div>

                  {/* Stock Section */}
                  <div>
                    <label className="block text-sm font-medium">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={form.stock}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          stock: e.target.value.replace(/^0+(?!$)/, ""),
                        }))
                      }
                      className="w-full mt-1 p-2 border rounded"
                      placeholder="Enter stock quantity"
                    />
                  </div>

                  {/* Size/Price/MRP Section - WITH EDIT CAPABILITY */}
                  <div className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <label className="block text-sm font-medium mb-3">
                      Sizes with Price & MRP
                      <span className="text-xs text-gray-500 ml-2">(Add different pack sizes and their prices)</span>
                    </label>
                    
                    {/* Input row for adding new sizes */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex-1 min-w-[120px]">
                        <input
                          type="text"
                          value={sizeInput}
                          onChange={(e) => setSizeInput(e.target.value)}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                          placeholder="Size (e.g. 200g)"
                        />
                      </div>
                      <div className="flex-1 min-w-[100px]">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={priceInput}
                          onChange={(e) => setPriceInput(e.target.value)}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                          placeholder="Selling Price"
                        />
                      </div>
                      <div className="flex-1 min-w-[100px]">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={mrpInput}
                          onChange={(e) => setMrpInput(e.target.value)}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                          placeholder="MRP"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (sizeInput && priceInput && mrpInput) {
                            // Validate that price doesn't exceed MRP
                            if (Number(priceInput) > Number(mrpInput)) {
                              alert("Selling price cannot be greater than MRP");
                              return;
                            }
                            setForm((f) => ({
                              ...f,
                              sizes: [
                                ...f.sizes,
                                {
                                  size: sizeInput,
                                  price: priceInput,
                                  mrp_price: mrpInput,
                                },
                              ],
                            }));
                            setSizeInput("");
                            setPriceInput("");
                            setMrpInput("");
                          }
                        }}
                        className="px-4 py-2 bg-[#2E8B57] text-white rounded-md hover:bg-[#246a46] transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        disabled={!sizeInput || !priceInput || !mrpInput}
                      >
                        Add Size
                      </button>
                    </div>

                    {/* Display added sizes with edit capability */}
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-2 flex justify-between">
                        <span>Added Sizes: {form.sizes.length}</span>
                        {form.sizes.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm("Remove all sizes?")) {
                                setForm((f) => ({ ...f, sizes: [] }));
                              }
                            }}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {form.sizes.length === 0 ? (
                          <div className="text-xs text-gray-400 italic p-3 text-center border border-dashed border-gray-300 rounded-md">
                            No sizes added yet. Fill in the fields above and click "Add Size".
                          </div>
                        ) : (
                          form.sizes.map((item, idx) => {
                            // Ensure we have valid values (handle both possible structures)
                            const sizeValue = item.size || item.pack_size || "";
                            const priceValue = item.price || "";
                            const mrpValue = item.mrp_price || "";
                            
                            return (
                              <div
                                key={idx}
                                className="flex gap-2 items-center text-sm bg-white px-3 py-2 rounded-md border border-gray-200 hover:border-[#2E8B57] hover:shadow-sm transition-all"
                              >
                                {/* Size field - editable */}
                                <input
                                  type="text"
                                  value={sizeValue}
                                  onChange={(e) => {
                                    const newSizes = [...form.sizes];
                                    newSizes[idx] = { 
                                      ...newSizes[idx], 
                                      size: e.target.value,
                                      // Also update pack_size if it exists for consistency
                                      ...(newSizes[idx].pack_size !== undefined && { pack_size: e.target.value })
                                    };
                                    setForm((f) => ({ ...f, sizes: newSizes }));
                                  }}
                                  className="w-20 p-1 border rounded text-sm focus:ring-1 focus:ring-[#2E8B57]"
                                  placeholder="Size"
                                />
                                
                                {/* Selling Price field - editable */}
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={priceValue}
                                  onChange={(e) => {
                                    const newPrice = e.target.value;
                                    const newSizes = [...form.sizes];
                                    newSizes[idx] = { ...newSizes[idx], price: newPrice };
                                    
                                    // Optional: Show warning if price > MRP
                                    if (Number(newPrice) > Number(newSizes[idx].mrp_price || 0)) {
                                      alert("Warning: Selling price is greater than MRP");
                                    }
                                    
                                    setForm((f) => ({ ...f, sizes: newSizes }));
                                  }}
                                  className="w-20 p-1 border rounded text-sm focus:ring-1 focus:ring-[#2E8B57]"
                                  placeholder="Price"
                                />
                                
                                {/* MRP field - editable */}
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={mrpValue}
                                  onChange={(e) => {
                                    const newMrp = e.target.value;
                                    const newSizes = [...form.sizes];
                                    newSizes[idx] = { ...newSizes[idx], mrp_price: newMrp };
                                    
                                    // Optional: Show warning if price > MRP
                                    if (Number(newSizes[idx].price || 0) > Number(newMrp)) {
                                      alert("Warning: Selling price is greater than MRP");
                                    }
                                    
                                    setForm((f) => ({ ...f, sizes: newSizes }));
                                  }}
                                  className="w-20 p-1 border rounded text-sm focus:ring-1 focus:ring-[#2E8B57]"
                                  placeholder="MRP"
                                />
                                
                                {/* Discount badge (auto-calculates) */}
                                {Number(mrpValue) > Number(priceValue) && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                                    {Math.round(((Number(mrpValue) - Number(priceValue)) / Number(mrpValue)) * 100)}% off
                                  </span>
                                )}
                                
                                {/* Delete button */}
                                <button
                                  type="button"
                                  className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                                  onClick={() =>
                                    setForm((f) => ({
                                      ...f,
                                      sizes: f.sizes.filter((_, i) => i !== idx),
                                    }))
                                  }
                                  title="Remove size"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Summary if multiple sizes */}
                    {form.sizes.length > 1 && (
                      <div className="mt-3 text-xs bg-blue-50 text-blue-700 p-2 rounded-md">
                        <strong>Quick Summary:</strong> Min price: ₹{Math.min(...form.sizes.map(s => Number(s.price))).toLocaleString('en-IN')} | 
                        Max price: ₹{Math.max(...form.sizes.map(s => Number(s.price))).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  {/* Pack Of Section - Commented out as in original */}
                  {/* <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Pack Of
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={packOfInput}
                        onChange={(e) => setPackOfInput(e.target.value)}
                        className="w-32 p-2 border rounded"
                        placeholder="e.g. 2, 4, 6"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            packOfInput &&
                            !form.pack_of.includes(packOfInput)
                          ) {
                            setForm((f) => ({
                              ...f,
                              pack_of: [...f.pack_of, packOfInput],
                            }));
                            setPackOfInput("");
                          }
                        }}
                        className="px-3 py-2 bg-[#2E8B57] text-white rounded hover:bg-[#246a46] transition"
                        disabled={!packOfInput}
                      >
                        Add
                      </button>
                    </div>
                    <div>
                      {!form.pack_of || form.pack_of.length === 0 ? (
                        <div className="text-xs text-gray-400">
                          No pack counts added
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(form.pack_of || []).map((count, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center"
                            >
                              {count}
                              <button
                                type="button"
                                className="ml-1 text-red-500 hover:text-red-700"
                                onClick={() =>
                                  setForm((f) => ({
                                    ...f,
                                    pack_of: f.pack_of.filter(
                                      (_, i) => i !== idx
                                    ),
                                  }))
                                }
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div> */}

                  {/* Category Section */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium">
                          Category (Legacy)
                        </label>
                        <input
                          value={form.category}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, category: e.target.value }))
                          }
                          className="w-full mt-1 p-2 border rounded"
                          placeholder="Optional: Legacy category"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium">
                          Main Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={form.maincategory}
                          onChange={handleMainCategoryChange}
                          className="w-full mt-1 p-2 border rounded"
                        >
                          <option value="">Select Main Category</option>
                          {CATEGORY_CONFIG.mainCategories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium">
                          Sub Category
                        </label>
                        <select
                          value={form.subcategory}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              subcategory: e.target.value,
                            }))
                          }
                          className="w-full mt-1 p-2 border rounded"
                          disabled={!form.maincategory}
                        >
                          <option value="">Select Sub Category</option>
                          {subCategories.map((sub) => (
                            <option key={sub.value} value={sub.value}>
                              {sub.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      <p>
                        • Main Category is required and determines available Sub
                        Categories
                      </p>
                      <p>
                        • Legacy category field is kept for backward
                        compatibility
                      </p>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium">
                        Product Images (Upload up to 5)
                      </label>
                      <div className="text-xs text-gray-500">
                        {form.images.length}/5 Images
                      </div>
                    </div>

                    <input
                      id="imageUploadInput"
                      type="file"
                      accept="image/*"
                      onChange={handleMultipleFilesChange}
                      multiple
                      className="hidden"
                      disabled={uploadingImages || form.images.length >= 5}
                    />

                    <div className="mb-6">
                      <div
                        onClick={triggerFileInput}
                        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors ${
                          uploadingImages || form.images.length >= 5
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:border-[#2E8B57] hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <svg
                            className="w-10 h-10 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {uploadingImages ? "Uploading..." : "Choose File"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {form.images.length >= 5
                                ? "Maximum 5 images reached"
                                : "PNG, JPG, GIF up to 5MB"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image thumbnails grid */}
                    {form.images.length > 0 && (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-medium">
                            Uploaded Images ({form.images.length})
                          </h4>
                          <div className="flex space-x-2">
                            {form.images.length > 1 && (
                              <button
                                type="button"
                                onClick={clearAllImages}
                                className="text-xs text-red-600 hover:text-red-800 px-3 py-1 border border-red-200 rounded hover:bg-red-50"
                              >
                                Clear All
                              </button>
                            )}
                            {form.images.length < 5 && (
                              <button
                                type="button"
                                onClick={triggerFileInput}
                                className="text-xs bg-[#2E8B57] text-white px-3 py-1 rounded hover:bg-[#246a46] flex items-center"
                              >
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                Add Image
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                          {form.images.map((image, index) => {
                            const fallbackImage = `https://via.placeholder.com/150x150/4a5568/ffffff?text=Image+${
                              index + 1
                            }`;

                            return (
                              <div key={index} className="relative group">
                                {/* Image thumbnail */}
                                <div className="aspect-square rounded-md overflow-hidden border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200">
                                  <img
                                    src={image}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error(
                                        `Image ${index + 1} failed to load:`,
                                        image
                                      );
                                      e.target.onerror = null;
                                      e.target.src = fallbackImage;
                                    }}
                                    onLoad={() => {
                                      console.log(
                                        `Image ${
                                          index + 1
                                        } loaded successfully:`,
                                        image
                                      );
                                    }}
                                    alt={`Product ${index + 1}`}
                                  />

                                  {/* Image number */}
                                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {index + 1}
                                  </div>

                                  {/* Remove button */}
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                  >
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>

                                  {/* Primary badge */}
                                  {index === 0 && (
                                    <div className="absolute top-1 left-1 bg-[#2E8B57] text-white text-xs px-1 py-0.5 rounded z-10">
                                      Primary
                                    </div>
                                  )}
                                </div>

                                {/* Reorder buttons */}
                                {form.images.length > 1 && (
                                  <div className="flex justify-center space-x-1 mt-2">
                                    <button
                                      type="button"
                                      onClick={() => moveImage(index, "up")}
                                      disabled={index === 0}
                                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
                                    >
                                      ↑
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => moveImage(index, "down")}
                                      disabled={
                                        index === form.images.length - 1
                                      }
                                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
                                    >
                                      ↓
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Add more button */}
                          {form.images.length < 5 && (
                            <div
                              onClick={triggerFileInput}
                              className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#2E8B57] hover:bg-gray-50 transition-colors"
                            >
                              <svg
                                className="w-8 h-8 text-gray-400 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              <p className="text-xs text-gray-600">Add Image</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {5 - form.images.length} remaining
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Instructions */}
                        <div className="mt-4 text-xs text-gray-500 space-y-1">
                          <p>
                            • First image is displayed as the main product image
                          </p>
                          <p>• Use arrows to reorder images</p>
                          <p>• Hover over images to remove them</p>
                          <p className="text-blue-600">
                            • Check browser console (F12) if images don't load
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 mt-3">
                    <input
                      id="isActive"
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, is_active: e.target.checked }))
                      }
                      className="h-4 w-4"
                    />
                    <label htmlFor="isActive" className="text-sm">
                      Active
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-4 py-2 border rounded hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={form.images.length === 0}
                      className="px-4 py-2 bg-[#2E8B57] text-white rounded hover:bg-[#1a6b3a] disabled:opacity-50 transition"
                    >
                      {editingProduct ? "Save" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showDeleteMessage}
          {/* Product List Table */}
          {localProducts.length > 0 && (
            <div className="overflow-x-auto">
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {localProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {product.image_url ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={
                                  product.image_url.startsWith("/")
                                    ? `${window.location.origin}${product.image_url}`
                                    : product.image_url
                                }
                                alt={product.name}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/40x40?text=No+Image";
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-xs">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description || "No description"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {Array.isArray(product.sizes) &&
                        product.sizes.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {product.sizes.map((sz, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-xs"
                              >
                                <span className="font-medium">
                                  {sz.pack_size || sz.size || "-"}
                                </span>
                                <span>₹{sz.price}</span>
                                {sz.mrp_price && (
                                  <span className="line-through text-gray-400">
                                    ₹{sz.mrp_price}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-900">
                            ₹{product.sale_price || product.price || 0}
                            {product.mrp_price &&
                              product.mrp_price >
                                (product.sale_price || product.price) && (
                                <span className="ml-2 text-gray-500 line-through">
                                  ₹{product.mrp_price}
                                </span>
                              )}
                          </div>
                        )}
                      </td>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 py-1 rounded ${
                            product.maincategory
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-50 text-gray-500"
                          }`}
                        >
                          {product.maincategory || "Not set"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 py-1 rounded ${
                            product.subcategory
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-50 text-gray-500"
                          }`}
                        >
                          {product.subcategory || "Not set"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setViewProduct(product)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEditForm(product)}
                            className="text-[#2E8B57] hover:text-[#1a6b3a]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
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
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setViewProduct(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              {viewProduct.image_url && (
                <img
                  src={
                    viewProduct.image_url.startsWith("/")
                      ? `${window.location.origin}${viewProduct.image_url}`
                      : viewProduct.image_url
                  }
                  alt={viewProduct.name}
                  className="h-32 w-32 object-cover rounded mb-4"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/100x100?text=No+Image";
                  }}
                />
              )}
              <h2 className="text-xl font-bold mb-2">{viewProduct.name}</h2>
              <p className="text-gray-600 mb-2">{viewProduct.description}</p>
              <div className="mb-2">
                <span className="font-semibold">Sizes: </span>
                {Array.isArray(viewProduct.sizes) &&
                viewProduct.sizes.length > 0 ? (
                  <ul className="list-disc ml-4">
                    {viewProduct.sizes.map((sz, i) => (
                      <li key={i} className="text-sm">
                        <span className="font-medium">
                          {sz.size || sz.pack_size || "-"}
                        </span>
                        {" - "}₹{sz.price}
                        {sz.mrp_price && (
                          <span className="ml-2 text-gray-500 line-through">
                            ₹{sz.mrp_price}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    ₹{viewProduct.sale_price || viewProduct.price || 0}
                    {viewProduct.mrp_price &&
                      viewProduct.mrp_price >
                        (viewProduct.sale_price || viewProduct.price) && (
                        <span className="ml-2 text-gray-500 line-through">
                          ₹{viewProduct.mrp_price}
                        </span>
                      )}
                  </>
                )}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Stock: </span>
                {viewProduct.stock}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Main Category: </span>
                {viewProduct.maincategory || "Not set"}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Sub Category: </span>
                {viewProduct.subcategory || "Not set"}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Status: </span>
                {viewProduct.is_active ? "Active" : "Inactive"}
              </div>
              {/* Show all images if available */}
              <div className="flex flex-wrap gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((i) => {
                  const url = viewProduct[`image_url${i}`];
                  return url ? (
                    <img
                      key={i}
                      src={
                        url.startsWith("/")
                          ? `${window.location.origin}${url}`
                          : url
                      }
                      alt={`Product image ${i}`}
                      className="h-12 w-12 object-cover rounded border"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/48x48?text=No+Image";
                      }}
                    />
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductList;