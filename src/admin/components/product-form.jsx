import React, { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";
import { toRelativeImagePath } from "../../services/api";


const CATEGORY_CONFIG = {
  mainCategories: [
    { label: "Seeds", value: "Seeds" },
    { label: "Nuts", value: "Nuts" },
    { label: "Dry Fruits", value: "Fruits" },
    { label: "Gifts ", value: "Gifts" },
     { label: "Healthy Snacks ", value: "HealthySnacks" },
          { label: "Honey Dry Fruits", value: "HoneyDryFruits" },
  ],

  subCategories: {
    Nuts: [
      { label: "Cashew Nuts (Mundhiri)", value: "Cashew Nuts (Mundhiri)" },
      { label: "Almonds (Badam)", value: "Almonds (Badam)" },
      { label: "Pistachios (Pista)", value: "Pistachios (Pista)" },
      { label: "Pistachios (Pista)", value: "Pistachios (Pista)" },
      { label: "Honeyed Nuts", value: "Honeyed Nuts" },
      { label: "Dry Fruits", value: "Dry Fruits" },
      { label: "Roasted Nuts", value: "Roasted Nuts" },
      { label: "Nut Chocolates", value: "Nut Chocolates" },
      { label: "Mixed Container", value: "Mixed Container" },
        { label: "smallbox4Window", value: "smallbox4Window" },
              { label: "2containersmall", value: "2containersmall" },
      { label: "2containerlong", value: "2containerlong" },
    ],

    Seeds: [
      { label: "Pumpkin Seeds", value: "Pumpkin Seeds" },
      { label: "Sunflower Seeds", value: "Sunflower Seeds" },
      { label: "Chia Seeds", value: "Chia Seeds" },
      { label: "Watermelon Seeds", value: "Watermelon Seeds" },
      { label: "Basil Seeds (Sabja)", value: "Basil Seeds (Sabja)" },
      { label: "Cucumber Seeds", value: "Cucumber Seeds" },
      { label: "2containersmall seeds", value: "2containersmall seeds" },
      { label: "2containerlong seeds", value: "2containerlong seeds" },
      { label: "smallbox4Window seeds", value: "smallbox4Window seeds" },
    ],

    Fruits: [
      { label: "Dates", value: "Dates" },
      { label: "Athipazham (Fig / Anjeer)", value: "Athipazham (Fig / Anjeer)" },
      { label: "Black Raisins", value: "Black Raisins" },
      { label: "Golden Raisins (Seedless Raisins)", value: "Golden Raisins (Seedless Raisins)" },
      { label: "Dry Kiwi", value: "Dry Kiwi" },
      { label: "Mixed Dry Fruits", value: "Mixed Dry Fruits" },
    ],

    Gifts: [
      {label: "Gift Basket", value: "Gift Basket" },
      { label: "Dry Fruit Gifting", value: "Dry Fruit Gifting" },
      { label: "Gift Hamper", value: "Gift Hamper" },
 
    ],
      HealthySnacks : [
      {label: "Choculate", value: "Choculate" },
      { label: "Dry Fruits Laddu", value: "Dry Fruit Laddu" },
      { label: "Roasted Snacks", value: "Roasted Snacks" },
      
 
    ],
    HoneyDryFruits : [
      {label: "Honey Mixed Dry Fruits", value: "Honey Mixed Dry Fruits" },
      {label: "Pure Honey", value: "Pure Honey" },
      {label: "Honey Mixed Nuts", value: "Honey Mixed Nuts" },
      {label: "Honey Roasted Almonds", value: "Honey Roasted Almonds" },
      {label: "Honey Roasted Cashews", value: "Honey Roasted Cashews" },
            {label: "Honey Roasted Seeds Mix", value: "Honey Roasted Seeds Mix" },
      
    ]
    
  },
};


const HOMEPAGE_COLLECTION_OPTIONS = [
  { label: "Nature's Best", value: "Nature's Best" },
  { label: "Premium 4-View Container", value: "Premium 4-View Container" },
  { label: "Gift Hampers", value: "Gift Hampers" },
  { label: "Royal Combo", value: "Royal Combo" },
  { label: "2-Tier Collection", value: "2-Tier Collection" },
  { label: "4-Compartment Box", value: "4-Compartment Box" },
];

const INITIAL_FORM = {
  name: "",
  description: "",
  sizes: [],
  stock: 0,
  pack_of: [],
  category: "",
  maincategory: "",
  subcategory: "",
  homepage_collection: "",
  images: [],
  is_active: true,
};

const ProductForm = ({ editingProduct, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [subCategories, setSubCategories] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [sizeInput, setSizeInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [mrpInput, setMrpInput] = useState("");

 
  useEffect(() => {
    if (editingProduct) {
      const images = [];
      for (let i = 1; i <= 5; i++) {
        const key = `image_url${i}`;
        if (editingProduct[key]) images.push(editingProduct[key]);
      }

      const processedSizes = Array.isArray(editingProduct.sizes)
        ? editingProduct.sizes.map((s) => ({
            size: s.size || s.pack_size || "",
            price: s.price || "",
            mrp_price: s.mrp_price || "",
          }))
        : [];

      setForm({
        name: editingProduct.name || "",
        description: editingProduct.description || "",
        sizes: processedSizes,
        stock: editingProduct.stock || 0,
        pack_of: Array.isArray(editingProduct.pack_of)
          ? editingProduct.pack_of
          : editingProduct.pack_of
          ? [editingProduct.pack_of]
          : [],
        category: editingProduct.category || "",
        maincategory: editingProduct.maincategory || "",
        subcategory: editingProduct.subcategory || "",
        homepage_collection: editingProduct.homepage_collection || "",
        images,
        is_active: editingProduct.is_active !== undefined ? editingProduct.is_active : true,
      });

      if (editingProduct.maincategory && CATEGORY_CONFIG.subCategories[editingProduct.maincategory]) {
        setSubCategories(CATEGORY_CONFIG.subCategories[editingProduct.maincategory]);
      }
    } else {
      setForm(INITIAL_FORM);
      setSubCategories([]);
    }
    setSizeInput("");
    setPriceInput("");
    setMrpInput("");
  }, [editingProduct]);

  const handleMainCategoryChange = (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, maincategory: value, subcategory: "" }));
    setSubCategories(value && CATEGORY_CONFIG.subCategories[value] ? CATEGORY_CONFIG.subCategories[value] : []);
  };

  const addSize = () => {
    if (!sizeInput || !priceInput || !mrpInput) return;
    if (Number(priceInput) > Number(mrpInput)) {
      alert("Selling price cannot be greater than MRP");
      return;
    }
    setForm((f) => ({
      ...f,
      sizes: [...f.sizes, { size: sizeInput, price: priceInput, mrp_price: mrpInput }],
    }));
    setSizeInput("");
    setPriceInput("");
    setMrpInput("");
  };

  const updateSize = (idx, field, value) => {
    const newSizes = [...form.sizes];
    newSizes[idx] = { ...newSizes[idx], [field]: value };
    setForm((f) => ({ ...f, sizes: newSizes }));
  };

  const removeSize = (idx) => {
    setForm((f) => ({ ...f, sizes: f.sizes.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const imageData = {};
    form.images.forEach((image, index) => {
      imageData[`image_url${index + 1}`] = toRelativeImagePath(image);
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
      homepage_collection: form.homepage_collection,
      image_url: form.images[0] ? toRelativeImagePath(form.images[0]) : null,
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

    onSubmit(payload, editingProduct?.id);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg sm:text-xl font-semibold">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full mt-1 p-2 border rounded text-sm sm:text-base"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full mt-1 p-2 border rounded text-sm sm:text-base"
              placeholder="Enter product description"
              rows="3"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              required
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              className="w-full mt-1 p-2 border rounded text-sm sm:text-base"
              placeholder="Enter stock quantity"
            />
          </div>

          {/* Sizes Section */}
          <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
            <label className="block text-sm font-medium mb-3">Sizes with Price & MRP</label>

            {/* Add Size Row */}
            <div className="flex flex-wrap gap-2 mb-4">
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                className="flex-1 min-w-[100px] p-2 border rounded text-sm"
                placeholder="Size (e.g. 200g)"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="flex-1 min-w-[100px] p-2 border rounded text-sm"
                placeholder="Price"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={mrpInput}
                onChange={(e) => setMrpInput(e.target.value)}
                className="flex-1 min-w-[100px] p-2 border rounded text-sm"
                placeholder="MRP"
              />
              <button
                type="button"
                onClick={addSize}
                className="px-3 py-2 bg-[#2E8B57] text-white rounded text-sm whitespace-nowrap"
              >
                Add
              </button>
            </div>

            {/* Sizes List */}
            <div className="space-y-2">
              {form.sizes.length === 0 ? (
                <div className="text-xs text-gray-400 italic p-3 text-center border border-dashed rounded">
                  No sizes added yet
                </div>
              ) : (
                form.sizes.map((item, idx) => (
                  <div key={idx} className="flex flex-wrap gap-2 items-center text-sm bg-white p-2 rounded border">
                    <input
                      type="text"
                      value={item.size}
                      onChange={(e) => updateSize(idx, "size", e.target.value)}
                      className="w-20 p-1 border rounded text-sm"
                      placeholder="Size"
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateSize(idx, "price", e.target.value)}
                      className="w-20 p-1 border rounded text-sm"
                      placeholder="Price"
                    />
                    <input
                      type="number"
                      value={item.mrp_price}
                      onChange={(e) => updateSize(idx, "mrp_price", e.target.value)}
                      className="w-20 p-1 border rounded text-sm"
                      placeholder="MRP"
                    />
                    <button
                      type="button"
                      onClick={() => removeSize(idx)}
                      className="text-red-500 text-sm ml-auto"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium">Category (Legacy)</label>
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full mt-1 p-2 border rounded text-sm"
                placeholder="Optional"
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
                className="w-full mt-1 p-2 border rounded text-sm"
              >
                <option value="">Select</option>
                {CATEGORY_CONFIG.mainCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Sub Category</label>
              <select
                value={form.subcategory}
                onChange={(e) => setForm((f) => ({ ...f, subcategory: e.target.value }))}
                className="w-full mt-1 p-2 border rounded text-sm"
                disabled={!form.maincategory}
              >
                <option value="">Select</option>
                {subCategories.map((sub) => (
                  <option key={sub.value} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Homepage Collection</label>
              <select
                value={form.homepage_collection}
                onChange={(e) =>
                  setForm((f) => ({ ...f, homepage_collection: e.target.value }))
                }
                className="w-full mt-1 p-2 border rounded text-sm"
              >
                <option value="">None</option>
                {HOMEPAGE_COLLECTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <ImageUploader
            images={form.images}
            setImages={(updater) =>
              setForm((f) => ({
                ...f,
                images: typeof updater === "function" ? updater(f.images) : updater,
              }))
            }
            uploadingImages={uploadingImages}
            setUploadingImages={setUploadingImages}
          />

          {/* Active Toggle */}
          <div className="flex items-center space-x-3">
            <input
              id="isActive"
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              className="h-4 w-4"
            />
            <label htmlFor="isActive" className="text-sm">
              Active
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={form.images.length === 0 || loading}
              className="px-4 py-2 bg-[#2E8B57] text-white rounded hover:bg-[#1a6b3a] disabled:opacity-50 transition text-sm"
            >
              {loading ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;