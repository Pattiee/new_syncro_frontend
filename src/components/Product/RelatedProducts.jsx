import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const RelatedProducts = ({ products }) => {
  const displayProducts = products || [...Array(8)].map((_, i) => ({
    id: i,
    name: `Product ${i + 1}`,
    category: 'Category',
    price: 39.99,
    image: null,
  }));

  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemWidth = 200; // min-w-[180px] + margin adjustment
  const intervalRef = useRef(null);

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
    const nextIndex = currentIndex + 1 >= displayProducts.length ? 0 : currentIndex + 1;
    scrollToIndex(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = currentIndex - 1 < 0 ? displayProducts.length - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
  };

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 3000);
    return () => clearInterval(intervalRef.current);
  }, [currentIndex]);

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
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.05 }}
              className="min-w-[180px] flex-shrink-0 bg-white dark:bg-gray-800 shadow rounded-lg p-4 hover:shadow-lg transition transform"
            >
              <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 mb-4 rounded-lg overflow-hidden flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">No Image</span>
                )}
              </div>

              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{product.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
              <p className="mt-2 font-bold text-orange-500 dark:text-orange-400">${product.price.toFixed(2)}</p>
            </motion.div>
          ))}
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
        {displayProducts.map((_, index) => (
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
