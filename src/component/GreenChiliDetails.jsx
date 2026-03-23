import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GreenChiliCashewImage from "../wwimages/GreenChili.png";
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
  FaBurn,
  FaTimes,
} from "react-icons/fa";


const GreenChiliDetails = ({ onClose }) => {
   const [isImageZoomed, setIsImageZoomed] = useState(false);
  const product = {
    id: 10,
    name: "Green Chili Cashew with Skin",
    image: GreenChiliCashewImage,
    category: "Spicy Flavored",
    description: "Fiery green chili seasoned skin-on cashews",
    basePrice: 720,
    sizes: [
      { id: "size-250", label: "250g", multiplier: 1 },
      { id: "size-500", label: "500g", multiplier: 2 },
      { id: "size-1kg", label: "1kg", multiplier: 4 },
    ],
    stock: 65,
    rating: 4.8,
  };

  const [quantity, setQuantity] = useState(1);
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart } = useCart();

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

  const tabContent = {
    description: (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <p className="text-gray-700">
          Turn up the heat with our fiery Green Chili Cashew with Skin! Premium
          whole cashews are roasted to perfection with their natural skin
          intact, then coated in a bold green chili seasoning for a spicy kick
          that lingers. Perfect for adventurous snack lovers who crave flavor
          and crunch in every bite.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: <FaPepperHot className="text-green-600" />,
              text: "Spicy green chili flavor",
            },
            { icon: "🌰", text: "Premium cashews with skin" },
            {
              icon: <FaBurn className="text-red-500" />,
              text: "Fiery kick that lingers",
            },
            {
              icon: <FaFire className="text-red-500" />,
              text: "Fiery kick that lingers",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
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
            Cashew nuts with skin, green chili powder, salt, spices.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Storage Instructions:</h3>
          <p className="text-gray-700">
            Store in an airtight container in a cool, dry place to maintain
            freshness.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">
            Why Spice Lovers Choose This:
          </h3>
          <ul className="space-y-2">
            {[
              "Authentic green chili heat with every bite",
              "Crunchy texture from premium skin-on cashews",
              "Bold flavor that's not overpowering",
              "Higher nutrient content from natural skin",
              "Perfect snack for adventurous eaters",
              "Great conversation starter at parties",
            ].map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 5 }}
                className="flex items-start"
              >
                <span className="text-green-600 mr-2">✓</span>
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
            icon: <FaFire className="text-green-600" />,
            text: "Green chili boosts metabolism naturally",
          },
          {
            icon: <FaShieldAlt className="text-purple-500" />,
            text: "Rich in antioxidants from both cashew skin and chili",
          },
          {
            icon: <FaHeart className="text-red-500" />,
            text: "Heart-healthy fats from premium cashews",
          },
          {
            icon: <FaSeedling className="text-green-500" />,
            text: "High in minerals like magnesium and zinc",
          },
          {
            icon: <FaBrain className="text-blue-500" />,
            text: "Supports cognitive function with essential nutrients",
          },
          {
            icon: <FaLeaf className="text-[#8B4513]" />,
            text: "Natural ingredients with no artificial additives",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
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
      {/* Cart Notification */}
      <div
        id="cart-notification"
        className="hidden fixed top-4 right-4 bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg z-50"
      >
        Added to cart successfully!
      </div>

      <motion.div
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col relative pt-8"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Close Button */}
        <motion.button
          onClick={onClose}
          className="absolute top-20 right-4 bg-white hover:bg-red-100 hover:text-white text-red-200 rounded-full w-10 h-10 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close"
        >
          <FaTimes className="w-7 h-7" />
        </motion.button>

        {/* Scrollable Content */}
        <div className="px-4 sm:px-8 pt-12 pb-32 overflow-y-auto flex-1 hide-scrollbar">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-green-600">
              Green Chili Cashew with Skin 🌶️🌰
            </h1>
            <p className="text-gray-600">
              Fiery flavor meets rustic crunch - for true spice lovers!
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image Section */}
            <div className="lg:w-2/5">
              <img
                src={GreenChiliCashewImage}
                alt="Green Chili Cashew with Skin"
                className="w-full h-auto rounded-xl shadow-lg border-4 border-green-600/20"
                onClick={() => setIsImageZoomed(true)}
                style={{ cursor: "zoom-in" }}
              />

              {/* Price */}
              <div className="mt-4 bg-green-600/10 p-3 rounded-lg">
                <span className="font-semibold">Price:</span>{" "}
                <span className="text-green-600 font-bold text-lg">
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
                          ? "bg-green-600 text-white"
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
                    className="px-3 py-1 sm:px-4 sm:py-2 text-gray-600 hover:text-green-600"
                    whileTap={{ scale: 0.9 }}
                  >
                    -
                  </motion.button>
                  <span className="px-3 py-1 sm:px-4 sm:py-2 text-gray-800 w-8 sm:w-12 text-center">
                    {quantity}
                  </span>
                  <motion.button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 sm:px-4 sm:py-2 text-gray-600 hover:text-green-600"
                    whileTap={{ scale: 0.9 }}
                  >
                    +
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="lg:w-3/5">
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
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-500 hover:text-green-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
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

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm sm:text-base">
                  Total:
                </span>
                <div className="text-right">
                  <p className="text-lg sm:text-xl font-bold text-green-600">
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
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-lg font-medium shadow-md flex items-center justify-center flex-1 text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaShoppingCart className="mr-2" /> Add to Cart
              </motion.button>
              <motion.button
                className="bg-[#C1440E] hover:bg-[#9a360b] text-white py-2 px-4 sm:py-3 sm:px-6 rounded-lg font-medium shadow-md flex items-center justify-center flex-1 text-sm sm:text-base"
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
              src={GreenChiliCashewImage}
              alt="Zoomed GreenChili Cashews"
              className="max-h-full max-w-full object-contain"
              onClick={() => setIsImageZoomed(true)}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GreenChiliDetails;
