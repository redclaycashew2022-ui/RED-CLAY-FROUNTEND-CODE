import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Roasted from "../wwimages/Roasted.png";
import { useCart } from "../context/CartContext";
import {
  FaHeart,
  FaFire,
  FaBrain,
  FaLeaf,
  FaSeedling,
  FaShieldAlt,
  FaShoppingCart,
  FaBolt,
  FaPepperHot,
  FaUtensils,
  FaGift,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RoastedCashew = ({ onClose }) => {
    const [isImageZoomed, setIsImageZoomed] = useState(false);
  const product = {
    id: 7,
    name: "Spicy Roasted Cashews",
    image: Roasted,
    category: "Flavored Cashews",
    description: "Perfectly roasted premium cashews with a special spice blend",
    basePrice: 650,
    sizes: [
      { id: "size-250", label: "250g", multiplier: 1 },
      { id: "size-500", label: "500g", multiplier: 2 },
      { id: "size-1kg", label: "1kg", multiplier: 4 },
    ],
    stock: 90,
    rating: 4.7,
  };

  const [quantity, setQuantity] = useState(1);
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart } = useCart();
    const navigate =useNavigate()

  const selectedSize =
    product.sizes.find((size) => size.id === selectedSizeId) ||
    product.sizes[0];

  useEffect(() => {
    if (product?.sizes?.length > 0 && !selectedSizeId) {
      setSelectedSizeId(product.sizes[0].id);
    }
  }, [product, selectedSizeId]);

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

    const notify = document.getElementById("cart-notification");
    notify.classList.remove("hidden");
    setTimeout(() => {
      notify.classList.add("hidden");
    }, 2000);
  };

    const handleBuyNow = () => {
      onClose();
      navigate(`/products/${product.id}`);
    };
  const tabContent = {
    description: (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <p className="text-gray-700">
          Perfectly roasted premium cashews coated with a special blend of
          chili, turmeric, and spices for that irresistible kick. Crunchy,
          flavorful, and made fresh to give you the perfect snack anytime!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: <FaPepperHot className="text-red-500" />,
              text: "Bold & spicy flavor profile",
            },
            { icon: "🔥", text: "Freshly roasted for maximum crunch" },
            {
              icon: <FaGift className="text-purple-500" />,
              text: "Beautifully packaged - perfect for gifting",
            },
            {
              icon: <FaUtensils className="text-amber-500" />,
              text: "Ready-to-eat delicious snack",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="bg-[#FAF9F6] p-3 rounded-lg flex items-start"
            >
              <span className="text-2xl mr-3">{item.icon}</span>
              <p>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    ),
    details: (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div>
          <h3 className="font-semibold text-lg mb-2">Ingredients:</h3>
          <p className="text-gray-700">
            Cashews, edible oil, chili powder, turmeric, salt, and spices.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Storage Instructions:</h3>
          <p className="text-gray-700">
            Store in a cool, dry place in an airtight container to maintain
            freshness.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Why You'll Love It:</h3>
          <ul className="space-y-2">
            {[
              "Premium quality whole cashews",
              "Freshly roasted for maximum crunch",
              "Bold & spicy flavor that's not overpowering",
              "Perfect balance of heat and natural cashew sweetness",
              "Great for snacking or gifting",
              "No artificial flavors or preservatives",
            ].map((item, index) => (
              <motion.li
                key={index}
                whileHover={{ x: 5 }}
                className="flex items-start"
              >
                <span className="text-green-500 mr-2">✓</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    ),
    benefits: (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {[
          {
            icon: <FaFire className="text-orange-500" />,
            text: "Metabolism-boosting spices for energy",
          },
          {
            icon: <FaHeart className="text-red-500" />,
            text: "Heart-healthy monounsaturated fats",
          },
          {
            icon: <FaShieldAlt className="text-purple-500" />,
            text: "Turmeric provides anti-inflammatory benefits",
          },
          {
            icon: <FaSeedling className="text-green-500" />,
            text: "Rich in plant-based protein and fiber",
          },
          {
            icon: <FaBrain className="text-blue-500" />,
            text: "Supports brain function with essential minerals",
          },
          {
            icon: <FaLeaf className="text-[#2E8B57]" />,
            text: "Natural ingredients with no artificial additives",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className="bg-[#FAF9F6] p-3 rounded-lg flex items-start"
          >
            <span className="text-xl mr-3 mt-1">{item.icon}</span>
            <p>{item.text}</p>
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
      <div
        id="cart-notification"
        className="hidden fixed top-4 right-4 bg-[#2E8B57] text-white px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base rounded-lg shadow-lg z-50"
      >
        Added to cart successfully!
      </div>

      <motion.div
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col relative pt-8"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Close */}
        <motion.button
          onClick={onClose}
          className="absolute top-20 right-4 bg-white hover:bg-red-100 hover:text-white text-red-200 rounded-full w-10 h-10 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close"
        >
          <FaTimes className="w-7 h-7" />
        </motion.button>

        {/* Content */}
        <div className="px-4 sm:px-8 pt-12 pb-32 overflow-y-auto flex-1 hide-scrollbar">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#C1440E]">
              Spicy Roasted Cashews 🌶🥜
            </h1>
            <p className="text-gray-600">
              Irresistibly crunchy with the perfect kick of spice
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image */}
            <div className="lg:w-2/5">
              <img
                src={Roasted}
                alt="Spicy Roasted Cashews"
                className="rounded-xl shadow-lg border-4 border-[#C1440E]/20"
                onClick={() => {
                  setIsImageZoomed(true);
                }}
                style={{ cursor: "zoom-in" }}
              />

              {/* Price */}
              <div className="mt-4 bg-[#C1440E]/10 p-3 rounded-lg">
                <span className="font-semibold">Price:</span>{" "}
                <span className="text-[#C1440E] font-bold text-lg">
                  ₹{product.basePrice * selectedSize.multiplier} /{" "}
                  {selectedSize.label}
                </span>
              </div>

              {/* Sizes */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Select Size:</h3>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size.id}
                      onClick={() => setSelectedSizeId(size.id)}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm ${
                        selectedSizeId === size.id
                          ? "bg-[#C1440E] text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {size.label} (₹{product.basePrice * size.multiplier})
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
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

            {/* Details */}
            <div className="lg:w-3/5">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
                {[
                  { id: "description", label: "Description" },
                  { id: "details", label: "Product Details" },
                  { id: "benefits", label: "Health Benefits" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 text-sm sm:text-base font-medium whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-[#C1440E] border-b-2 border-[#C1440E]"
                        : "text-gray-500 hover:text-[#C1440E]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

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

        {/* Bottom */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm sm:text-base">
                  Total:
                </span>
                <div className="text-right">
                  <p className="text-lg sm:text-xl font-bold text-[#C1440E]">
                    ₹
                    {(
                      product.basePrice *
                      selectedSize.multiplier *
                      quantity
                    ).toFixed(2)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {quantity} × {selectedSize.label} @ ₹
                    {product.basePrice * selectedSize.multiplier}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-2 w-full sm:w-auto sm:gap-3">
              <motion.button
                onClick={handleAddToCart}
                className="bg-[#C1440E] hover:bg-[#9a360b] text-white py-2 px-4 sm:py-3 sm:px-6 rounded-lg font-medium shadow-md flex items-center justify-center flex-1 text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaShoppingCart className="mr-2" /> Add to Cart
              </motion.button>
              <motion.button
                onClick={handleBuyNow}
                className="bg-[#2E8B57] hover:bg-[#1a6b3a] text-white py-2 px-4 sm:py-3 sm:px-6 rounded-lg font-medium shadow-md flex items-center justify-center flex-1 text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaBolt className="mr-2" /> Buy Now
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      {isImageZoomed && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center p-4"
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
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
          >
            <FaTimes />
          </button>
          <div className="max-w-4xl w-full h-full flex items-center justify-center">
            <img
              src={Roasted}
              alt="Zoomed Roasted Cashews"
              className="max-h-full max-w-full object-contain"
              onClick={() => setIsImageZoomed(true)}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RoastedCashew;
