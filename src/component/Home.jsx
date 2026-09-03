import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL, productApi } from "../services/api";

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
import coverImage from "../images/coverimage.png";
import container4View from "../images/4container.png";
import giftBasketImage from "../images/giftbasket.png";
import bigBox1kgImage from "../images/big box1kg.png";
import container2Short from "../images/2containerwithshort.png";
import container4Long from "../images/4conatinerwithlong.png";
import HomeLayout from "./HomeLayout";
import { useCart } from "../context/CartContext";

import celebHero from "../images/celebration.png";
import celebHamper from "../images/hamper.png";
import celebDryFruits from "../images/dryfruits.jpg";
import celebRawHoney from "../images/Raw honey with Nuts.jpg";
import celebTwoConSmall from "../images/twoconsmall.png";
import celebFruitsNutsChoc from "../images/Fruits and NutsChocolate.jpg";
import celebMixed from "../images/mixed.png";
import celebGiftChat from "../images/giftchat.png";
import celebTwoWindowBox from "../images/twowindowbox.png";
import celebSmallBox from "../images/smallbox.png";
import celebLaddu from "../images/laddu.png";
import post2 from "../images/post2.jpg";
import post3 from "../images/post3.jpg";
import post4 from "../images/post4.jpg";


const celebrationGalleryImages = [
  { id: "hero", src: celebHero, alt: "Festive Dry Fruit Gifting", filter: { firstMainCategory: "Gifts", belowAll: true } },
  { id: "hamper", src: celebHamper, alt: "Premium Gift Hamper", filter: { firstSubcategory: "Dry Fruit Gifting", belowAll: true } },
  { id: "dryfruits", src: celebDryFruits, alt: "Assorted Dry Fruits", filter: { firstSubcategory: "Mixed Dry Fruits", belowMainCategories: ["Fruits"] } },
  { id: "rawhoney", src: celebRawHoney, alt: "Raw Honey with Nuts", filter: { firstSubcategory: "Honey Mixed Nuts", belowMainCategories: ["HoneyDryFruits"] } },
  { id: "twoconsmall", src: celebTwoConSmall, alt: "Premium Storage Jars", filter: { firstSubcategory: "2containersmall seeds", belowMainCategories: ["Seeds"] } },
  { id: "fruitschoc", src: celebFruitsNutsChoc, alt: "Fruit & Nut Chocolate", filter: { belowMainCategories: ["HealthySnacks"] } },
  { id: "mixed", src: celebMixed, alt: "Signature Mixed Dry Fruits", filter: { showAll: true } },
  { id: "giftchat", src: celebGiftChat, alt: "Festive Jar Trio", filter: { belowMainCategories: ["Gifts"] } },
  { id: "twowindowbox", src: celebTwoWindowBox, alt: "Window Gift Box", filter: { firstSubcategory: "2containerlong", belowMainCategories: ["Seeds"] } },
  { id: "smallbox", src: celebSmallBox, alt: "Compact Nut Boxes", filter: { firstSubcategory: "smallbox4Window", belowMainCategories: ["Seeds", "Nuts"] } },
  { id: "laddu", src: celebLaddu, alt: "Dry Fruit Laddus", filter: { firstSubcategory: "Dry Fruit Laddu", belowMainCategories: ["HealthySnacks"] } },
];

const celebrationCollection = [
  { id: "cover", name: "From Nature's Best to Your Table", image: coverImage, homepageCollection: "Nature's Best" },
  { id: "container4", name: "Premium 2-Layer 4-View Dry Fruit Container", image: container4View, homepageCollection: "Premium 4-View Container" },
  { id: "giftbasket", name: "Premium Nuts, Seeds & Gift Hampers", image: giftBasketImage, homepageCollection: "Gift Hampers" },
  { id: "bigbox1kg", name: "Royal Dry Fruit Combo Container", image: bigBox1kgImage, homepageCollection: "Royal Combo" },
  { id: "container2short", name: "Deluxe 2-Tier Dry Fruit Collection", image: container2Short, homepageCollection: "2-Tier Collection" },
  { id: "container4long", name: "Signature 4-Compartment Dry Fruit Gift Box", image: container4Long, homepageCollection: "4-Compartment Box" },
];

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
  const [loadingCollectionId, setLoadingCollectionId] = useState(null);
  const [featuredGalleryId, setFeaturedGalleryId] = useState("hero");
  const [loadingGalleryId, setLoadingGalleryId] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [isNavigatingToProducts, setIsNavigatingToProducts] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  const sliderImages = [
    { src: post2, alt: "Premium Farm Collection" },
    { src: post3, alt: "Exclusive Selection" },
    { src: post4, alt: "Special Offerings" },
  ];

  const handleCollectionClick = async (item) => {
    setLoadingCollectionId(item.id);
    try {
      const result = await productApi.getByHomepageCollection(item.homepageCollection);
      navigate("/products", {
        state: {
          products: Array.isArray(result) ? result : [],
          subcategory: item.homepageCollection,
          fromCollection: true,
        },
      });
    } catch (error) {
      console.error("Error fetching homepage collection products:", error);
      navigate("/products", {
        state: { subcategory: item.homepageCollection, fromCollection: true },
      });
    } finally {
      setLoadingCollectionId(null);
    }
  };

  // Exact-match filtering (not substring) so lookalike values like
  // "2containerlong" vs "2containerlong seeds" don't bleed into each other.
  const fetchGalleryProducts = async (filter = {}) => {
    const all = await productApi.getAll();
    const list = Array.isArray(all) ? all : [];
    if (filter.showAll) return list;

    let firstTier = [];
    if (filter.firstSubcategory) {
      firstTier = list.filter(
        (p) => (p.subcategory || "").trim() === filter.firstSubcategory
      );
    } else if (filter.firstMainCategory) {
      firstTier = list.filter(
        (p) => (p.maincategory || "").trim() === filter.firstMainCategory
      );
    }

    let belowTier = [];
    if (filter.belowAll) {
      belowTier = list;
    } else if (filter.belowMainCategories?.length) {
      belowTier = list.filter((p) =>
        filter.belowMainCategories.includes((p.maincategory || "").trim())
      );
    }

    const firstIds = new Set(firstTier.map((p) => p.id));
    return [...firstTier, ...belowTier.filter((p) => !firstIds.has(p.id))];
  };

  const handleGalleryClick = (item) => {
    setSelectedGalleryItem(item);
    setShowGalleryModal(true);
  };

  const handleViewProductsFromModal = async (item) => {
    setIsNavigatingToProducts(true);
    try {
      const result = await fetchGalleryProducts(item.filter);
      setShowGalleryModal(false);
      setSelectedGalleryItem(null);
      navigate("/products", {
        state: {
          products: result,
          subcategory: item.filter?.firstSubcategory || item.filter?.firstMainCategory || null,
          fromGallery: true,
        },
      });
    } catch (error) {
      console.error("Error fetching gallery products:", error);
      setShowGalleryModal(false);
      setSelectedGalleryItem(null);
      navigate("/products");
    } finally {
      setIsNavigatingToProducts(false);
    }
  };


  const fetchProductDetails = async (productName) => {
    try {
      const encodedName = encodeURIComponent(productName);
      const response = await fetch(`${API_BASE_URL}/premium-cashews?name=${encodedName}`);
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

  
  const handleBuyClick = async (product) => {
    setLoadingProductId(product.id);
    
    try {
      
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

      const apiProductData = await fetchProductDetails(apiProductName);


      const absoluteImage = product.image.startsWith("http")
        ? product.image
        : `${window.location.origin}${product.image}`;

      const productData = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: absoluteImage,
        grade: product.grade,
        description: product.description,
        image_url: absoluteImage,
        image_url1: absoluteImage,

        sizes: apiProductData && apiProductData.sizes ? apiProductData.sizes : [{
          size: "250g",
          price: product.price,
          mrp_price: null
        }],
        stock: 10,
        pt: null
      };
      

      navigate("/productdetails", { state: { product: productData } });
    } catch (error) {
      console.error("Error in buy click:", error);
 
      const absoluteImage = product.image.startsWith("http")
        ? product.image
        : `${window.location.origin}${product.image}`;
      const productData = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: absoluteImage,
        grade: product.grade,
        description: product.description,
        image_url: absoluteImage,
        image_url1: absoluteImage,
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
    if (showGalleryModal ||
        showW180Details || showW210Details || showW240Details || showW320Details ||
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
  }, [showGalleryModal, showW180Details, showW210Details, showW240Details, showW320Details, 
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
    const sliderInterval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(sliderInterval);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
       const res = await fetch(`${API_BASE_URL}/premium-cashews`);
        const data = await res.json();
console.log("API PRODUCTS 👉", data.data);

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
        "I can taste the difference in quality. These are truly premium snacks.",
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
    <main className="bg-[#FAF9F6] overflow-x-hidden">

      <div className="relative w-full h-[280px] sm:h-[400px] md:h-[700px] mt-0 overflow-hidden bg-[#FAF9F6]">
        <motion.img
          src={morecashew}
          alt="Cashew background"
          className="absolute inset-0 w-full h-full object-cover block"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
        />


       <div className="relative h-full flex items-center">
  <motion.div
    className="text-left text-white px-10 md:px-10 max-w-4xl"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.5 }}
  >
          
            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Elevate Every Celebration Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-[clamp(0.65rem,2.8vw,1.5rem)] sm:text-xl md:text-3xl font-bold text-[#2E8B57] text-left mb-8 md:mb-10 whitespace-nowrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Elevate Every Celebration with Premium Dry Fruits
          </motion.h2>

          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {celebrationCollection.map((item) => (
              <motion.div
                key={item.id}
                className="flex-shrink-0 snap-start w-[62%] sm:w-[36%] group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleCollectionClick(item)}
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {loadingCollectionId === item.id && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="mt-3 px-3 py-2 rounded-lg border border-gray-200 bg-white">
                  <h3
                    className="text-[#2C2C2C] text-xs sm:text-base md:text-lg font-bold truncate"
                    title={item.name}
                  >
                    {item.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* <HomeLayout /> */}

      {/* Discover Our Premium Cashew Collection Section */}
      <section className="py-8 md:py-10 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-[clamp(0.7rem,3.7vw,1.5rem)] sm:text-3xl md:text-4xl font-bold text-[#2E8B57] text-left mb-10 md:mb-12 whitespace-nowrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Discover Our Premium Cashew Collection
          </motion.h2>

          <div className="flex gap-5 md:gap-7 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="flex-shrink-0 snap-start w-[45%] sm:w-[32%] md:w-[24%] lg:w-[20%] xl:w-[15%] group cursor-pointer"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleBuyClick(product)}
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl border border-gray-100 bg-white transition-shadow duration-300">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <p className="mt-3 text-center text-[#2C2C2C] text-sm sm:text-base font-semibold truncate">
                  {product.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Celebrations Gallery Section */}
      <section className="py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 lg:h-[420px]">
            {/* Featured image */}
            <div className="lg:w-[40%] h-[260px] sm:h-[360px] lg:h-full">
              {(() => {
                const featured = celebrationGalleryImages.find(
                  (img) => img.id === featuredGalleryId
                );
                return (
                  <motion.div
                    layoutId={`celeb-${featured.id}`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={() => handleGalleryClick(featured)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full h-full rounded-xl overflow-hidden shadow-xl border border-gray-100 bg-white cursor-pointer"
                  >
                    <img
                      src={featured.src}
                      alt={featured.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {loadingGalleryId === featured.id && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </motion.div>
                );
              })()}
            </div>

            {/* Thumbnail grid */}
            <div className="lg:w-[70%] grid grid-cols-2 sm:grid-cols-5 lg:grid-rows-2 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-8 lg:h-full">
              {celebrationGalleryImages
                .filter((img) => img.id !== featuredGalleryId)
                .map((img) => (
                  <motion.div
                    key={img.id}
                    layoutId={`celeb-${img.id}`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={() => {
                      setFeaturedGalleryId(img.id);
                      handleGalleryClick(img);
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 cursor-pointer bg-white aspect-square lg:aspect-auto lg:h-full transition-shadow duration-300"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {loadingGalleryId === img.id && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </section>

     
      {/* From Farm to Table Section */}
      <section className="py-16 bg-[#F5F5F0]">
        <motion.h2
          className="text-[clamp(1.1rem,6vw,1.875rem)] font-bold text-center mb-12 whitespace-nowrap px-2"
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

      {/* Auto Image Slider Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-[clamp(1.1rem,6vw,1.875rem)] font-bold text-center mb-10 md:mb-12 whitespace-nowrap"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Explore Our Collections
          </motion.h2>
          
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={sliderIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <img
                  src={sliderImages[sliderIndex].src}
                  alt={sliderImages[sliderIndex].alt}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient overlay with info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 md:p-8">
              <motion.p
                key={`text-${sliderIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-white text-lg md:text-xl font-semibold"
              >
                {sliderImages[sliderIndex].alt}
              </motion.p>
            </div>

            {/* Indicator dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {sliderImages.map((_, index) => (
                <motion.div
                  key={index}
                  animate={{
                    scale: index === sliderIndex ? 1.2 : 1,
                    opacity: index === sliderIndex ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`h-2 rounded-full transition-colors ${
                    index === sliderIndex ? "bg-orange-500 w-8" : "bg-white w-2"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <motion.h2
          className="text-[clamp(1.1rem,6vw,1.875rem)] font-bold text-center mb-12 whitespace-nowrap px-2"
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
          <h2 className="text-[clamp(1.1rem,6vw,1.875rem)] font-bold mb-4 whitespace-nowrap">Monsoon Harvest Special</h2>
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
              onClick={() => navigate("/contact")}
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

        {/* Gallery Modal */}
        {showGalleryModal && selectedGalleryItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGalleryModal(false)}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setShowGalleryModal(false)}
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image */}
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <img
                  src={selectedGalleryItem.src}
                  alt={selectedGalleryItem.alt}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Bottom action bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white text-lg font-semibold">{selectedGalleryItem.alt}</h3>
                </div>
                <button
                  onClick={() => handleViewProductsFromModal(selectedGalleryItem)}
                  disabled={isNavigatingToProducts}
                  className="ml-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  {isNavigatingToProducts ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      View Products
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Home;