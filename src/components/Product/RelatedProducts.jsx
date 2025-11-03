import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from './ProductCard';

const RelatedProducts = ({ productCategory = '', productId = '' }) => {
  const { products, loading } = useProducts();
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemWidth = 200; // min-w-[180px] + margin adjustment
  const intervalRef = useRef(null);

   // Get products for this category only
  const categoryProducts = Array.isArray(products[productCategory]?.content) ? products[productCategory]?.content : [];
  const pg = products[productCategory]?.page;
  const te = products[productCategory]?.totalElements;
  const tp = products[productCategory]?.totalPages;
  console.log("PG: ", pg);
  console.log("TE: ", te);
  console.log("TP: ", tp);

  console.log(categoryProducts);

  // Exclude the current product
  const related = categoryProducts?.filter(p => p.id !== productId) || [];

  const scrollToIndex = (index) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    const nextIndex = currentIndex + 1 >=related.length ? 0 : currentIndex + 1;
    scrollToIndex(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = currentIndex - 1 < 0 ? related.length - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
  };

  // useEffect(() => {
  //   intervalRef.current = setInterval(nextSlide, 3000);
  //   return () => clearInterval(intervalRef.current);
  // }, [currentIndex]);

  return (
    <div className="mt-16 max-w-6xl mx-auto px-4 relative">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-300 pb-2">
        Related Products
      </h2>

      {/* Carousel */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FaChevronLeft />
        </button>

        {/* Scrollable container */}
        <motion.div
          ref={containerRef}
          className="flex space-x-4 overflow-x-auto py-2 cursor-grab"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          whileTap={{ cursor: 'grabbing' }}
        >
          {!loading && related !== null && related.map((product, index) => <ProductCard key={index} product={product}/>)}
        </motion.div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {!loading && related.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition ${
              index === currentIndex ? 'bg-orange-500 dark:bg-orange-400' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
