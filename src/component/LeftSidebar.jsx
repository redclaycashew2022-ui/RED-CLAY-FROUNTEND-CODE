import React, { useState, useEffect, useRef } from "react";
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

const topProducts = [
  {
    name: "Cashew Nuts (Mundhiri)",
    icon: FaLeaf,
    subcategory: "cashew",
    path: "/products?category=cashew",
  },
  {
    name: "Almonds (Badam)",
    icon: FaAppleAlt,
    subcategory: "almonds",
    path: "/products?category=almonds",
  },
  {
    name: "Pistachios (Pista)",
    icon: FaPepperHot,
    subcategory: "pistachios",
    path: "/products?category=pistachios",
  },
  {
    name: "Dates",
    icon: FaAppleAlt,
    subcategory: "dates",
    path: "/products?category=dates",
  },
  {
    name: "Athipazham (Fig / Anjeer)",
    icon: FaLeaf,
    subcategory: "fig",
    path: "/products?category=fig",
  },
  {
    name: "Black Raisins",
    icon: FaAppleAlt,
    subcategory: "black_raisins",
    path: "/products?category=raisins",
  },
  {
    name: "Golden Raisins (Seedless Raisins)",
    icon: FaAppleAlt,
    subcategory: "golden_raisins",
    path: "/products?category=raisins",
  },
  {
    name: "Pumpkin Seeds",
    icon: FaSeedling,
    subcategory: "pumpkin_seeds",
    path: "/products?category=seeds",
  },
  {
    name: "Sunflower Seeds",
    icon: FaSun,
    subcategory: "sunflower_seeds",
    path: "/products?category=seeds",
  },
  {
    name: "Chia Seeds",
    icon: FaSeedling,
    subcategory: "chia_seeds",
    path: "/products?category=seeds",
  },
  {
    name: "Watermelon Seeds",
    icon: FaWater,
    subcategory: "watermelon_seeds",
    path: "/products?category=seeds",
  },
  {
    name: "Basil Seeds (Sabja)",
    icon: FaLeaf,
    subcategory: "basil_seeds",
    path: "/products?category=seeds",
  },
  {
    name: "Cucumber Seeds",
    icon: FaSeedling,
    subcategory: "cucumber_seeds",
    path: "/products?category=seeds",
  },
];

const LeftSidebar = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const scrollContainerRef = useRef(null);
  const iconRefs = useRef([]);

  useEffect(() => {
    // Check initial scroll position
    const initialScrollPosition = window.scrollY;
    setHasScrolled(initialScrollPosition > 100);
    setIsVisible(initialScrollPosition > 200);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > 100);
      setIsVisible(scrollPosition > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProductClick = async (product) => {
    // Use the subcategory value for the payload
    const payload = { value: "subcategory", data: product.subcategory };
    try {
      const result = await productApi.getBySubcategory(product.subcategory);
      navigate("/products", {
        state: { products: result, subcategory: product.subcategory },
      });
    } catch (err) {
      console.error("Failed to fetch products by subcategory:", err);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    const handleWheel = (e) => {
      e.preventDefault();
      scrollContainer.scrollTop += e.deltaY;
    };
    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener("wheel", handleWheel);
  }, []);

  const sidebarVariants = {
    hidden: { opacity: 0, x: -50, transition: { duration: 0.3 } },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={sidebarVariants}
      className="fixed left-2 top-1/2 transform -translate-y-1/2 z-50 overflow-visible w-14 sm:w-16 md:w-20 lg:w-auto"
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      {/* Outer wrapper allows tooltips to escape */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 py-4 overflow-visible relative w-full">
        {/* Inner scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex flex-col items-center space-y-3 px-1 sm:px-2 overflow-y-auto touch-pan-y"
          style={{
            maxHeight: "65vh",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Hide scrollbar for WebKit */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {topProducts.map((product, index) => {
            const IconComponent = product.icon;
            return (
              <motion.div
                key={product.name}
                ref={(el) => (iconRefs.current[index] = el)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleProductClick(product)}
                onMouseEnter={() => setHoveredProduct({ ...product, index })}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group relative flex flex-col items-center p-1 sm:p-2 rounded-xl cursor-pointer hover:bg-[#2E8B57] hover:bg-opacity-10 transition-colors"
              >
                <div className="bg-[#2E8B57] bg-opacity-10 p-2 rounded-full group-hover:bg-opacity-20 transition-colors">
                  <IconComponent className="text-lg sm:text-xl text-[#2E8B57] group-hover:text-[#1a6b3a]" />
                </div>

                {/* Click indicator */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#C1440E] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </motion.div>
            );
          })}
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="text-center mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1 inline-block">
            Scroll
          </div>
        </motion.div>
      </div>

      {/* External Tooltip - positioned outside the scroll container */}
      {hoveredProduct && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute left-full ml-3 pointer-events-none z-[9999] whitespace-nowrap overflow-visible"
          style={{
            top:
              iconRefs.current[hoveredProduct.index]?.offsetTop +
              scrollContainerRef.current.offsetTop -
              scrollContainerRef.current.scrollTop +
              10,
          }}
        >
          <div className="bg-gradient-to-r from-[#2E8B57] to-[#C1440E] text-white text-xs py-1.5 px-3 rounded-lg shadow-xl font-medium">
            {hoveredProduct.name}
          </div>

          <div
            className="absolute top-1/2 right-full -mt-1"
            style={{
              borderWidth: "6px",
              borderStyle: "solid",
              borderColor: "transparent",
              borderRightColor: "rgba(46,139,87,1)",
            }}
          ></div>
        </motion.div>
      )}

      {/* Move Top button - positioned closer to the sidebar */}
      {hasScrolled && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-2 w-full bg-[#2E8B57] text-white p-2 rounded-xl hover:bg-[#1a6b3a] transition-colors shadow-lg border border-[#1a6b3a]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-xs font-medium flex items-center justify-center">
            <span>↑</span>
            <span className="ml-1">Top</span>
          </div>
        </motion.button>
      )}
    </motion.div>
  );
};

export default LeftSidebar;
