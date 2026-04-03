import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import W210 from "../wwimages/W210.png";
import { useCart } from "../context/CartContext";
import { API_BASE_URL } from "../services/api";
import {
  FaLeaf,
  FaHeart,
  FaBrain,
  FaFire,
  FaSeedling,
  FaShieldAlt,
  FaShoppingCart,
  FaBolt,
  FaStar,
  FaTimes,

 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const W210Details = ({ onClose }) => {
 
  const navigate = useNavigate();

    const [product, setProduct] = useState({
    id: 2,
    name: "W210 Cashew Nuts",
    image: W210,
    category: "Whole White",
    description: "Premium quality medium-large cashews (210 nuts per pound)",
    sizes: [],
    stock: 45,
    rating: 4.7,
    isNew: true,
  });

  const [quantity, setQuantity] = useState(1);
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [activeTab, setActiveTab] = useState("features");
  const { addToCart } = useCart();

const selectedSize =
  product.sizes.find((size) => size.id === selectedSizeId) ||
  product.sizes[0] || 
  { id: "", label: "", price: 0 };

    useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/export-premium-cashews`);
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const found = data.data.find(p => p.name === product.name);
          if (found) {
            setProduct(prev => ({
              ...prev,
              sizes: found.sizes.map((s) => ({
                id: s.id,
                label: s.size,
                price: s.price,
              })),
            }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch W210 product:", err);
      }
    };
    fetchProduct();
  }, []);


  useEffect(() => {
    if (product?.sizes?.length > 0 && !selectedSizeId) {
      setSelectedSizeId(product.sizes[0].id);
    }
  }, [product, selectedSizeId]);

  const handleAddToCart = () => {
    // ✅ Validate that we have a selected size
    if (!selectedSize) {
      console.error("No size selected");
      alert("Please select a size before adding to cart");
      return;
    }

    // ✅ Use size ID as the unique identifier for cart items
    const cartItem = {
    id: selectedSizeId,          
    name: product.name,
      image: product.image,
    category: product.category,
  price: Number(selectedSize.price),
      size: selectedSize.label,
      quantity: quantity,
    description: product.description,
    stock: product.stock,
    };

    console.log("Adding to cart:", cartItem);
    
    addToCart(cartItem);
    
    const notification = document.getElementById("cart-notification");
    if (notification) {
      notification.classList.remove("hidden");
      setTimeout(() => {
        notification.classList.add("hidden");
      }, 2000);
    }
  };



  const handleBuyNow = () => {
    onClose();

  navigate("/productdetails", {
    state: {
      product: {
        id: selectedSizeId,
        name: product.name,
        description: product.description,
        image: product.image,
        image_url: product.image,
        category: product.category,
        stock: product.stock,

    
        sizes: product.sizes.map((s) => ({
          size: s.label,
          price: s.price,
        })),
      },
    },
  });
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
            icon: <FaStar className="text-yellow-500 text-xl" />,
            text: "Grade: W210 (210 nuts per pound)",
          },
          {
            icon: "📏",
            text: "Size: Medium-large, premium jumbo size",
          },
          {
            icon: "👌",
            text: "Texture: Smooth, creamy and crunchy",
          },
          {
            icon: "👅",
            text: "Flavor: Naturally sweet and rich",
          },
          {
            icon: <FaLeaf className="text-[#2E8B57] text-xl" />,
            text: "Quality: Handpicked, 100% natural",
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
            text: "Heart health: Rich in unsaturated fats",
          },
          {
            icon: <FaFire className="text-orange-500 text-xl" />,
            text: "Energy boost: High calorie density",
          },
          {
            icon: <FaSeedling className="text-green-500 text-xl" />,
            text: "Mineral-rich: Magnesium, zinc, copper",
          },
          {
            icon: <FaLeaf className="text-[#2E8B57] text-xl" />,
            text: "Weight management: Promotes satiety",
          },
          {
            icon: <FaBrain className="text-blue-500 text-xl" />,
            text: "Brain function: Supports cognition",
          },
          {
            icon: <FaShieldAlt className="text-purple-500 text-xl" />,
            text: "Immunity: Packed with antioxidants",
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
          "🍿 Snacking: Enjoy as a healthy, satisfying snack",
          "🍳 Cooking: Adds flavor to curries and rice dishes",
          "🧁 Baking: Perfect for cookies and desserts",
          "🥗 Salads: Adds crunch and nutrition",
          "🥜 Nut Butter: Makes creamy cashew butter",
          "🎁 Gifting: A classy and nutritious gift",
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
          "Refrigerate for extended freshness",
          "Avoid heat and moisture",
          "Consume within 6 months for best quality",
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
     className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] p-2 sm:p-4"
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
       className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col relative z-[10000]"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Close button */}
        <motion.button
          onClick={onClose}
         className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white text-red-500 shadow-md hover:bg-red-500 hover:text-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center z-50"          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close"
        >
          <FaTimes className="w-7 h-7" />
        </motion.button>

        {/* Scrollable content */}
        <div className="px-4 sm:px-8 pt-10 sm:pt-12 pb-32 overflow-y-auto flex-1 hide-scrollbar">
          {/* Product header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2E8B57] leading-tight">
                W210 Cashew Nuts
              </h1>
              {product.isNew && (
                <span className="bg-[#C1440E] text-white text-xs px-2 py-1 rounded-full">
                  PREMIUM
                </span>
              )}
            </div>
         
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            
            <div className="lg:w-2/5">

            <div className="relative">

    {/* ✅ IMAGE ADD HERE */}
    <img
      src={W210}
      alt="W210 Cashew"
      className="w-full max-h-[250px] sm:max-h-[350px] object-contain rounded-xl shadow-md"
    />


  </div>
           

     
<div className="mt-3 sm:mt-4 bg-[#2E8B57]/10 p-2 sm:p-3 rounded-lg">
  <div className="flex justify-between items-center">
    <span className="font-semibold text-sm sm:text-base">Price:</span>
    <span className="text-[#2E8B57] font-bold sm:text-lg">
      {selectedSize.price 
        ? `₹${selectedSize.price} / ${selectedSize.label}` 
        : "Loading..."} {/* ✅ show loading while API fetches */}
    </span>
  </div>
</div>

              {/* Size selection */}
              <div className="mt-4 sm:mt-6">
                <h3 className="text-lg font-semibold mb-2">Select Size:</h3>
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
                  W210 cashews, also known as "Jumbo Size" cashews, are one of
                  the most popular and premium grades of cashew nuts. Known for
                  their large size, creamy texture, and mildly sweet flavor,
                  these cashews are perfect for both snacking and gourmet
                  cooking. Each nut is carefully selected to ensure uniform
                  size, natural color, and superior taste.
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


        
    </motion.div>
  );
};

export default W210Details;