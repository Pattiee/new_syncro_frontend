import { useEffect, useState, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { motion, useMotionValue, useTransform } from "framer-motion";

const FloatingCart = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Motion values for drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-100, 100], [-10, 10]);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current && window.scrollY > 100) {
        setVisible(false); // scrolling down
      } else {
        setVisible(true); // scrolling up
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigateToSummary = () => navigate("/cart");

  return (
    <motion.button
      onClick={handleNavigateToSummary}
      drag
      dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
      style={{ x, y, rotate }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 50 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="fixed bottom-6 right-6 w-16 h-16 sm:w-18 sm:h-18 bg-orange-500 hover:bg-orange-600 text-white 
                 rounded-full shadow-xl flex items-center justify-center transition-transform duration-200
                 z-50 border-2 border-white dark:border-gray-900 cursor-pointer"
      aria-label="View Cart"
    >
      <div className="relative flex items-center justify-center">
        <ShoppingCart size={28} className="pointer-events-none" />

        {cartItems?.length > 0 && (
          <span
            className="absolute -top-2 -right-2 flex items-center justify-center 
                       w-5 h-5 sm:w-6 sm:h-6 bg-red-600 text-white font-bold text-xs sm:text-sm
                       rounded-full shadow-md border-2 border-white dark:border-gray-900"
          >
            {cartItems.length}
          </span>
        )}
      </div>
    </motion.button>
  );
};

export default FloatingCart;
