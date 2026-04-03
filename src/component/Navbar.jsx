import { useState, useEffect, useRef, useMemo } from "react";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaShoppingCart,
  FaArrowUp,
  FaUser,
  FaCrown,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import logo from "../images/logo2.png";
import { NavLink, useNavigate } from "react-router-dom";
import { productApi } from "../services/api";
import { useCart } from "../context/CartContext";
import ErrorBoundary from "../context/ErrorBoundary";
import { useAuth } from "../context/AuthContext";

// Keyword mapping for better search
const keywordMapping = {
  // Cashew related
  "cashews": "cashew",
  "cashew nuts": "cashew",
  "kaju": "cashew",
  "cashew dry fruit": "cashew",
  "raw cashews": "raw cashew",
  "roasted cashews": "roasted cashew",
  "salted cashews": "salted cashew",
  "plain cashews": "plain cashew",
  "organic cashews": "organic cashew",
  "redclay cashews": "cashew",
  "red clay cashew nuts": "cashew",
  "redclay kaju": "cashew",
  "redclay cashews online": "cashew",
  "buy cashews online": "cashew",
  "cashews price": "cashew",
  "cashew nuts 1kg price": "cashew",
  "best cashews online": "cashew",
  "premium cashews": "cashew",
  "fresh cashews": "cashew",
  "cashews home delivery": "cashew",
  "kaju online": "cashew",
  "kaju price today": "cashew",
  "best kaju brand": "cashew",
  "cashew shop near me": "cashew",
  "w210": "W210",
  "w240": "W240",
  "w320": "W320",
  "w450": "W450",
  "w180": "W180",
  "whole white": "cashew",
  "whole white 180": "W180",
  "whole white 210": "W210",
  "whole white 240": "W240",
  "whole white 320": "W320",
  "whole white 450": "W450",
  
  // Dry fruits related
  "dry fruits": "dry fruits",
  "dryfruit online": "dry fruits",
  "dry fruits shop": "dry fruits",
  "mixed dry fruits": "dry fruits",
  "premium dry fruits": "dry fruits",
  "healthy dry fruits": "dry fruits",
  "healthy snacks": "dry fruits",
  "protein dry fruits": "dry fruits",
  "dry fruits for weight gain": "dry fruits",
  "dry fruits for kids": "dry fruits",
  "dry fruits for gifting": "dry fruits",
};

// Animated search placeholder varieties
const cashewVarieties = [
  "W210 cashew",
  "W240 cashew",  
  "W320 cashew",
  "W450 cashew",
  "organic cashew",
  "roasted cashew",
  "salted cashew",
  "premium cashew",
  "Almonds",
  "Dates",
  "Pistachios",
  "Athipazham",
  "Black Raisins",
  "Pumpkin Seeds",
  "Sunflower Seeds",
  "Chia Seeds",
  "Watermelon Seeds", 
  "Cucumber Seeds",  

];

// Product list for search filtering
const productsList = [
  { id: 1, name: "Whole White-180", grade: "W180", category: "cashew" },
  { id: 2, name: "Whole White-210", grade: "W210", category: "cashew" },
  { id: 3, name: "Whole White-240", grade: "W240", category: "cashew" },
  { id: 4, name: "Whole White-320", grade: "W320", category: "cashew" },
  { id: 5, name: "Whole White-450", grade: "W450", category: "cashew" },
  { id: 6, name: "WSplit", grade: "WSplit", category: "cashew" },
  { id: 7, name: "LWP", grade: "LWP", category: "cashew" },
  { id: 8, name: "SP", grade: "SP", category: "cashew" },
  { id: 9, name: "BB-Baby Bits", grade: "BB", category: "cashew" },
  { id: 10, name: "Roasted Cashew", grade: "Roasted", category: "roasted cashew" },
  { id: 11, name: "Salted Cashew", grade: "Salted", category: "salted cashew" },
  { id: 12, name: "Borma Cashew Skin", grade: "BormaC", category: "cashew" },
  { id: 13, name: "Green Chili", grade: "GreenChiliC", category: "cashew" },
  { id: 14, name: "Block Pepper Salted", grade: "BlockPepper", category: "cashew" },
  { id: 15, name: "Raw Cashew in Skin", grade: "RawC", category: "raw cashew" },
  { id: 16, name: "Honey Roasted", grade: "HoneyC", category: "honey cashew" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showMarquee, setShowMarquee] = useState(true);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const lastScrollY = useRef(window.scrollY);
  const searchRef = useRef(null);
  
  const navigate = useNavigate();
  const { isAuthenticated, userType, logout } = useAuth();
  const { cartItems = [], cartCount = 0 } = useCart();

  // Enhanced search handler with keyword mapping
  const handleSearch = async (searchTerm = searchValue) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;
    
    try {
      // Check if term matches any mapped keyword
      let mappedTerm = term;
      let matchedProduct = null;
      
      // Check for exact matches in keyword mapping
      for (const [key, value] of Object.entries(keywordMapping)) {
        if (term === key.toLowerCase() || term.includes(key.toLowerCase())) {
          mappedTerm = value;
          break;
        }
      }
      
      // Check for grade matches (W180, W210, etc.)
      const gradeMatch = productsList.find(p => 
        p.grade.toLowerCase() === term || 
        p.name.toLowerCase().includes(term)
      );
      
      if (gradeMatch) {
        matchedProduct = gradeMatch;
        mappedTerm = gradeMatch.grade;
      }
      
      // Search by mapped term
      let result;
      if (matchedProduct) {
        result = [matchedProduct];
      } else {
        result = await productApi.search(mappedTerm);
        
        // If no results and term is generic, try to get all products of that category
        if ((!result || result.length === 0) && (mappedTerm === "cashew" || mappedTerm === "dry fruits")) {
          result = await productApi.getByMainCategory(mappedTerm === "cashew" ? "nuts" : "fruits");
        }
      }
      
      navigate("/products", { 
        state: { 
          products: result, 
          search: searchTerm.trim(),
          searchTerm: mappedTerm
        } 
      });
      
      setShowSuggestions(false);
      setSearchSuggestions([]);
    } catch (err) {
      console.error("Search failed:", err);
      navigate("/products");
    }
  };

  // Get search suggestions based on input
  const getSuggestions = (input) => {
    if (!input.trim()) return [];
    
    const lowerInput = input.toLowerCase();
    const suggestions = [];
    
    // Add keyword mapping suggestions
    for (const [key, value] of Object.entries(keywordMapping)) {
      if (key.includes(lowerInput) || lowerInput.includes(key)) {
        suggestions.push(key);
      }
    }
    
    // Add product name suggestions
    productsList.forEach(product => {
      if (product.name.toLowerCase().includes(lowerInput)) {
        suggestions.push(product.name);
      }
      if (product.grade.toLowerCase().includes(lowerInput)) {
        suggestions.push(product.grade);
      }
    });
    
    // Add grade suggestions
    const grades = ["W180", "W210", "W240", "W320", "W450"];
    grades.forEach(grade => {
      if (grade.toLowerCase().includes(lowerInput)) {
        suggestions.push(grade);
      }
    });
    
    // Remove duplicates and limit to 5
    return [...new Set(suggestions)].slice(0, 5);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (value.trim()) {
      const suggestions = getSuggestions(value);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  };

  // Click outside handler for suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search placeholder animation - IMPROVED VERSION
  useEffect(() => {
    // Don't animate if user is typing or on mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile || searchValue) {
      setSearchPlaceholder("Search for cashew...");
      return;
    }
    
    let timeout;
    const baseText = "Search for ";
    const fullText = baseText + cashewVarieties[placeholderIndex];
    
    if (isTyping) {
      if (charIndex < fullText.length) {
        timeout = setTimeout(() => {
          setSearchPlaceholder(fullText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 100);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      if (charIndex > baseText.length) {
        timeout = setTimeout(() => {
          setSearchPlaceholder(fullText.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 50);
      } else {
        setPlaceholderIndex((placeholderIndex + 1) % cashewVarieties.length);
        setIsTyping(true);
      }
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [charIndex, isTyping, placeholderIndex, searchValue]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 10);
      setShowScrollToTop(scrollY > 300);
      if (scrollY > lastScrollY.current) {
        setShowMarquee(false);
      } else {
        setShowMarquee(true);
      }
      lastScrollY.current = scrollY;
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setShowCartPreview(false);
    setShowSuggestions(false);
  };

  const toggleMobileProducts = () => {
    setMobileProductsOpen(!mobileProductsOpen);
  };
  
  // Cart preview click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const cartIcon = event.target.closest('[aria-label="Cart"]');
      const cartPreview = event.target.closest(".cart-preview");
      
      if (showCartPreview && !cartIcon && !cartPreview) {
        setShowCartPreview(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCartPreview]);

  const mainCategories = [
    { label: "Seeds", value: "seeds" },
    { label: "Nuts", value: "nuts" },
    { label: "Fruits", value: "fruits" },
  ];

  const handleProductsClick = async () => {
    try {
      const result = await productApi.getAll();
      navigate("/products", { state: { products: result, subcategory: "all" } });
    } catch (err) {
      console.error("Failed to fetch all products:", err);
      navigate("/products");
    }
  };

  const handleNavigateToLogin = () => {
   navigate("/login", { state: { from: "/my-account" } });
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const cashewMessages = "🌱 100% Organic Farm Fresh Cashews from Panruti 📍";

  return (
    <>
      <div className="fixed top-0 left-0 right-0 w-full z-[9999]">
        {showMarquee && (
          <div className="bg-gradient-to-r from-[#2E8B57] to-[#C1440E] text-white">
            <div className="animate-marquee whitespace-nowrap py-4 text-sm font-medium">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="inline-block px-4">
                  {cashewMessages}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <nav className={`bg-gradient-to-r from-green-300 via-yellow-200 to-red-50 text-white py-2 shadow-sm transition-all duration-300 ${isScrolled ? "shadow-md" : "shadow-sm"}`}>
          
          {/* Mobile Top Bar */}
          <div className="md:hidden flex items-center justify-between px-4 py-3">
            <button className="text-[#C1440E] focus:outline-none z-30" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
            
            <div className="flex items-center justify-center flex-1">
              <img src={logo} alt="Red Clay Cashews Logo" className="h-12 w-auto" />
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <button onClick={() => navigate("/address")} aria-label="My Account">
                  <FaUser className="text-[#C1440E] h-6 w-6" />
                </button>
              ) : (
                <button onClick={handleNavigateToLogin} aria-label="Login">
                  <FaUser className="text-[#C1440E] h-6 w-6" />
                </button>
              )}
              
<button 
  onClick={() => navigate("/cart")}  
  className="relative"
  aria-label="Cart"
>
                <FaShoppingCart className="text-[#C1440E] h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C1440E] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar with Suggestions */}
          <div className="md:hidden px-5 py-5" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={handleInputChange}
                placeholder="Search for cashew..."
                className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E8B57] bg-white text-gray-800"
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                    setShowSuggestions(false);
                  }
                }}
              />
              <button
                onClick={() => handleSearch()}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#2E8B57] cursor-pointer bg-transparent border-none p-0"
                aria-label="Search"
              >
                <FaSearch />
              </button>
              
              {/* Mobile Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                  {searchSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchValue(suggestion);
                        setShowSuggestions(false);
                        handleSearch(suggestion);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 border-b last:border-b-0"
                    >
                      <FaSearch className="inline mr-2 text-gray-400" size={12} />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden md:block container mx-auto">
            <div className="flex justify-between items-center px-4 py-2">
              <div className="flex items-center">
                <img src={logo} alt="Red Clay Cashews Logo" className="h-10 md:h-12 lg:h-14 w-auto" />
              </div>
              
              <div className="flex space-x-6 lg:space-x-8 mx-6">
                <NavLink to="/home" className={({ isActive }) => isActive ? "text-[#C1440E] border-b-2 border-[#C1440E] pb-1" : "text-[#2C2C2C] hover:text-[#C1440E] text-sm md:text-base font-medium transition duration-300"}>
                  Home
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? "text-[#C1440E] border-b-2 border-[#C1440E] pb-1" : "text-[#2C2C2C] hover:text-[#C1440E] text-sm md:text-base font-medium transition duration-300"}>
                  About us
                </NavLink>
                <div className="relative group">
                  <button
                    onClick={handleProductsClick}
                    className="text-[#2C2C2C] hover:text-[#C1440E] text-sm md:text-base font-medium transition duration-300"
                  >
                    Products
                  </button>
                </div>
                <NavLink to="/contact" className={({ isActive }) => isActive ? "text-[#C1440E] border-b-2 border-[#C1440E] pb-1" : "text-[#2C2C2C] hover:text-[#C1440E] text-sm md:text-base font-medium transition duration-300"}>
                  Contact us
                </NavLink>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center relative" ref={searchRef}>
                  <input
                    type="text"
                    value={searchValue}
                    onChange={handleInputChange}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                    placeholder={searchValue ? "" : (searchPlaceholder || "Search for cashew...")}
                    className="py-2 px-6 pr-10 rounded-full border border-[#2E8B57]/50 focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-[#2E8B57] w-64 transition-all duration-300 hover:border-[#2E8B57] bg-white text-[#2C2C2C]"
                  />
                  <FaSearch className="absolute right-3 text-[#2E8B57] cursor-pointer" onClick={() => handleSearch()} />
                  
                  {/* Desktop Search Suggestions */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                      {searchSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchValue(suggestion);
                            setShowSuggestions(false);
                            handleSearch(suggestion);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 border-b last:border-b-0"
                        >
                          <FaSearch className="inline mr-2 text-gray-400" size={12} />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  {isAuthenticated && userType === "admin" && (
                    <div className="flex items-center bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      <FaCrown className="mr-1" />
                      Admin
                    </div>
                  )}
                  
                  {isAuthenticated ? (
                    <button onClick={() => navigate("/address")} className="relative group">
                      <div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FaUser className="text-[#C1440E] h-5 w-5 hover:text-[#2E8B57] cursor-pointer" />
                      </div>
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Account
                      </span>
                    </button>
                  ) : (
                    <button onClick={handleNavigateToLogin} className="relative group">
                      <div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FaUser className="text-[#C1440E] h-5 w-5 hover:text-[#2E8B57] cursor-pointer" />
                      </div>
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Login
                      </span>
                    </button>
                  )}
                  
                 <button 
  onClick={() => navigate("/cart")}  // 👈 CHANGE THIS
  className="relative"
  aria-label="Cart"
>
                    <FaShoppingCart className="text-[#C1440E] h-6 w-6 hover:text-[#2E8B57] cursor-pointer" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#C1440E] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  
                  <button onClick={() => navigate("/products")} className="bg-[#2E8B57] hover:bg-[#C1440E] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden bg-white w-full absolute left-0 transition-all duration-300 ease-in-out z-40 ${isMobileMenuOpen ? "top-full opacity-100 visible" : "top-[-100%] opacity-0 invisible"}`}>
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-0 border-t border-[#C1440E]/20 shadow-lg">
              {isAuthenticated && userType === "admin" && (
                <div className="flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-3 rounded-full mb-3">
                  <FaCrown className="mr-2" />
                  <span className="font-bold">Administrator</span>
                </div>
              )}
              
              <NavLink to="/home" className={({ isActive }) => isActive ? "text-[#C1440E] font-medium py-3 border-b border-[#C1440E]" : "text-[#2C2C2C] hover:text-[#C1440E] text-lg font-medium py-3 border-b border-gray-100"} onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </NavLink>
              
              <div className="border-b border-gray-100">
                <button onClick={toggleMobileProducts} className="flex justify-between items-center w-full text-left text-[#2C2C2C] hover:text-[#C1440E] text-lg font-medium py-3">
                  <span>Products</span>
                  {mobileProductsOpen ? <FaChevronUp className="text-[#C1440E]" /> : <FaChevronDown className="text-gray-400" />}
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${mobileProductsOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="pl-4 pb-2 space-y-2">
                    <button onClick={async () => { setIsMobileMenuOpen(false); await handleProductsClick(); }} className="block w-full text-left text-gray-700 hover:text-[#C1440E] py-2 px-3 rounded hover:bg-green-50">
                      All Products
                    </button>
                    {mainCategories.map((cat) => (
                      <button key={cat.value} onClick={async () => { setIsMobileMenuOpen(false); try { const result = await productApi.getByMainCategory(cat.value); navigate("/products", { state: { products: result, mainCategory: cat.value } }); } catch (err) { navigate("/products"); } }} className="block w-full text-left text-gray-700 hover:text-[#C1440E] py-2 px-3 rounded hover:bg-green-50">
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <NavLink to="/about" className={({ isActive }) => isActive ? "text-[#C1440E] font-medium py-3 border-b border-[#C1440E]" : "text-[#2C2C2C] hover:text-[#C1440E] text-lg font-medium py-3 border-b border-gray-100"} onClick={() => setIsMobileMenuOpen(false)}>
                About
              </NavLink>
              
              <NavLink to="/contact" className={({ isActive }) => isActive ? "text-[#C1440E] font-medium py-3 border-b border-[#C1440E]" : "text-[#2C2C2C] hover:text-[#C1440E] text-lg font-medium py-3 border-b border-gray-100"} onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </NavLink>
              
              <div className="pt-3 pb-2">
                <button onClick={() => { navigate("/products"); setIsMobileMenuOpen(false); }} className="w-full bg-[#2E8B57] hover:bg-[#C1440E] text-white px-4 py-3 rounded-full text-base font-medium transition-colors shadow-md">
                  Shop Now
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600">Welcome back!</span>
                      <button onClick={() => navigate("/address")} className="text-[#2E8B57] hover:text-[#C1440E] font-medium">
                        My Account
                      </button>
                    </div>
                    <button onClick={handleLogout} className="w-full bg-gray-100 hover:bg-gray-200 text-[#2C2C2C] text-center py-3 rounded-lg font-medium">
                      Logout
                    </button>
                  </>
                ) : (
                  <button onClick={handleNavigateToLogin} className="w-full bg-[#C1440E] hover:bg-[#2E8B57] text-white text-center py-3 rounded-lg font-medium">
                    Login / Register
                  </button>
                )}
              </div>
            </div>
          </div>

        
        </nav>
      </div>
      
      <button onClick={scrollToTop} className={`fixed z-40 bottom-6 right-6 p-3 bg-[#2E8B57] text-white rounded-full shadow-lg transition-all duration-300 hover:bg-[#C1440E] hover:scale-110 ${showScrollToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}>
        <FaArrowUp className="w-5 h-5" />
      </button>
      
      <div className="pt-[160px] md:pt-[110px]"></div>
    </>
  );
};

export default Navbar;