import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { productApi } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; 
import { 
  FaShoppingCart, 
  FaBolt, 
  FaChevronLeft, 
  FaChevronRight,
  FaHeart,
  FaShare,
  FaStar,
  FaTruck,
  FaShieldAlt,
  FaUndo
} from "react-icons/fa";

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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const { isAuthenticated } = useAuth();

  // Get all product images
  const productImages = [
    product?.image_url,
    product?.image_url1,
    product?.image_url2,
    product?.image_url3,
  ].filter(img => img);

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

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/checkout",
          directBuyItem: cartItem,
        },
      });
      return;
    }

    addToCart(cartItem);
    navigate("/checkout", { state: { directBuyItem: cartItem } });
  };

  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 px-4"
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
      {/* Success Message Toast - Mobile Optimized */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-4 right-4 sm:left-auto sm:right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm sm:text-base"
          >
            <span className="text-lg">✓</span>
            <span>Item added to cart successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size Error Message - Mobile Optimized */}
      <AnimatePresence>
        {showSizeError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-4 right-4 sm:left-auto sm:right-4 z-50 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm sm:text-base"
          >
            <span className="text-lg">⚠️</span>
            <span>Please select a size!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button - Mobile Optimized */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-100 lg:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#2E8B57] transition-colors"
        >
          <FaChevronLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto bg-white px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 lg:pt-14 pb-6"
      >
          <div className="w-full mb-4 px-1">
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-gray-600 hover:text-[#2E8B57] transition-colors text-sm sm:text-base"
    >
      <FaChevronLeft className="w-4 h-4" />
      Back
    </button>
  </div>
        {/* Main Product Section */}
      <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-16">
          {/* LEFT SIDE - Image Gallery - Mobile Optimized */}
          <div className="w-full lg:w-1/2">
            <motion.div
              className="relative overflow-hidden rounded-lg bg-gray-50"
              initial={{ scale: 0.9, x: -20, opacity: 0 }}
              animate={{ scale: 1, x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Main Image */}
              <div 
                className="cursor-zoom-in relative"
                onClick={() => setIsImageZoomed(true)}
              >
                <img
                  src={productImages[activeImageIndex] || product.image_url || product.image_url1 || "https://via.placeholder.com/600"}
                  alt={product.name}
                  className="w-full h-auto max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] object-contain p-4"
                />
              </div>

              {/* Thumbnail Navigation - Mobile Optimized */}
              {productImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-4 pb-4 overflow-x-auto">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx
                          ? "border-[#2E8B57] shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT SIDE - Product Details - Mobile Optimized */}
     <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="lg:sticky lg:top-24"
            >
              {/* Product Name - Mobile Optimized */}
           <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 leading-snug mt-2 lg:mt-0">
                {product.name}
              </h1>

              {/* Rating Section */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(120 reviews)</span>
              </div>

              {/* Price Section - Mobile Optimized */}
              <motion.div
                className="mb-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-2xl sm:text-3xl text-[#2E8B57] font-bold">
                    ₹{currentPrice}
                  </span>
                  {currentMRP && (
                    <span className="text-gray-500 line-through text-base sm:text-lg">
                      ₹{currentMRP}
                    </span>
                  )}
                  {currentMRP && currentMRP > currentPrice && (
                    <span className="text-[#2E8B57] font-semibold text-sm bg-green-50 px-2 py-1 rounded">
                      Save ₹{currentMRP - currentPrice}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Inclusive of all taxes
                </div>
              </motion.div>

              {/* Delivery Info - Mobile Optimized */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FaTruck className="w-4 h-4 text-[#2E8B57]" />
                  <div>
                    <p className="text-xs font-semibold">Free Delivery</p>
                    <p className="text-xs text-gray-500">On orders ₹500+</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="w-4 h-4 text-[#2E8B57]" />
                  <div>
                    <p className="text-xs font-semibold">Secure Payment</p>
                    <p className="text-xs text-gray-500">100% protected</p>
                  </div>
                </div>
              </div>

              {/* Size Selection - Mobile Optimized */}
              {product.sizes && product.sizes.length > 0 && (
                <motion.div
                  className="mb-6"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="font-semibold text-gray-800 text-base mb-3">
                    Select Size:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedSize?.size === size.size
                            ? "border-[#2E8B57] bg-[#2E8B57]/10 text-[#2E8B57]"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        <span className="font-medium">{size.size}</span>
                        <span className="text-xs ml-1">₹{size.price}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quantity Selector - Mobile Optimized */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 text-base mb-3">
                  Quantity:
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-full">
                    <button
                      className="w-10 h-10 flex items-center justify-center text-xl font-bold text-[#2E8B57] hover:bg-gray-100 disabled:opacity-50 rounded-l-full"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button
                      className="w-10 h-10 flex items-center justify-center text-xl font-bold text-[#2E8B57] hover:bg-gray-100 rounded-r-full"
                      onClick={() => setQuantity((q) => q + 1)}
                      disabled={product.stock && quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <div className="flex-1 text-right">
                    <span className="text-gray-700 font-semibold">Total: </span>
                    <span className="text-xl font-bold text-[#2E8B57]">₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock && product.stock > 0 ? (
                  <span className="text-green-600 font-semibold text-sm bg-green-50 px-3 py-1 rounded-full">
                    ✓ In Stock
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold text-sm bg-red-50 px-3 py-1 rounded-full">
                    ✗ Out of Stock
                  </span>
                )}
              </div>

              {/* Description - Mobile Optimized */}
              <motion.div
                className="mb-6"
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

              {/* Action Buttons - Mobile Optimized */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white py-4 border-t border-gray-100 lg:relative lg:border-0 lg:py-0"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-[#2E8B57] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1a6b3a] transition-colors text-base flex items-center justify-center gap-2"
                  onClick={handleAddToCart}
                  disabled={!product.stock || product.stock <= 0}
                >
                  <FaShoppingCart className="w-4 h-4" />
                  {product.stock && product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-[#C1440E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#9a360b] transition-colors text-base flex items-center justify-center gap-2"
                  onClick={handleBuyNow}
                  disabled={!product.stock || product.stock <= 0}
                >
                  <FaBolt className="w-4 h-4" />
                  Buy Now
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Related Products - Mobile Optimized */}
        {relatedProducts.length > 0 && (
          <motion.div
            className="mt-12 pt-8 border-t border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.slice(0, 4).map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-lg shadow p-3 flex flex-col items-center cursor-pointer border border-gray-100 hover:border-[#2E8B57] hover:shadow-lg transition-all"
                  onClick={() =>
                    navigate("/productdetails", { state: { product: item } })
                  }
                >
                  <img
                    src={item.image_url || item.image_url1}
                    alt={item.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain mb-2 rounded"
                  />
                  <div className="font-semibold text-xs sm:text-sm text-center mb-2 line-clamp-2">
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Image Zoom Modal - Mobile Optimized */}
      <AnimatePresence>
        {isImageZoomed && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
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
              className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
            >
              <FaChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={productImages[activeImageIndex] || product.image_url}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductDetails;