import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaCheck } from "react-icons/fa";
import W180 from "../wwimages/W180.png";

const ProductDetail = () => {
  const { productId } = useParams();

console.log("ProductDetail rendering", productId);
  // In a real app, you'd fetch this data based on productId
  const products = {
    id: "W180",
    name: "Whole White W180 Cashews",
    image: W180,
    description: "Premium Large-Sized Cashew Nuts",
    details: [
      "Extra-Large Size (180 nuts per pound)",
      "Rich & Buttery Taste",
      "100% Natural & Unroasted",
      "Perfectly Whole",
      "Nutrient-Dense",
    ],
    uses: [
      "Gourmet Cooking",
      "Healthy Snacking",
      "Premium Gifting",
      "Baking & Desserts",
      "Homemade Cashew Butter",
    ],
  };

  
  const product = products[productId];

  if (!product) {
    return <div>Product not found</div>;

  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#FAF9F6] to-gray-100 py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Breadcrumb Navigation */}
          <motion.div
            className="text-xs sm:text-sm text-[#2E8B57] mb-6 sm:mb-8 flex flex-wrap gap-1 sm:gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <a href="/" className="hover:text-[#C1440E] transition-colors font-medium">
              Home
            </a>
            <span className="text-gray-400">/</span>
            <a href="/products" className="hover:text-[#C1440E] transition-colors font-medium">
              Products
            </a>
            <span className="text-gray-400">/</span>
            <span className="text-[#C1440E] font-semibold">{product.name}</span>
          </motion.div>

          {/* Product Main Section */}
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-16">
            {/* Product Image */}
            <motion.div
              className="w-full lg:w-1/2 bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, scale: 0.9, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-auto rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              />
            </motion.div>

            {/* Product Info */}
            <motion.div
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2E8B57] mb-3 sm:mb-4 leading-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {product.name}
              </motion.h1>
              <motion.h2
                className="text-lg sm:text-xl text-[#C1440E] mb-6 sm:mb-8 font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                {product.description}
              </motion.h2>

              {/* Why Choose Section */}
              <motion.div
                className="mb-8 sm:mb-10 bg-gradient-to-r from-green-50 to-transparent p-6 sm:p-8 rounded-xl"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-[#2E8B57] mb-4 sm:mb-6 flex items-center gap-2">
                  <FaCheck className="text-green-600" /> Why Choose {product.id} Cashews?
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  {product.details.map((detail, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    >
                      <span className="text-[#2E8B57] font-bold text-lg flex-shrink-0">✓</span>
                      <span className="text-gray-700 font-medium">{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Ideal Uses Section */}
              <motion.div
                className="mb-8 sm:mb-10 bg-gradient-to-r from-orange-50 to-transparent p-6 sm:p-8 rounded-xl"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-[#C1440E] mb-4 sm:mb-6">
                  🍽️ Ideal Uses
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  {product.uses.map((use, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    >
                      <span className="text-[#C1440E] font-bold text-lg flex-shrink-0">★</span>
                      <span className="text-gray-700 font-medium">{use}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(46, 139, 87, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-[#2E8B57] to-[#1a6b3a] hover:shadow-lg text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 shadow-lg flex items-center justify-center gap-2 text-base"
                >
                  Order Now
                  <FaArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(46, 139, 87, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 border-2 border-[#2E8B57] text-[#2E8B57] hover:bg-[#2E8B57]/5 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 text-base"
                >
                  Request Sample
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductDetail;
