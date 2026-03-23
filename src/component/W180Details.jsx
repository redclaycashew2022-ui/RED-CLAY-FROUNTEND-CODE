import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import W180 from "../wwimages/W180.png";
import { useCart } from "../context/CartContext";
import {
  FaLeaf,
  FaHeart,
  FaBrain,
  FaFire,
  FaSeedling,
  FaShieldAlt,
  FaShoppingCart,
  FaBolt,
  FaCrown,
  FaGem,
  FaAward,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const W180Details = ({ onClose }) => {
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [product, setProduct] = useState({
    name: "W180 Cashew Nuts - King of Cashews",
    image: W180,
    category: "Whole White",
    description: "King of Cashews - Extra large size (180 nuts per pound)",
    sizes: [],
    stock: 50,
    rating: 4.8,
    isNew: true,
  });
  // Fetch product details from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://red-clay-backend.onrender.com/api/export-premium-cashews?name=${encodeURIComponent(product.name)}`
        );
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const found = data.data.find(p => p.name === product.name);
          if (found) {
            setProduct(prev => ({
              ...prev,
              sizes: found.sizes.map((s) => ({
                id: s.id,
                label: s.size,
                price: s.price
              })),
            }));
          }
        }
      } catch (err) {
        // fallback: do nothing
      }
    };
    fetchProduct();
  }, []);

  const [quantity, setQuantity] = useState(1);
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [activeTab, setActiveTab] = useState("features");
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const selectedSize =
    product.sizes.find((size) => size.id === selectedSizeId) ||
    product.sizes[0] || { label: "", price: 0 };

  useEffect(() => {
    if (product?.sizes?.length > 0) {
      setSelectedSizeId(product.sizes[0].id);
    }
  }, [product.sizes]);

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      price: product.basePrice * selectedSize.multiplier,
      size: selectedSize.label,
      quantity: quantity,
      description: product.description,
      stock: product.stock,
    };

    addToCart(cartItem);
    document.getElementById("cart-notification").classList.remove("hidden");
    setTimeout(() => {
      document.getElementById("cart-notification").classList.add("hidden");
    }, 2000);
  };

  const handleBuyNow = () => {
    onClose();
    navigate(`/products/${product.id}`);
  };

  const tabContent = {
    features: (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {[
          {
            icon: <FaCrown className="text-yellow-500 text-xl" />,
            text: "Grade: W180 (180 nuts per pound)",
          },
          {
            icon: "👑",
            text: "Premium Quality: Largest cashew grade",
          },
          {
            icon: <FaGem className="text-blue-500 text-xl" />,
            text: "Texture: Creamy and buttery",
          },
          {
            icon: "👅",
            text: "Flavor: Rich and naturally sweet",
          },
          {
            icon: <FaAward className="text-[#2E8B57] text-xl" />,
            text: "100% natural, no preservatives",
          },
          {
            icon: "⏳",
            text: "Shelf Life: 6-9 months when stored properly",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="bg-[#FAF9F6] p-3 rounded-lg flex items-start gap-2"
          >
            <span className="mt-0.5">{item.icon}</span>
            <p className="text-sm sm:text-base">{item.text}</p>
          </motion.div>
        ))}
      </motion.div>
    ),
    benefits: (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {[
          {
            icon: <FaHeart className="text-red-500 text-xl" />,
            text: "Supports heart health with healthy fats",
          },
          {
            icon: <FaFire className="text-orange-500 text-xl" />,
            text: "Provides sustained energy",
          },
          {
            icon: <FaSeedling className="text-green-500 text-xl" />,
            text: "Rich in magnesium, copper, and zinc",
          },
          {
            icon: <FaLeaf className="text-[#2E8B57] text-xl" />,
            text: "Promotes satiety and weight management",
          },
          {
            icon: <FaBrain className="text-blue-500 text-xl" />,
            text: "Supports brain function",
          },
          {
            icon: <FaShieldAlt className="text-purple-500 text-xl" />,
            text: "Contains antioxidants",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="bg-[#FAF9F6] p-3 rounded-lg flex items-start gap-2"
          >
            <span className="mt-0.5">{item.icon}</span>
            <p className="text-sm sm:text-base">{item.text}</p>
          </motion.div>
        ))}
      </motion.div>
    ),
    usage: (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-2"
      >
        {[
          "🎁 Luxury gifting for special occasions",
          "🍽️ Fine dining and gourmet cooking",
          "🧁 Premium desserts and baking",
          "🥂 Party snacks and events",
          "🧈 Ultra-smooth cashew butter",
          "🌱 Healthy snacking options",
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ x: 5 }}
            className="flex items-start"
          >
            <span className="text-lg mr-2">•</span>
            <p className="text-sm sm:text-base">{item}</p>
          </motion.div>
        ))}
      </motion.div>
    ),
    storage: (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-2"
      >
        {[
          "Store in airtight containers",
          "Keep in cool, dry place",
          "Refrigerate for longer shelf life",
          "Avoid heat and moisture",
          "Use within 6 months for best quality",
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ x: 5 }}
            className="flex items-start"
          >
            <span className="text-lg mr-2">•</span>
            <p className="text-sm sm:text-base">{item}</p>
          </motion.div>
        ))}
      </motion.div>
    ),
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Cart Notification */}
      <div
        id="cart-notification"
        className="hidden fixed top-1 right-4 bg-[#2E8B57] text-white px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base rounded-lg shadow-lg z-[100]"
      >
        Added to cart successfully!
      </div>

      <motion.div
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col relative pt-8"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Close button - Fixed positioning with higher z-index */}
        <motion.button
          onClick={onClose}
          className="absolute top-20 right-4 bg-white hover:bg-red-100 hover:text-white text-red-200 rounded-full w-10 h-10 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close"
        >
          <FaTimes className="w-7 h-7" />
        </motion.button>

        {/* Scrollable content */}
        <div className="px-4 sm:px-8 pt-16 pb-32 overflow-y-auto flex-1 hide-scrollbar">
          {/* Product header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2E8B57]">
                W180 Cashew Nuts - King of Cashews
              </h1>
              {product.isNew && (
                <span className="bg-[#C1440E] text-white text-xs px-2 py-1 rounded-full">
                  PREMIUM
                </span>
              )}
            </div>
            <div className="bg-[#2E8B57]/10 px-3 py-1 rounded-full inline-block mt-2">
              <span className="text-[#2E8B57] font-semibold">
                Price: {selectedSize.price ? `₹${selectedSize.price} / ${selectedSize.label}` : "Not available"}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image section */}
            <div className="lg:w-2/5">
              <div className="relative">
                <motion.div
                  className="cursor-zoom-in"
                  onClick={() => setIsImageZoomed(true)}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={W180}
                    alt="Whole White W180 Cashews"
                    className="w-full h-auto rounded-xl shadow-lg border-4 border-[#2E8B57]/20"
                  />
                </motion.div>
                {product.isNew && (
                  <div className="absolute top-2 left-2 bg-[#C1440E] text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
                    NEW
                  </div>
                )}
              </div>

              {/* Size selection */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Select Size:</h3>
                {product.sizes.length > 0 ? (
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <motion.button
                        key={size.id}
                        onClick={() => setSelectedSizeId(size.id)}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm ${
                          selectedSizeId === size.id
                            ? "bg-[#2E8B57] text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="whitespace-nowrap">{size.label}</span>
                        <span className="hidden sm:inline"> (₹{size.price})</span>
                        <span className="sm:hidden">/₹{size.price}</span>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">Sizes not available</div>
                )}
              </div>

              {/* Quantity selector */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Quantity:</h3>
                <div className="flex items-center border border-gray-300 rounded-full w-max">
                  <motion.button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 sm:px-4 sm:py-2 text-gray-600 hover:text-[#C1440E]"
                    whileTap={{ scale: 0.9 }}
                  >
                    -
                  </motion.button>
                  <span className="px-3 py-1 sm:px-4 sm:py-2 text-gray-800 w-8 sm:w-12 text-center">
                    {quantity}
                  </span>
                  <motion.button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 sm:px-4 sm:py-2 text-gray-600 hover:text-[#C1440E]"
                    whileTap={{ scale: 0.9 }}
                  >
                    +
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Details section */}
            <div className="lg:w-3/5">
              {/* Description Section */}
              <div className="mb-6 bg-[#FAF9F6] p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-[#2E8B57]">
                  Description:
                </h3>
                <p className="text-gray-700">
                  Red Clay Cashews brings you the finest W180 Whole Cashews –
                  known as the "King of Cashews" due to their extra-large size,
                  creamy texture, and rich buttery flavor. Handpicked and
                  carefully processed to preserve their natural quality, W180
                  cashews are a mark of luxury and taste.
                </p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
                {[
                  { id: "features", label: "Key Features" },
                  { id: "benefits", label: "Health Benefits" },
                  { id: "usage", label: "Usage Ideas" },
                  { id: "storage", label: "Storage Tips" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 text-sm sm:text-base font-medium whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-[#2E8B57] border-b-2 border-[#2E8B57]"
                        : "text-gray-500 hover:text-[#C1440E]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-[200px] sm:min-h-[300px]"
                >
                  {tabContent[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sticky bottom bar with price and buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4 shadow-lg z-30">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Total price display */}
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm sm:text-base">
                  Total:
                </span>
                <div className="text-right">
                  <p className="text-lg sm:text-xl font-bold text-[#2E8B57]">
                    ₹{(Number(selectedSize.price) * quantity).toFixed(2)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {quantity} × {selectedSize.label} @ ₹{selectedSize.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-row gap-2 w-full sm:w-auto sm:gap-3">
              <motion.button
                onClick={handleAddToCart}
                className="bg-[#2E8B57] hover:bg-[#1a6b3a] text-white py-2 px-4 sm:py-3 sm:px-6 rounded-lg font-medium shadow-md flex items-center justify-center flex-1 text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </motion.button>
              <motion.button
                onClick={handleBuyNow}
                className="bg-[#C1440E] hover:bg-[#9a360b] text-white py-2 px-4 sm:py-3 sm:px-6 rounded-lg font-medium shadow-md flex items-center justify-center flex-1 text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaBolt className="mr-2" />
                Buy Now
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Image zoom modal */}
      <AnimatePresence>
        {isImageZoomed && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImageZoomed(false)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsImageZoomed(false);
              }}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center z-[71]"
            >
              <FaTimes className="w-6 h-6" />
            </button>
            <div className="max-w-4xl w-full h-full flex items-center justify-center">
              <img
                src={W180}
                alt="Zoomed Whole White W180 Cashews"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default W180Details;