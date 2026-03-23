import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { productApi } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; 

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = location.state?.product;
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(product?.price || 0);
  const [currentMRP, setCurrentMRP] = useState(product?.mrp_price || null);
  const [totalPrice, setTotalPrice] = useState(product?.price || 0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (product?.subcategory) {
      productApi.getBySubcategory(product.subcategory).then((products) => {
        if (Array.isArray(products)) {
          setRelatedProducts(products.filter((p) => p.id !== product.id));
        }
      });
    }
  }, [product]);

  // Update price when size changes
  useEffect(() => {
    if (selectedSize) {
      setCurrentPrice(selectedSize.price);
      setCurrentMRP(selectedSize.mrp_price);
    } else {
      setCurrentPrice(product?.price || 0);
      setCurrentMRP(product?.mrp_price || null);
    }
  }, [selectedSize, product]);

  // Calculate total price when quantity or current price changes
  useEffect(() => {
    const price = parseFloat(currentPrice);
    setTotalPrice(price * quantity);
  }, [quantity, currentPrice]);

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (product?.sizes && product.sizes.length > 0 && !selectedSize) {
      setShowSizeError(true);
      setTimeout(() => setShowSizeError(false), 3000);
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      image: product.image_url || product.image_url1 || product.image,
      price: currentPrice,
      totalPrice: totalPrice,
      size: selectedSize?.size || product.size || "250g",
      quantity: quantity,
      mrp_price: currentMRP,
      grade: product.grade
    };
    
    addToCart(cartItem);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Handle Buy Now
const handleBuyNow = () => {
  if (product?.sizes && product.sizes.length > 0 && !selectedSize) {
    setShowSizeError(true);
    setTimeout(() => setShowSizeError(false), 3000);
    return;
  }

  const cartItem = {
    id: product.id,
    name: product.name,
    image: product.image_url || product.image_url1 || product.image,
    price: currentPrice,
    size: selectedSize?.size || "250g",
    quantity: quantity,
    totalPrice: totalPrice,
  };

  // 👉 LOGIN CHECK
  if (!isAuthenticated) {
    navigate("/login", {
      state: {
        from: "/checkout",          // where to go after login
        directBuyItem: cartItem,    // pass product data
      },
    });
    return;
  }

  // ✅ if already logged in
  addToCart(cartItem);
  navigate("/checkout", { state: { directBuyItem: cartItem } });
};
  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <h2 className="text-xl font-bold text-red-600">
          No product data found.
        </h2>
        <button
          className="mt-4 px-4 py-2 bg-[#2E8B57] text-white rounded hover:bg-[#1a6b3a] transition-colors"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </motion.div>
    );
  }

  return (
    <>
      {/* Success Message Toast */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <span className="text-xl">✓</span>
            <span>Item added to cart successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size Error Message */}
      <AnimatePresence>
        {showSizeError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <span className="text-xl">⚠️</span>
            <span>Please select a size before adding to cart!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-1xl mx-auto bg-white sm:p-12 lg:p-12 mt-1 sm:mt-8"
      >
        {/* Main Product Section */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* LEFT SIDE - Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start items-center">
            <motion.div
              className="relative overflow-hidden rounded-lg w-full max-w-lg"
              initial={{ scale: 0.9, x: -20, opacity: 0 }}
              animate={{ scale: 1, x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <img
                src={
                  product.image_url ||
                  product.image_url1 ||
                  "https://via.placeholder.com/600"
                }
                alt={product.name}
                className="w-full h-auto max-h-[500px] object-contain bg-gray-50 p-4 rounded-xl"
              />
            </motion.div>
          </div>

          {/* RIGHT SIDE - Product Details */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="sticky top-6"
            >
              {/* Product Name */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 lg:mb-4 block">
                {product.name}
              </h1>

              {/* Price Section */}
              <motion.div
                className="mb-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-2xl lg:text-3xl text-[#2E8B57] font-bold">
                    ₹{currentPrice}
                  </span>
                  {currentMRP && (
                    <span className="ml-2 text-gray-500 line-through text-lg">
                      MRP ₹{currentMRP}
                    </span>
                  )}
                  {product.pt && (
                    <span className="ml-2 text-green-600 font-semibold text-base bg-green-50 px-2 py-1 rounded">
                      PT: {product.pt}
                    </span>
                  )}
                  {currentMRP && currentMRP > currentPrice && (
                    <span className="ml-2 text-[#2E8B57] font-semibold text-base">
                      Save ₹{currentMRP - currentPrice}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  [MRP is Inclusive of all taxes]
                </div>

                <div className="mt-3 space-y-2">
                  <div className="my-8"></div>
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Country of origin:</span> India
                  </div>
                  <div className="my-8"></div>
                  <div className="text-sm">
                    {product.stock && product.stock > 0 ? (
                      <span className="text-gray-800 font-semibold">
                        Stock is available
                      </span>
                    ) : (
                      <span className="text-red-500 font-semibold">
                        Out of stock
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>

              <div className="my-8"></div>

              {/* Quantity Selector with Total Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="font-semibold text-gray-800 text-base">
                  Quantity:
                </span>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-xl font-bold text-[#2E8B57] hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-xl font-bold text-[#2E8B57] hover:bg-gray-100"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  disabled={product.stock && quantity >= product.stock}
                >
                  +
                </button>
                <span className="ml-2 text-gray-700 font-semibold">
                  Total: ₹{totalPrice}
                </span>
              </div>

              <div className="my-8"></div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <motion.div
                  className="mb-6"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="font-semibold text-gray-800 text-base mb-3">
                    Size:
                  </h3>
                  <div className="space-y-2">
                    {product.sizes.map((size, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-0 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id={`size-${idx}`}
                            name="size"
                            checked={selectedSize?.size === size.size}
                            onChange={() => setSelectedSize(size)}
                            className="h-4 w-4 text-[#2E8B57] border-gray-300 focus:ring-[#2E8B57]"
                          />
                          <label
                            htmlFor={`size-${idx}`}
                            className="ml-2 cursor-pointer"
                          >
                            <div className="flex items-center">
                              <span
                                className={`font-medium ${
                                  selectedSize?.size === size.size
                                    ? "text-[#2E8B57]"
                                    : "text-gray-800"
                                }`}
                              >
                                {size.size}g
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="my-8"></div>

              {/* Description */}
              <motion.div
                className="mb-5"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-semibold text-gray-800 text-base mb-2">
                  Description:
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description || "No description available."}
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 mt-6"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 bg-[#2E8B57] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1a6b3a] transition-colors text-base"
                  onClick={handleAddToCart}
                  disabled={!product.stock || product.stock <= 0}
                >
                  {product.stock && product.stock > 0
                    ? `Add to Cart `
                    : "Out of Stock"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 bg-[#C1440E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#9a360b] transition-colors text-base"
                  onClick={handleBuyNow}
                  disabled={!product.stock || product.stock <= 0}
                >
                  Buy Now 
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            className="mt-12 pt-11"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">
              You may also like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-lg shadow p-4 flex flex-col items-center cursor-pointer border hover:border-[#2E8B57] hover:shadow-lg transition-all"
                  onClick={() =>
                    navigate("/productdetails", { state: { product: item } })
                  }
                >
                  <img
                    src={item.image_url || item.image_url1}
                    alt={item.name}
                    className="w-32 h-32 object-contain mb-3 rounded"
                  />
                  <div className="font-semibold text-sm text-center mb-2 line-clamp-2 block">
                    {item.name}
                  </div>
                  <div className="text-[#C1440E] font-bold text-sm mb-1">
                    ₹{item.sizes?.[0]?.price || item.price}
                  </div>
                  {item.sizes?.[0]?.mrp_price && (
                    <div className="text-xs text-gray-500 line-through">
                      MRP ₹{item.sizes[0].mrp_price}
                    </div>
                  )}
                  {item.pt && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      PT: {item.pt}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default ProductDetails;