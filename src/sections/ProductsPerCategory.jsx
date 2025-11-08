import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/Product/ProductCard";

const ProductsPerCategory = ({ productCategory = "", data }) => {
  const { loading, fetchCategoryPage } = useProducts();
  const containerRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(data?.page || 0);
  const [hovering, setHovering] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const intervalRef = useRef(null);
  const itemWidth = 220;

  const handleFetchPage = (page) => {
    setCurrentPage(page);
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: page * itemWidth,
        behavior: "smooth",
      });
    }
  };

  const nextSlide = () => {
    if (!data?.content?.length) return;
    const nextIndex = (currentPage + 1) % data.content.length;
    handleFetchPage(nextIndex);
  };

  const prevSlide = () => {
    if (!data?.content?.length) return;
    const prevIndex =
      currentPage - 1 < 0 ? data?.content.length - 1 : currentPage - 1;
    handleFetchPage(prevIndex);
  };

  // Auto-load next backend page near end of scroll
  const handleScroll = async () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const nearEnd = scrollWidth - scrollLeft - clientWidth < 200;

    if (
      nearEnd &&
      data.page < data.totalPages - 1 &&
      !loading &&
      data.content.length > 0
    ) {
      await fetchCategoryPage(productCategory, data.page + 1, true);
    }
  };

  // Detect overflow (true horizontal scroll)
  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;

    const updateOverflow = () => {
      setHasOverflow(el.scrollWidth > el.clientWidth);
    };

    updateOverflow();
    window.addEventListener("resize", updateOverflow);

    return () => window.removeEventListener("resize", updateOverflow);
  }, [data?.content]);

  // Auto-slider
  useEffect(() => {
    const container = containerRef.current;

    if (!hovering && data?.content?.length > 1) {
      intervalRef.current = setInterval(nextSlide, 4000);
    }

    container?.addEventListener("scroll", handleScroll);
    return () => {
      clearInterval(intervalRef.current);
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [currentPage, hovering, data, loading]);

  return (
    <section
      className="max-w-7xl mx-auto p-4 mb-10 rounded-2xl bg-transparent relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-300 dark:border-gray-700 pb-2 capitalize">
        {productCategory}
      </h2>

      <div className="relative">
        {/* Left Arrow */}
        {hasOverflow && (
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <FaChevronLeft />
          </button>
        )}

        {/* Scrollable container */}
        <motion.div
          ref={containerRef}
          className="flex space-x-4 overflow-x-auto py-2 cursor-grab scrollbar-hide"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          whileTap={{ cursor: "grabbing" }}
        >
          {!loading &&
            data?.content?.map((product, idx) => (
              <ProductCard key={product?.id || idx} product={product} />
            ))}
        </motion.div>

        {/* Right Arrow */}
        {hasOverflow && (
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <FaChevronRight />
          </button>
        )}
      </div>

      {/* Pagination Dots */}
      {hasOverflow && data?.totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: data.totalPages }).map((_, index) => {
            const active = index === data.page;
            return (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  active
                    ? "bg-orange-500 dark:bg-orange-400"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                onClick={() => handleFetchPage(index)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductsPerCategory;
