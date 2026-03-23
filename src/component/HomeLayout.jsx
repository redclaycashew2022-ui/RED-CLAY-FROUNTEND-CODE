import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { productApi } from "../services/api";
import {
  FaLeaf,
  FaAppleAlt,
  FaPepperHot,
  FaSeedling,
  FaSun,
  FaWater,
} from "react-icons/fa";

// Top products data with icons and navigation paths
const topProducts = [
  {
    name: "Cashew Nuts (Mundhiri)",
    icon: FaLeaf,
    category: "nuts",
    path: "/products?category=cashew",
  },
  {
    name: "Almonds (Badam)",
    icon: FaAppleAlt,
    category: "nuts",
    path: "/products?category=almonds",
  },
  {
    name: "Pistachios (Pista)",
    icon: FaPepperHot,
    category: "nuts",
    path: "/products?category=pistachios",
  },
  {
    name: "Dates",
    icon: FaAppleAlt,
    category: "fruits",
    path: "/products?category=dates",
  },
  {
    name: "Athipazham (Fig / Anjeer)",
    icon: FaLeaf,
    category: "fruits",
    path: "/products?category=fig",
  },
  {
    name: "Black Raisins",
    icon: FaAppleAlt,
    category: "fruits",
    path: "/products?category=raisins",
  },
  {
    name: "Golden Raisins (Seedless Raisins)",
    icon: FaAppleAlt,
    category: "fruits",
    path: "/products?category=raisins",
  },
  {
    name: "Pumpkin Seeds",
    icon: FaSeedling,
    category: "seeds",
    path: "/products?category=seeds",
  },
  {
    name: "Sunflower Seeds",
    icon: FaSun,
    category: "seeds",
    path: "/products?category=seeds",
  },
  {
    name: "Chia Seeds",
    icon: FaSeedling,
    category: "seeds",
    path: "/products?category=seeds",
  },
  {
    name: "Watermelon Seeds",
    icon: FaWater,
    category: "seeds",
    path: "/products?category=seeds",
  },
  {
    name: "Basil Seeds (Sabja)",
    icon: FaLeaf,
    category: "seeds",
    path: "/products?category=seeds",
  },
  {
    name: "Cucumber Seeds",
    icon: FaSeedling,
    category: "seeds",
    path: "/products?category=seeds",
  },
];

const HomeLayout = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Handle scroll to show/hide the right sidebar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > 100);

      // Show sidebar after scrolling down 300px
      if (scrollPosition > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle product click: fetch by subcategory, then navigate
  const handleProductClick = async (product) => {
    // Try to extract subcategory search term from product.name or path
    // E.g., for "Cashew Nuts (Mundhiri)" or path /products?category=cashew, use "cashew"
    let subcategory = "";
    if (product.path && product.path.includes("category=")) {
      subcategory = product.path.split("category=")[1].split("&")[0];
    } else {
      // fallback: use first word of name
      subcategory = product.name.split(" ")[0];
    }
    // Fetch products by subcategory
    try {
      const products = await productApi.getBySubcategory(subcategory);
      // Navigate to /products and pass products as state
      navigate("/products", { state: { products, subcategory } });
    } catch (err) {
      alert("Failed to load products for this subcategory");
    }
  };

  // Animation variants for top products
  const topProductVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.05,
      backgroundColor: "rgba(46, 139, 87, 0.1)",
      transition: { duration: 0.2 },
    },
  };

  // Right sidebar animation variants
  const sidebarVariants = {
    hidden: {
      opacity: 0,
      x: 50,
      transition: {
        duration: 0.3,
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full">
      {/* Top Products Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-white py-8 px-4 "
      >
        <div className="w-full mx-auto px-2">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-[#2E8B57] text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Premium Dry Fruits & Seeds
          </motion.h2>

          {/* Desktop horizontal scroll */}
          <div className="hidden md:flex overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex space-x-6 min-w-max px-4">
              {topProducts.map((product, index) => {
                const IconComponent = product.icon;
                return (
                  <motion.div
                    key={product.name}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    variants={topProductVariants}
                    onClick={() => handleProductClick(product)}
                    className="group flex flex-col items-center p-4 rounded-xl cursor-pointer border-2 border-[#2E8B57]/20 min-w-[140px] hover:bg-gradient-to-r hover:from-[#2E8B57] hover:to-[#C1440E] hover:text-white hover:border-transparent transition-all duration-300 hover:shadow-md"
                  >
                    <div className="bg-[#2E8B57] bg-opacity-10 p-3 rounded-full mb-3 group-hover:bg-opacity-30 transition-colors">
                      <IconComponent className="text-2xl text-[#2E8B57] group-hover:text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-800 group-hover:text-white text-center leading-tight">
                      {product.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile grid */}
          <div className="grid grid-cols-3 gap-4 md:hidden px-2">
            {topProducts.slice(0, 9).map((product, index) => {
              const IconComponent = product.icon;
              return (
                <motion.div
                  key={product.name}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  variants={topProductVariants}
                  onClick={() => handleProductClick(product)}
                  className="flex flex-col items-center p-3 rounded-lg cursor-pointer border border-[#2E8B57]/20 hover:border-[#2E8B57]/40 transition-colors hover:shadow-md"
                >
                  <div className="bg-[#2E8B57] bg-opacity-10 p-2 rounded-full mb-2">
                    <IconComponent className="text-xl text-[#2E8B57]" />
                  </div>
                  <span className="text-xs font-medium text-gray-800 text-center leading-tight">
                    {product.name.split("(")[0].trim()}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* View All Button for Mobile */}
          <motion.div
            className="md:hidden text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/products")}
              className="bg-[#2E8B57] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#1a6b3a] transition-colors shadow-md"
            >
              View All Products
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeLayout;
