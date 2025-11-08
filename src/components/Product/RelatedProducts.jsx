import React, { useRef, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { useProducts } from "../../hooks/useProducts";

const RelatedProducts = ({ productCategory = "", productId = "" }) => {
  const { products, loading, fetchCategoryPage } = useProducts();
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hovering, setHovering] = useState(false);

  const categoryData = products[productCategory] || {};
  const page = categoryData.page || 0;
  const totalPages = categoryData.totalPages || 1;

  const content = Array.isArray(categoryData.content)
    ? categoryData.content.filter((p) => p.id !== productId)
    : [];

  // Detect scroll state
  const updateScrollButtons = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = containerRef.current;
    el?.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el?.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [content]);

  // Scroll by container width
  const scrollByWidth = (direction = 1) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  // Auto-scroll
  useEffect(() => {
    if (hovering || content.length < 2) return;
    const interval = setInterval(() => scrollByWidth(1), 4000);
    return () => clearInterval(interval);
  }, [hovering, content.length]);

  // Go to backend page
  const goToPage = (p) => {
    if (p < 0 || p >= totalPages) return;
    fetchCategoryPage(productCategory, p);
    containerRef.current?.scrollTo({ left: 0, behavior: "auto" });
  };

  return (
    <section
      className="max-w-6xl mx-auto px-4 mt-16 relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">
        Related Products
      </h2>

      <div className="relative">
        {/* Left Chevron */}
        {canScrollLeft && (
          <button
            onClick={() => scrollByWidth(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <FaChevronLeft />
          </button>
        )}

        {/* Scrollable container */}
        <motion.div
          ref={containerRef}
          className="flex space-x-4 overflow-x-auto py-2 scrollbar-hide cursor-grab"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          whileTap={{ cursor: "grabbing" }}
        >
          {!loading &&
            content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </motion.div>

        {/* Right Chevron */}
        {canScrollRight && (
          <button
            onClick={() => scrollByWidth(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <FaChevronRight />
          </button>
        )}
      </div>

      {/* Pagination Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx)}
              className={`w-3 h-3 rounded-full transition ${
                idx === page
                  ? "bg-orange-500 dark:bg-orange-400"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RelatedProducts;
