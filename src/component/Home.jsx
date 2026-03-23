import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import fruitImage from "../images/fruit.png";
import image1 from "../images/image1.png";
import W180 from "../wwimages/W180.png";
import W210 from "../wwimages/W210.png";
import W240 from "../wwimages/W240.png";
import W320 from "../wwimages/W320.png";
import W450 from "../wwimages/W450.png";
import WSplit from "../wwimages/WSplit.png";
import LWP from "../wwimages/LWP.png";
import SP from "../wwimages/SP.png";
import BB from "../wwimages/BB.png";
import Roasted from "../wwimages/Roasted.png";
import saltedcashew from "../wwimages/saltedcashew.png";
import BormaCashewwithSkin from "../wwimages/BormaCashewwithSkin.png";
import GreenChili from "../wwimages/GreenChili.png";
import BlockPepperSalted from "../wwimages/BlockPepperSalted.png";
import RawSpicycashewwithskin from "../wwimages/RawSpicycashewwithskin.png";
import honeyroasted from "../wwimages/honeyroasted.png";

import W180Details from "./W180Details";
import W210Details from "./W210Details";
import W240Details from "./W240Details";
import W320Details from "./W320Details";
import W450Details from "./W450Details";
import WSplitDetails from "./WSplitDetails";
import LWPDetails from "./LWPDetails";
import BBDetails from "./BBDetails";
import SPDetails from "./SPDetails";
import RoastedCashew from "./RoastedCashew";
import SaltedDetails from "./SaltedDetails";
import BormaCashew from "./BormaCashew";
import GreenChiliDetails from "./GreenChiliDetails";
import BlockPepperDetails from "./BlockPepperDertails";
import RawcashewDetails from "./RawCashewDetails";
import HoneyCashewDetails from "./HoneyCashewDetails";

import morecashew from "../images/morecashew.jpg";
import HomeLayout from "./HomeLayout";
import { useCart } from "../context/CartContext";

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [showW180Details, setShowW180Details] = useState(null);
  const [showW210Details, setShowW210Details] = useState(null);
  const [showW240Details, setShowW240Details] = useState(null);
  const [showW320Details, setShowW320Details] = useState(null);
  const [showW450Details, setShowW450Details] = useState(null);
  const [wSplitDetails, setWSplitDetails] = useState(null);
  const [cashewlwpDetails, setLwpDetails] = useState(null);
  const [spCashew, setSpcashew] = useState(null);
  const [roastedDetails, setRoastedDetails] = useState(null);
  const [saltedCashew, setSaltedCashew] = useState(null);
  const [bormaCashew, setBormaCashew] = useState(null);
  const [greenChili, setGreenChili] = useState(null);
  const [bbcashew, setBbcashew] = useState(null);
  const [blockPepper, setBlockPepper] = useState(null);
  const [rawCashew, setRawCashew] = useState(null);
  const [honeyCashew, setHoneyCashew] = useState(null);
  const [apiProducts, setApiProducts] = useState([]);
  const [loadingProductId, setLoadingProductId] = useState(null);

  // Function to fetch product details from API
  const fetchProductDetails = async (productName) => {
    try {
      const encodedName = encodeURIComponent(productName);
      const response = await fetch(`http://localhost:5000/api/export-premium-cashews?name=${encodedName}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        return data.data[0];
      }
      return null;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  };

  // Handle Buy button click with API call
  const handleBuyClick = async (product) => {
    setLoadingProductId(product.id);
    
    try {
      // Map product name to API expected name format
      let apiProductName = "";
      
      switch(product.grade) {
        case "W180":
          apiProductName = "W180 Cashew Nuts - King of Cashews";
          break;
        case "W210":
          apiProductName = "W210 Cashew Nuts";
          break;
        case "W240":
          apiProductName = "W240 Cashew Nuts";
          break;
        case "W320":
          apiProductName = "W320 Cashew Nuts";
          break;
        case "W450":
          apiProductName = "W450 Cashew Nuts";
          break;
        case "WSplit":
          apiProductName = "W Split Cashew Nuts";
          break;
        case "LWP":
          apiProductName = "LWP Cashew Nuts";
          break;
        case "SP":
          apiProductName = "SP Cashew Nuts";
          break;
        case "BB":
          apiProductName = "BB Cashew Nuts";
          break;
        case "Roasted":
          apiProductName = "Roasted Cashew Nuts";
          break;
        case "Salted":
          apiProductName = "Salted Cashew Nuts";
          break;
        case "BormaC":
          apiProductName = "Borma Cashew Nuts";
          break;
        case "GreenChiliC":
          apiProductName = "Green Chili Cashew Nuts";
          break;
        case "BlockPepper":
          apiProductName = "Block Pepper Cashew Nuts";
          break;
        case "RawC":
          apiProductName = "Raw Cashew Nuts";
          break;
        case "HoneyC":
          apiProductName = "Honey Cashew Nuts";
          break;
        default:
          apiProductName = product.name;
      }
      
      // Fetch product details from API
      const apiProductData = await fetchProductDetails(apiProductName);
      
      // Prepare product data for navigation
      const productData = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        grade: product.grade,
        description: product.description,
        image_url: product.image,
        image_url1: product.image,
        // Use sizes from API if available, otherwise use default
        sizes: apiProductData && apiProductData.sizes ? apiProductData.sizes : [{
          size: "250g",
          price: product.price,
          mrp_price: null
        }],
        stock: 10,
        pt: null
      };
      
      // Navigate to product details page with product data
      navigate("/productdetails", { state: { product: productData } });
    } catch (error) {
      console.error("Error in buy click:", error);
      // Fallback to default product data
      const productData = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        grade: product.grade,
        description: product.description,
        image_url: product.image,
        image_url1: product.image,
        sizes: [{
          size: "250g",
          price: product.price,
          mrp_price: null
        }],
        stock: 10,
        pt: null
      };
      navigate("/productdetails", { state: { product: productData } });
    } finally {
      setLoadingProductId(null);
    }
  };

  useEffect(() => {
    if (showW180Details || showW210Details || showW240Details || showW320Details || 
        showW450Details || wSplitDetails || cashewlwpDetails || spCashew || 
        roastedDetails || saltedCashew || bormaCashew || greenChili || bbcashew || 
        blockPepper || rawCashew || honeyCashew) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showW180Details, showW210Details, showW240Details, showW320Details, 
      showW450Details, wSplitDetails, cashewlwpDetails, spCashew, 
      roastedDetails, saltedCashew, bormaCashew, greenChili, bbcashew, 
      blockPepper, rawCashew, honeyCashew]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.25 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  const imageLeftVariants = {
    hidden: { opacity: 0, x: -80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };
  const imageRightVariants = {
    hidden: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/premium-cashews");
        const data = await res.json();

        if (data.success) {
          setApiProducts(data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, []);

  const testimonials = [
    {
      quote:
        "The best cashews I've ever tasted! Fresh, crunchy, and full of flavor.",
      name: "Priya K.",
    },
    {
      quote:
        "I can taste the difference in quality. These are truly premium cashews.",
      name: "Rahul M.",
    },
  ];

  const products = [
    {
      id: 1,
      name: "Whole White-180",
      price: 600,
      image: W180,
      grade: "W180",
      description: "Premium large sized cashews with rich flavor",
    },
    {
      id: 2,
      name: "Whole White-210",
      price: "545",
      image: W210,
      grade: "W210",
      description: "Excellent quality medium-large cashews",
    },
    {
      id: 3,
      name: "Whole White-240",
      price: 499,
      image: W240,
      grade: "W240",
      description: "Standard quality perfect for daily use",
    },
    {
      id: 4,
      name: "Whole White-320",
      image: W320,
      price: "290",
      grade: "W320",
      description: "Economical choice without compromising taste",
    },
    {
      id: 5,
      name: "Whole White-450",
      image: W450,
      price: "245",
      grade: "W450",
      description: "Great for bulk cooking and processing",
    },
    {
      id: 6,
      name: "WSplit",
      image: WSplit,
      price: "475",
      grade: "WSplit",
      description: "Perfect for cooking and snacking",
    },
    {
      id: 7,
      name: "LWP",
      price: "375",
      image: LWP,
      grade: "LWP",
      description: "Crunchy cashew splits ideal for sweets, snack mixes",
    },
    {
      id: 8,
      name: "SP",
      price: "190",
      image: SP,
      grade: "SP",
      description: "Small Cashew Pieces–Easy use in baking",
    },
    {
      id: 9,
      name: "BB-Baby Bits",
      image: BB,
      price: "110",
      grade: "BB",
      description: "Fresh cashew granules ideal for blended recipes",
    },
    {
      id: 10,
      name: "Roasted Cashew",
      price: "600",
      grade: "Roasted",
      image: Roasted,
      description: "Golden roasted cashews with a rich",
    },
    {
      id: 11,
      name: "Salted Cashew",
      price: "650",
      grade: "Salted",
      image: saltedcashew,
      description: "Crisp, buttery cashews lightly salted",
    },
    {
      id: 12,
      name: "Borma Cashew Skin",
      price: "780",
      grade: "BormaC",
      image: BormaCashewwithSkin,
      description: "Rich, retaining their natural skin for extra flavor",
    },
    {
      id: 13,
      name: "Green Chili",
      price: "335",
      grade: "GreenChiliC",
      image: GreenChili,
      description: "Green chili kick for a bold, spicy treat",
    },
    {
      id: 14,
      name: "Block Pepper Salted",
      price: "250",
      grade: "BlockPepper",
      image: BlockPepperSalted,
      description: "Crunchy cashews zesty black pepper",
    },
    {
      id: 15,
      name: "Raw Cashew in Skin",
      price: "275",
      grade: "RawC",
      image: RawSpicycashewwithskin,
      description: "Naturally flavorful cashews with skin",
    },
    {
      id: 16,
      name: "Honey Roasted",
      grade: "HoneyC",
      price: "260",
      image: honeyroasted,
      description: "Crunchy cashews glazed golden honey for a sweet",
    },
  ];

  return (
    <main className="bg-[#FAF9F6] pt-5">
      {/* Banner Section */}
      <div className="relative w-full h-[500px] md:h-[700px] overflow-hidden">
        <motion.img
          src={morecashew}
          alt="Cashew background"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative h-full flex items-center justify-center">
          <motion.div
            className="text-center text-white px-4 max-w-4xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Welcome the Healthy
              <br />
              and Tasty
              <br />
              <span className="text-[#FFD700]">Cashews!</span>
            </motion.h1>

            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/products")}
                className="bg-[#2E8B57] hover:bg-[#C1440E] text-white px-8 py-4 rounded-full font-semibold shadow-lg text-lg"
              >
                Shop Now
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <HomeLayout />

      {/* From Red Clay Section */}
      <section className="px-5 py-1 sm:px-7 lg:px-10">
        <motion.div
          className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8"
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.img
            src={fruitImage}
            alt="Cashew fruit"
            className="w-full md:w-1/2 rounded-xl shadow-lg border-4 border-[#C1440E]/20"
            variants={imageLeftVariants}
          />
          <motion.div
            className="w-full md:w-1/2 space-y-4"
            variants={containerVariants}
          >
            <motion.h1
              className="text-3xl lg:text-4xl font-bold text-[#2E8B57]"
              variants={itemVariants}
            >
              🏺 From Red Clay to Premium Cashews
            </motion.h1>
            <motion.p
              className="text-lg text-[#2C2C2C]"
              variants={itemVariants}
            >
              Grown in the mineral-rich red soils of Panruti, Tamil Nadu, our
              cashew apples are handpicked at peak ripeness, ensuring natural
              sweetness and optimal nut quality. Panruti is not just a place —
              it's a legacy. Known across India as one of the most famous cashew
              processing hubs, Panruti is where premium quality begins.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 bg-[#2E8B57] hover:bg-[#C1440E] text-white px-8 py-3 rounded-full font-medium shadow-lg"
              variants={itemVariants}
            >
              Discover Our Clay-to-Jar Process
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Pure Goodness Section */}
      <section className="px-5 py-12 bg-[#F5F5F0]">
        <motion.div
          className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10"
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="w-full md:w-1/2 order-2 md:order-1 space-y-6"
            variants={containerVariants}
          >
            <motion.h1
              className="text-3xl lg:text-4xl font-bold text-[#C1440E]"
              variants={itemVariants}
            >
              Pure Goodness in Every Bite
            </motion.h1>
            <motion.p
              className="text-lg text-[#2C2C2C]"
              variants={itemVariants}
            >
              At Red Clay Cashews, we bring you the finest handpicked cashews,
              processed using traditional, hygienic methods to preserve their
              natural taste, nutrients, and crunch. What you see here is not
              just a bowl of cashews — it's a promise of purity, freshness, and
              quality. Unlike mass-produced nuts stored for months, our cashews
              are freshly processed and packed straight from the farm. Enjoy the
              real, unadulterated flavor in every bite.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 bg-[#C1440E] hover:bg-[#2E8B57] text-white px-8 py-3 rounded-full font-medium shadow-lg"
              variants={itemVariants}
            >
              Taste The Difference
            </motion.button>
          </motion.div>
          <motion.img
            src={image1}
            alt="Premium quality cashews"
            className="w-full md:w-1/2 object-cover rounded-xl shadow-lg border-4 border-[#2E8B57]/20"
            variants={imageRightVariants}
          />
        </motion.div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <motion.h2
          className="text-3xl font-bold text-center text-[#2E8B57] mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our Premium Cashew Selection
        </motion.h2>
        <div className="overflow-x-auto pb-18">
          <div className="flex space-x-6 w-max px-4">
            {products.map((product) => {
              const apiMatch = apiProducts.find(
                (item) =>
                  item.name.replace(/\s/g, "").toLowerCase() ===
                  product.name.replace(/\s/g, "").toLowerCase()
              );

              return (
                <motion.div
                  key={product.id}
                  className="bg-[#FAF9F6] rounded-3xl shadow-lg overflow-hidden border-2 border-[#b5deca] flex-shrink-0"
                  style={{ width: "250px" }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain p-4"
                  />

                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="text-[#580707] font-semibold">
                      {apiMatch
                        ? `${apiMatch.price}₹ / ${apiMatch.size}`
                        : `${product.price}₹ / 250g`}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {product.description}
                    </p>
                    <div className="mt-4 flex gap-3 w-full">
                      {/* BUY BUTTON */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 h-11 rounded-2xl 
                          bg-[#2E8B57] hover:bg-[#1a6b3a]
                          text-white font-semibold text-sm sm:text-base
                          shadow-md transition-all duration-200
                          flex items-center justify-center gap-1
                          disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleBuyClick(product)}
                        disabled={loadingProductId === product.id}
                      >
                        {loadingProductId === product.id ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <span>Buy</span>
                        )}
                      </motion.button>

                      {/* EXPLORE BUTTON */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 h-11 rounded-2xl 
                          bg-[#C1440E] hover:bg-[#9a360b]
                          text-white font-semibold text-sm sm:text-base
                          shadow-md transition-all duration-200
                          flex items-center justify-center gap-1"
                        onClick={() => {
                          if (product.grade === "W180") setShowW180Details(product);
                          if (product.grade === "W210") setShowW210Details(product);
                          if (product.grade === "W240") setShowW240Details(product);
                          if (product.grade === "W320") setShowW320Details(product);
                          if (product.grade === "W450") setShowW450Details(product);
                          if (product.grade === "WSplit") setWSplitDetails(product);
                          if (product.grade === "LWP") setLwpDetails(product);
                          if (product.grade === "BB") setBbcashew(product);
                          if (product.grade === "SP") setSpcashew(product);
                          if (product.grade === "Roasted") setRoastedDetails(product);
                          if (product.grade === "Salted") setSaltedCashew(product);
                          if (product.grade === "BormaC") setBormaCashew(product);
                          if (product.grade === "GreenChiliC") setGreenChili(product);
                          if (product.grade === "BlockPepper") setBlockPepper(product);
                          if (product.grade === "RawC") setRawCashew(product);
                          if (product.grade === "HoneyC") setHoneyCashew(product);
                        }}
                      >
                        <span>Explore</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* From Farm to Table Section */}
      <section className="py-16 bg-[#F5F5F0]">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          From Farm to Table
        </motion.h2>
        <div className="flex flex-col md:flex-row justify-center items-stretch max-w-5xl mx-auto">
          {[
            { icon: "🌱", title: "Organic Farming", desc: "Grown in mineral-rich red soils" },
            { icon: "👩‍🌾", title: "Hand Harvesting", desc: "Carefully handpicked at peak ripeness" },
            { icon: "🏭", title: "Quality Processing", desc: "Hygienic traditional methods" },
            { icon: "🚚", title: "Direct Shipping", desc: "Fresh from our farm to you" },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="flex-1 p-6 text-center border-b-4 border-[#2E8B57]"
              whileHover={{ scale: 1.04, backgroundColor: "#def7ec" }}
              initial={{ opacity: 0, y: 25 * (i + 1) }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What Our Customers Say
        </motion.h2>
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              className="bg-[#FAF9F6] p-8 rounded-xl shadow-md mb-6"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <blockquote className="text-lg italic">
                "{testimonial.quote}"
              </blockquote>
              <footer className="mt-4 font-bold">— {testimonial.name}</footer>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-amber-100 to-emerald-200">
        <motion.div
          className="text-center max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1 bg-white rounded-full mb-4 font-bold shadow-sm">
            Limited Time
          </span>
          <h2 className="text-3xl font-bold mb-4">Monsoon Harvest Special</h2>
          <p className="text-lg mb-6">
            Fresh batch just arrived from our Panruti farms
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/products")}
              className="bg-white text-emerald-600 px-8 py-3 rounded-full font-bold shadow-md"
            >
              Shop Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/about")}
              className="border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-full font-bold"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Details Components (Modals) */}
      <AnimatePresence>
        {showW180Details && (
          <W180Details
            onClose={() => setShowW180Details(null)}
            product={showW180Details}
          />
        )}
        {showW210Details && (
          <W210Details
            onClose={() => setShowW210Details(null)}
            product={showW210Details}
          />
        )}
        {showW240Details && (
          <W240Details
            onClose={() => setShowW240Details(null)}
            product={showW240Details}
          />
        )}
        {showW320Details && (
          <W320Details
            onClose={() => setShowW320Details(null)}
            product={showW320Details}
          />
        )}
        {showW450Details && (
          <W450Details
            onClose={() => setShowW450Details(null)}
            product={showW450Details}
          />
        )}
        {wSplitDetails && (
          <WSplitDetails
            onClose={() => setWSplitDetails(null)}
            product={wSplitDetails}
          />
        )}
        {cashewlwpDetails && (
          <LWPDetails
            onClose={() => setLwpDetails(null)}
            product={cashewlwpDetails}
          />
        )}
        {bbcashew && (
          <BBDetails onClose={() => setBbcashew(null)} product={bbcashew} />
        )}
        {spCashew && (
          <SPDetails onClose={() => setSpcashew(null)} product={spCashew} />
        )}
        {roastedDetails && (
          <RoastedCashew
            onClose={() => setRoastedDetails(null)}
            product={roastedDetails}
          />
        )}
        {saltedCashew && (
          <SaltedDetails
            onClose={() => setSaltedCashew(null)}
            product={saltedCashew}
          />
        )}
        {bormaCashew && (
          <BormaCashew
            onClose={() => setBormaCashew(null)}
            product={bormaCashew}
          />
        )}
        {greenChili && (
          <GreenChiliDetails
            onClose={() => setGreenChili(null)}
            product={greenChili}
          />
        )}
        {blockPepper && (
          <BlockPepperDetails
            onClose={() => setBlockPepper(null)}
            product={blockPepper}
          />
        )}
        {rawCashew && (
          <RawcashewDetails
            onClose={() => setRawCashew(null)}
            product={rawCashew}
          />
        )}
        {honeyCashew && (
          <HoneyCashewDetails
            onClose={() => setHoneyCashew(null)}
            product={honeyCashew}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default Home;