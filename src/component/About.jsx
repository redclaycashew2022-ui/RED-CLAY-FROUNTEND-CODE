import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Import your images
import CashewTreeImg from "../wwimages/About1.png";
import Cashewpepole from "../wwimages/Cashewpepole.png";

import CashewDrayerMachineImg from "../wwimages/CashewDrayerMachine.png";
import CashewCuttingMachineImg from "../wwimages/cashewcuttingmachine.png";
import GradeManual from "../wwimages/GradeManual.png";
import packing from "../wwimages/packing.jpg";
import RightSidebar from "./LeftSidebar";
import LeftSidebar from "./LeftSidebar";

const About = () => {

  const navigate = useNavigate(); // Hook for navigation

  // Function to navigate to Products page
  const goToProducts = () => {
    navigate("/products");
  };

  // Function to navigate to Login page
  const goToLogin = () => {
    navigate("/login");
  };

  const processData = [
    {
      id: "cultivation",
      title: "Cashew Cultivation",
      image: CashewTreeImg,
      description:
        "We begin at the root – with our own cashew trees and orchards, where cashew fruits are cultivated under natural conditions. This farm-direct approach allows us to monitor quality right from the start.",
    },

    {
      id: "cutting",
      title: "Precision Cutting",
      image: CashewCuttingMachineImg,
      description:
        "We use specialized cutting machinery to carefully separate cashew kernels without damage, ensuring whole nuts whenever possible.",
    },

    {
      id: "processing",
      title: "Processing Area",
      image: Cashewpepole,
      description:
        "All harvested cashew fruits are carefully collected and processed in our own dedicated cashew land and facility, maintaining hygiene and quality standards at every step.",
    },

    {
      id: "drying",
      title: "Drying Process",
      image: CashewDrayerMachineImg,
      description:
        "Our advanced drying machines naturally preserve flavor and extend shelf life while maintaining the nutritional value of our cashews.",
    },

    {
      id: "grading",
      title: "Manual Grading",
      image: GradeManual,
      description:
        "Every cashew is hand-graded to ensure correct size, shape, and quality. This balance of modern equipment and traditional care makes our cashews stand out.",
    },
    {
      id: "packaging",
      title: "Quality Packaging",
      image: packing,
      description:
        "Once graded, our cashews are packed in food-safe, airtight packaging, keeping them fresh and ready for delivery.",
    },
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const slideInFromLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
  };

  const slideInFromRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const bounce = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-20 overflow-hidden">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="py-12 px-4 md:px-8 bg-gradient-to-r from-amber-600 to-orange-600 text-white"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            About Red Clay Cashews
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-xl max-w-3xl mx-auto"
          >
            Growers, processors, and suppliers of premium quality cashews - from
            our farms directly to your table
          </motion.p>
        </div>
      </motion.section>

      {/* Introduction Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        className="py-16 px-4 md:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={scaleUp}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 transform transition-all duration-500 hover:shadow-xl"
          >
            <h2 className="text-3xl font-bold text-amber-900 mb-6">
              Our Story
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              At Red Clay Cashews, we are more than just a brand – we are
              growers, processors, and suppliers of premium quality cashews.
              With our own cashew plantations, dedicated processing land, and
              in-house machinery, we take pride in producing cashews that are
              fresh, hygienic, and naturally delicious.
            </p>
            <p className="text-lg text-gray-700">
              Unlike traders who depend on outside sourcing, we control every
              stage of production – from planting and harvesting to drying,
              cutting, grading, and packing. This ensures that what reaches you
              is nothing less than the purest and most authentic cashew nut.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Process Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-bold text-amber-900 mb-12 text-center"
          >
            Our Journey from Farm to Table
          </motion.h2>

          <div className="space-y-20">
            {processData.map((process, index) => (
              <motion.div
                key={process.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={index % 2 === 0 ? slideInFromLeft : slideInFromRight}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8 items-center bg-white rounded-2xl shadow-lg p-6 md:p-10 transition-all duration-500 hover:shadow-xl`}
              >
                {/* Image Container */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="md:w-1/2 relative"
                >
                  <img
                    src={process.image}
                    alt={process.title}
                    className="w-full h-72 object-cover rounded-xl shadow-lg"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="absolute -bottom-4 -right-4 bg-amber-600 text-white text-xl font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-md"
                  >
                    {index + 1}
                  </motion.div>
                </motion.div>

                {/* Content Container */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="md:w-1/2"
                >
                  <h3 className="text-2xl font-bold text-amber-900 mb-4">
                    {process.title}
                  </h3>
                  <p className="text-gray-700 mb-6">{process.description}</p>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-600"
                  >
                    <p className="text-amber-800">
                      Our integrated approach ensures quality control at every
                      step of the process.
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-16 px-4 md:px-8 bg-amber-100"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={bounce}
            className="text-3xl font-bold text-amber-900 mb-12 text-center"
          >
            Our Commitment
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-500 hover:shadow-xl"
            >
              <h3 className="text-2xl font-bold text-amber-900 mb-6">
                Quality Assurance
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-4">
                    <svg
                      className="w-6 h-6 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    100% Own Manufacturing – From tree to pack, we handle
                    everything in-house.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-4">
                    <svg
                      className="w-6 h-6 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Freshness Guaranteed – No old stock, no middlemen, no
                    compromise.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-4">
                    <svg
                      className="w-6 h-6 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Farm to Fork Transparency – Customers know exactly where
                    their cashews come from.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-4">
                    <svg
                      className="w-6 h-6 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Premium Quality & Nutrition – Rich in taste, texture, and
                    health benefits.
                  </span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-500 hover:shadow-xl"
            >
              <h3 className="text-2xl font-bold text-amber-900 mb-6">
                Why Choose Us
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Direct from the farm – Authentic and trustworthy.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    State-of-the-art processing – Clean, hygienic, and
                    efficient.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-4">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Traditional grading – Handpicked for perfection.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-red-100 p-2 rounded-full mr-4">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Customer-first approach – Supplying the best cashews for
                    homes, bakeries, wholesalers, and exporters.
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Vision & Mission Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-16 px-4 md:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl shadow-lg p-8 md:p-10 transform transition-all duration-500 hover:-translate-y-2"
            >
              <h3 className="text-2xl font-bold mb-6">Our Vision</h3>
              <p className="text-lg">
                To make Red Clay Cashews a trusted household name for quality
                cashews worldwide by combining nature, technology, and
                tradition.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-gradient-to-r from-amber-700 to-orange-700 text-white rounded-2xl shadow-lg p-8 md:p-10 transform transition-all duration-500 hover:-translate-y-2"
            >
              <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
              <p className="text-lg">
                To deliver farm-fresh, premium-grade cashews directly to
                customers while supporting sustainable farming practices and
                empowering local communities.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="py-16 px-4 md:px-8 bg-amber-900 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-bold mb-6"
          >
            Experience the Red Clay Cashews Difference
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-xl mb-8"
          >
            Taste the quality that comes from controlling every step of the
            process
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToProducts} // Added onClick handler
              className="bg-white text-amber-900 px-8 py-3 font-semibold rounded-full transition-all hover:bg-amber-100 hover:shadow-lg"
            >
              Explore Our Products
            </motion.button>  
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToLogin} // Added onClick handler
              className="border-2 border-white text-white px-8 py-3 font-semibold rounded-full transition-all hover:bg-white hover:text-amber-900"
            >
              Contact Us
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
      <LeftSidebar />
    </div>
  );
};

export default About;
