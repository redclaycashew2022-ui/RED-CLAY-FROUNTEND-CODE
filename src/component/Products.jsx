import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaStar, FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { productApi } from "../services/api";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [quantities, setQuantities] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [zoomedImage, setZoomedImage] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const location = useLocation();
  const [products, setProducts] = useState([]);
  // Main categories (should match backend/categoryData.js)
  const mainCategories = [
    { label: "Seeds", value: "Seeds" },
    { label: "Nuts", value: "Nuts" },
    { label: "Fruits", value: "Fruits" },
  ];
  // Subcategories map (should match backend/categoryData.js)
  const subCategoriesMap = {  
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
  };
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const subcategoryName =
    location.state && location.state.subcategory
      ? location.state.subcategory
      : null;

  useEffect(() => {
    if (location.state && location.state.products) {
      setProducts(location.state.products);
    } else {
      productApi.getAll().then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      });
    }
  }, [location.state]);

  // Fetch products by main category (all subcategories under it)
  const handleMainCategoryClick = async (mainCat) => {
    setSelectedMainCategory(mainCat.value);

    // Get all subcategories for this main category
    const subcats = subCategoriesMap[mainCat.value] || [];
    // Fetch products for each subcategory and merge
    let allProducts = [];
    for (const subcat of subcats) {
      try {
        const prods = await productApi.getBySubcategory(subcat.value);
        if (Array.isArray(prods)) {
          allProducts = allProducts.concat(prods);
        }
      } catch (e) {
        // Ignore errors for individual subcategory fetches
      }
    }
    setProducts(allProducts);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleImageClick = (imageSrc) => setZoomedImage(imageSrc);
  const closeZoomedImage = () => setZoomedImage(null);

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#efefee] py-24 md:py-24 px-4 sm:px-6 lg:px-8 relative"
    >
      {/* Main Categories Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 lg:mb-12"
      >
        {mainCategories.map((cat, idx) => (
          <motion.button
            key={cat.value}
            onClick={() => handleMainCategoryClick(cat)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all border-2 border-[#2E8B57] duration-300 ${
              selectedMainCategory === cat.value
                ? "bg-gradient-to-r from-[#2E8B57] to-[#1a6b3a] text-white shadow-lg"
                : "bg-white text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white hover:shadow-md"
            }`}
          >
            {cat.label}
          </motion.button>
        ))}
      </motion.div>
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          >
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={closeZoomedImage}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              <FaTimes />
            </motion.button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="max-w-4xl w-full h-full flex items-center justify-center"
            >
              <img
                src={zoomedImage}
                alt="Zoomed Product"
                className="max-h-full max-w-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {subcategoryName && !location.state?.products && (
          <div className="text-center mb-4">
            <span className="inline-block bg-[#2E8B57] text-white px-4 py-2 rounded-full text-lg font-semibold">
              Showing results for: {subcategoryName}
            </span>
          </div>
        )}
        {!location.state?.products && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 md:mb-12"
          >
            <h1 className="text-2xl md:text-4xl font-bold text-[#2E8B57] mb-2 md:mb-4">
              Our Premium Dry Fruits Collection
            </h1>
            <p className="text-sm md:text-lg text-gray-600 max-w-3xl mx-auto">
              Handpicked from the mineral-rich soils of Panruti, each variety
              offers unique flavors and textures
            </p>
          </motion.div>
        )}

        {!location.state?.products && (
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 lg:mb-12 overflow-x-auto py-2 px-2"
          >
         
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg md:rounded-xl overflow-hidden hover:shadow-2xl transition-all flex flex-col border border-[#2E8B57]/20 group"
              style={{
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() =>
                navigate("/productdetails", { state: { product } })
              }
            >
              <motion.div
                className="relative h-32 md:h-40 flex items-center justify-center p-2 md:p-4 cursor-zoom-in bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick(
                    product.image_url ||
                      product.image_url1 ||
                      product.image ||
                      "https://via.placeholder.com/300"
                  );
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  src={
                    product.image_url ||
                    product.image_url1 ||
                    product.image ||
                    "https://via.placeholder.com/300"
                  }
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  whileHover={{ opacity: 1 }}
                >
                  <motion.span
                    className="text-white text-2xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔍
                  </motion.span>
                </motion.div>
              </motion.div>

              <div className="p-2 md:p-3 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xs md:text-sm font-bold text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <motion.div
                    className="flex items-center"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaStar className="text-yellow-400 text-xs md:text-sm" />
                    <span className="text-xs md:text-sm ml-0.5 text-gray-700">
                      {product.rating
                        ? product.rating
                        : (Math.random() * 1.5 + 3.5).toFixed(1)}
                    </span>
                  </motion.div>
                </div>

                <p className="text-gray-500 text-xs mb-1 md:mb-2 truncate">
                  {product.category}
                </p>

                <div className="mb-1 md:mb-2">
                  <span className="text-sm md:text-base font-bold bg-gradient-to-r from-[#2E8B57] to-[#C1440E] bg-clip-text text-transparent">
                    ₹{product.sizes?.[0]?.price || product.price}
                  </span>
                  {product.sizes?.[0]?.mrp_price && (
                    <span className="text-xs text-gray-500 ml-2 line-through">
                      MRP ₹{product.sizes[0].mrp_price}
                    </span>
                  )}
                </div>

                <div className="p-2 md:p-3 border-t border-gray-100 mt-auto">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const size =
                          selectedSizes[product.id] || product.sizes?.[0];
                        const quantity = quantities[product.id] || 1;
                        addToCart({
                          id: product.id,
                          name: product.name,
                          image:
                            product.image_url ||
                            product.image_url1 ||
                            product.image ||
                            "",
                          price: size?.price || product.price,
                          size: size?.size || "",
                          quantity: quantity,
                        });
                      }}
                      className="flex-1 flex items-center justify-center bg-gradient-to-r from-[#2E8B57] to-[#1a6b3a] hover:shadow-lg text-white py-2 px-2 rounded-lg font-medium transition-all text-xs md:text-sm shadow-md"
                    >
                      <FaShoppingCart className="mr-1 md:mr-2" size={12} />
                      <span>Add</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/productdetails", { state: { product } });
                      }}
                      className="flex-1 bg-gradient-to-r from-[#C1440E] to-[#9a360b] hover:shadow-lg text-white py-2 px-2 rounded-lg font-medium transition-all text-xs md:text-sm shadow-md"
                    >
                      <span>Buy</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Products;
