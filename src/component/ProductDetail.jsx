import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
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
    <section className="py-16 bg-[#FAF9F6]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Breadcrumb Navigation */}
          <div className="text-sm text-[#2E8B57] mb-4">
            <a href="/" className="hover:text-[#C1440E]">
              Home
            </a>{" "}
            &gt;
            <a href="/products" className="hover:text-[#C1440E]">
              {" "}
              Products
            </a>{" "}
            &gt;
            <span className="text-[#C1440E]"> {product.name}</span>
          </div>

          {/* Product Main Section */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Image */}
            <div className="w-full md:w-1/2 bg-white p-6 rounded-xl shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl font-bold text-[#2E8B57] mb-2">
                {product.name}
              </h1>
              <h2 className="text-xl text-[#C1440E] mb-6">
                {product.description}
              </h2>

              {/* Why Choose Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-[#2E8B57] mb-4">
                  ✅ Why Choose {product.id} Cashews?
                </h3>
                <ul className="space-y-2">
                  {product.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#2E8B57] mr-2">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ideal Uses Section */}
              <div>
                <h3 className="text-2xl font-semibold text-[#2E8B57] mb-4">
                  🍽️ Ideal Uses of {product.id} Cashews
                </h3>
                <ul className="space-y-2">
                  {product.uses.map((use, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#C1440E] mr-2">•</span>
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="bg-[#2E8B57] hover:bg-[#1a5c37] text-white px-6 py-3 rounded-full font-medium transition duration-300 shadow-md">
                  Order Now
                </button>
                <button className="border-2 border-[#2E8B57] text-[#2E8B57] hover:bg-[#2E8B57]/10 px-6 py-3 rounded-full font-medium transition duration-300">
                  Request Sample
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductDetail;
