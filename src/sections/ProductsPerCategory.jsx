import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/Product/ProductCard";

const ProductsPerCategory = ({ productCategory = "", products = [] }) => {
  const { loading } = useProducts();
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const itemWidth = 220; // more realistic width accounting for margins
  const intervalRef = useRef(null);

  const scrollToIndex = (index) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: index * itemWidth,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    if (products.length === 0) return;
    const nextIndex = (currentIndex + 1) % products.length;
    scrollToIndex(nextIndex);
  };

  const prevSlide = () => {
    if (products.length === 0) return;
    const prevIndex =
      currentIndex - 1 < 0 ? products.length - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
  };

  useEffect(() => {
    if (!hovering) {
      intervalRef.current = setInterval(nextSlide, 4000);
    }
    return () => clearInterval(intervalRef.current);
  }, [currentIndex, hovering]);

  return (
    <section
      className="max-w-7xl mx-auto p-4 mb-10 rounded-2xl bg-transparent relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Section Title */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-300 dark:border-gray-700 pb-2 capitalize">
        {productCategory}
      </h2>

      {/* Carousel */}
      <div className="relative">
        {/* Left Arrow */}
        {products.length > 3 && (
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <FaChevronLeft />
          </button>
        )}

        {/* Scrollable Container */}
        <motion.div
          ref={containerRef}
          className="flex space-x-4 overflow-x-auto py-2 cursor-grab scrollbar-hide"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          whileTap={{ cursor: "grabbing" }}
        >
          {!loading &&
            products.map((product, idx) => (
              <ProductCard key={product?.id || idx} product={product} />
            ))}
        </motion.div>

        {/* Right Arrow */}
        {products.length > 3 && (
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <FaChevronRight />
          </button>
        )}
      </div>

      {/* Pagination Dots */}
      {products.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {products.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-orange-500 dark:bg-orange-400"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductsPerCategory;
