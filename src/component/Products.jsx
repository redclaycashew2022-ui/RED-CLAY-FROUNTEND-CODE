import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaStar, FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { productApi, resolveImageUrl } from "../services/api";
import productVideo from "../images/video1.mp4";
import honeyedNutsImg from "../images/Honeyed nuts.jpg";
import dryImg from "../images/dry.png";
import roastedNutsImg from "../images/Roasted Nuts.jpg";
import nutsChocolateImg from "../images/nutschocultae.jpg";
import mixedContainerImg from "../images/mixedcontainer.jpg";
import ladduImg from "../images/laddu.jpg";
import dryFruitGiftingImg from "../images/DryFruit Gifting.jpg";
import giftHamperImg from "../images/gifthamper.jpg";

const collectionBanners = [
  { id: "honeyed-nuts", name: "Honeyed Nuts", image: honeyedNutsImg },
  { id: "dry", name: "Dry Fruits", image: dryImg },
  { id: "roasted-nuts", name: "Roasted Nuts", image: roastedNutsImg },
  { id: "nuts-chocolate", name: "Nut Chocolates", image: nutsChocolateImg },
  { id: "mixed-container", name: "Mixed Container", image: mixedContainerImg },
  { id: "laddu", name: "Laddu", image: ladduImg },
  { id: "dryfruit-gifting", name: "Dry Fruit Gifting", image: dryFruitGiftingImg },
  { id: "gift-hamper", name: "Gift Hamper", image: giftHamperImg },
];

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
    { label: "Dry Fruits", value: "Dry Fruits" },
 
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
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [loadingBannerId, setLoadingBannerId] = useState(null);
  const subcategoryName =
    location.state && location.state.subcategory
      ? location.state.subcategory
      : null;
  const fromCollection = Boolean(location.state?.fromCollection);
  const fromSearch = Boolean(location.state?.search);
  const fromGallery = Boolean(location.state?.fromGallery);
  const searchTerm = location.state?.search || "";

  // Fetch products for a collection banner (e.g. "Honeyed Nuts", "Laddu")
  const handleBannerClick = async (banner) => {
    setLoadingBannerId(banner.id);
    try {
      const prods = await productApi.getBySubcategory(banner.name);
      setProducts(Array.isArray(prods) ? prods : []);
      setSelectedBannerId(banner.id);
    } catch (e) {
      console.error("Error fetching products for banner:", banner.name, e);
      setProducts([]);
      setSelectedBannerId(banner.id);
    } finally {
      setLoadingBannerId(null);
    }
  };

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

  // Fetch products for a single subcategory (e.g. hovering "Nuts" -> click "Almonds")
  const handleSubCategoryClick = async (mainCat, subcat) => {
    setSelectedMainCategory(mainCat.value);
    setSelectedSubCategory(subcat.value);
    try {
      const prods = await productApi.getBySubcategory(subcat.value);
      setProducts(Array.isArray(prods) ? prods : []);
    } catch (e) {
      setProducts([]);
    }
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
    <>
      {!fromCollection && !fromSearch && !fromGallery && !selectedMainCategory && !selectedSubCategory && !selectedBannerId && (
        <section className="relative w-full h-[280px] sm:h-[380px] md:h-[500px] lg:h-[560px] overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={productVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </section>
      )}

      <motion.div
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-[#FAF9F6] to-[#F0F5F1] pt-8 pb-24 md:pt-10 md:pb-24 px-4 sm:px-6 lg:px-8 relative"
    >
      {/* Search Results Header */}
      {fromSearch && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-[#2E8B57]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h1 className="text-2xl md:text-4xl font-bold text-[#2E8B57]">
                Search Results
              </h1>
            </div>
            <div className="bg-[#E8F5E9] border-l-4 border-[#2E8B57] px-4 py-3 rounded-lg">
              <p className="text-gray-700">
                Showing <span className="font-bold text-[#2E8B57]">{filteredProducts.length}</span> result{filteredProducts.length !== 1 ? 's' : ''} for{' '}
                <span className="font-bold text-[#2E8B57]">"{searchTerm}"</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}

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
        {fromCollection && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className=" mb-1 md:mb-10"
            >
              <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-1 md:gap-6">
                {collectionBanners.map((banner) => (
                  <div
                    key={banner.id}
                    className="group cursor-pointer"
                    onClick={() => handleBannerClick(banner)}
                  >
                    <div
                      className={`relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl border transition-shadow duration-300 bg-white ${
                        selectedBannerId === banner.id
                          ? "border-[#2E8B57] ring-2 ring-[#2E8B57]"
                          : "border-gray-100"
                      }`}
                    >
                      <img
                        src={banner.image}
                        alt={banner.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {loadingBannerId === banner.id && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-center text-[#2C2C2C] text-xs sm:text-sm font-semibold truncate">
                      {banner.name}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-left mb-8 md:mb-12"
            >
              <h2 className="text-1xl md:text-2xl font-bold text-[#2E8B57]">
                Freshly Packed Premium Cashews
              </h2>
            </motion.div>
          </>
        )}

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
         
          </motion.div>
        )}

        {!location.state?.products && (
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-8 overflow-x-auto py- px-1"
          >
         
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 md:gap-5"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg md:rounded-xl overflow-hidden hover:shadow-xl transition-all flex flex-col h-full"
              style={{
                border: "none",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() =>
                navigate("/productdetails", { state: { product } })
              }
            >
              <motion.div
                className="relative h-36 md:h-44 lg:h-48 cursor-zoom-in overflow-hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick(
                    resolveImageUrl(
                      product.image_url || product.image_url1 || product.image
                    ) || "https://via.placeholder.com/300"
                  );
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={
                    resolveImageUrl(
                      product.image_url || product.image_url1 || product.image
                    ) || "https://via.placeholder.com/300"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div className="px-2 pt-1.5 md:px-3 md:pt-2 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xs md:text-sm font-bold text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 text-xs md:text-sm" />
                    <span className="text-xs md:text-sm ml-0.5">
                      {product.rating
                        ? product.rating
                        : (Math.random() * 1.5 + 3.5).toFixed(1)}
                    </span>
                  </div>
                </div>

                <p className="text-gray-500 text-xs mb-1 md:mb-2 truncate">
                  {product.category}
                </p>

                <div className="mb-1 md:mb-2">
                  <span className="text-sm md:text-base font-bold text-[#2E8B57]">
                    ₹{product.sizes?.[0]?.price || product.price}
                  </span>
                  {product.sizes?.[0]?.mrp_price && (
                    <span className="text-xs text-gray-500 ml-2 line-through">
                      MRP ₹{product.sizes[0].mrp_price}
                    </span>
                  )}
                </div>

                <div className="mt-auto pt-2 pb-2 md:pb-3 border-t border-gray-100">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const size =
                          selectedSizes[product.id] || product.sizes?.[0];
                        const quantity = quantities[product.id] || 1;
                        addToCart({
                          id: product.id,
                          name: product.name,
                          image: resolveImageUrl(
                            product.image_url ||
                              product.image_url1 ||
                              product.image
                          ),
                          price: size?.price || product.price,
                          size: size?.size || "",
                          quantity: quantity,
                        });
                      }}
                      className="flex-1 flex items-center justify-center border border-[#2E8B57] bg-white text-[#2E8B57] py-1.5 px-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 text-xs md:text-sm"
                    >
                      <FaShoppingCart className="mr-1 md:mr-2" size={12} />
                      <span>Add</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/productdetails", { state: { product } });
                      }}
                      className="flex-1 border border-[#C1440E] bg-white text-[#C1440E] py-1.5 px-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 text-xs md:text-sm"
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

      {/* Related Products Section for Search Results */}
      {fromSearch && filteredProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 md:mt-20 bg-gradient-to-r from-[#2E8B57]/10 to-[#F0A374]/10 py-12 px-4 rounded-2xl"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2E8B57] mb-8 text-center">
              ✨ You Might Also Like
            </h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5"
            >
              {products.slice(0, 10).map((product, index) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg md:rounded-xl overflow-hidden hover:shadow-xl transition-all flex flex-col h-full"
                  style={{
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={() =>
                    navigate("/productdetails", { state: { product } })
                  }
                >
                  <motion.div
                    className="relative h-36 md:h-44 lg:h-48 cursor-zoom-in overflow-hidden"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick(
                        resolveImageUrl(
                          product.image_url || product.image_url1 || product.image
                        ) || "https://via.placeholder.com/300"
                      );
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={
                        resolveImageUrl(
                          product.image_url || product.image_url1 || product.image
                        ) || "https://via.placeholder.com/300"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  <div className="px-2 pt-1.5 md:px-3 md:pt-2 flex flex-col flex-grow">
                    <h3 className="text-xs md:text-sm font-bold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-xs mb-1 md:mb-2 truncate">
                      {product.category}
                    </p>

                    <div className="mb-1 md:mb-2">
                      <span className="text-sm md:text-base font-bold text-[#2E8B57]">
                        ₹{product.sizes?.[0]?.price || product.price}
                      </span>
                    </div>

                    <div className="mt-auto pt-2 pb-2 md:pb-3 border-t border-gray-100">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const size =
                            selectedSizes[product.id] || product.sizes?.[0];
                          const quantity = quantities[product.id] || 1;
                          addToCart({
                            id: product.id,
                            name: product.name,
                            image: resolveImageUrl(
                              product.image_url ||
                                product.image_url1 ||
                                product.image
                            ),
                            price: size?.price || product.price,
                            size: size?.size || "",
                            quantity: quantity,
                          });
                        }}
                        className="w-full flex items-center justify-center bg-[#2E8B57] hover:bg-[#236B44] text-white py-1.5 px-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 text-xs md:text-sm"
                      >
                        <FaShoppingCart className="mr-1 md:mr-2" size={12} />
                        <span>Add to Cart</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <div className="text-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/products")}
                className="bg-[#2E8B57] hover:bg-[#236B44] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                View All Products
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
    </>
  );
};

export default Products;
