import React from "react";
import { motion } from "framer-motion";
import W180 from "../wwimages/W180.png";
import W210 from "../wwimages/W210.png";
import W240 from "../wwimages/W240.png";
import W320 from "../wwimages/W320.png";
import W450 from "../wwimages/W450.png";
import { Link } from "react-router-dom";

const cashewVarieties = [
  { id: 1, name: "Whole White-180", image: W180, grade: "Premium" },
  { id: 2, name: "Whole White-210", image: W210, grade: "Premium" },
  { id: 3, name: "Whole White-240", image: W240, grade: "Standard" },
  { id: 4, name: "Whole White-320", image: W320, grade: "Standard" },
  { id: 5, name: "Whole White-450", image: W450, grade: "Economy" },
];

const Ww = () => {
  return (
    <section className="py-12 bg-[#FAF9F6]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#2E8B57] mb-8 text-center">
          Our Cashew Varieties
        </h2>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex space-x-10 py-4"
            animate={{
              x: ["0%", "-100%"],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...cashewVarieties, ...cashewVarieties].map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex-shrink-0 w-64 bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-[#C1440E]">
                    {item.name}
                  </h3>
                  <p className="text-gray-600">Grade: {item.grade}</p>
                  <Link
                    to={`/products/${item.id}`}
                    className="mt-3 bg-[#2E8B57] hover:bg-[#C1440E] text-white px-4 py-2 rounded-full text-sm font-medium transition duration-300 block text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Gradient overlays for better UX */}
        </div>
      </div>
    </section>
  );
};

export default Ww;
