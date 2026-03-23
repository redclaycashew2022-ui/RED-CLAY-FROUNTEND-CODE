// src/components/SmoothScroll.js
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

const SmoothScroll = ({ children }) => {
  const location = useLocation();
  const controls = useAnimation();
  const scrollContainerRef = useRef(null);

  // Custom scroll animation with adjustable duration
  const smoothScrollToTop = async () => {
    const duration = 0.8; // seconds - adjust this value to control speed
    const startY = window.scrollY;
    const distance = -startY;

    await controls.start({
      y: [startY, 0],
      transition: {
        duration: duration,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing for smooth slow effect
      },
    });

    // Actually move the scroll position
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    smoothScrollToTop();
  }, [location.pathname]);

  return (
    <>
      {/* Main content with scroll animation */}
      <motion.div
        ref={scrollContainerRef}
        animate={controls}
        style={{ willChange: "transform" }}
      >
        {children}
      </motion.div>

      {/* Optional floating scroll-to-top button */}
      <AnimatePresence>
        {window.scrollY > 300 && (
          <motion.button
            className="fixed bottom-8 right-8 z-50 bg-[#2E8B57] text-white p-3 rounded-full shadow-lg hover:bg-[#C1440E] transition-colors"
            onClick={smoothScrollToTop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            aria-label="Scroll to top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmoothScroll;
