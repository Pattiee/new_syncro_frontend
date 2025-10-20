import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/Product/ProductCard';

const ProductsPerCategory = ({ productCategory = '', products = [] }) => {
  const { loading } = useProducts();
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemWidth = 200; // min-w-[180px] + margin adjustment
  const intervalRef = useRef(null);

  const scrollToIndex = index => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    const nextIndex = currentIndex + 1 >= products.length ? 0 : currentIndex + 1;
    scrollToIndex(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = currentIndex - 1 < 0 ? products.length - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
  };


  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 3000);
    return () => clearInterval(intervalRef.current);
  }, [currentIndex]);

  return (
    <div className="max-w-6xl mx-auto p-4 rounded-2xl bg-transparent relative">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-300 pb-2">
        {productCategory}
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
          className="flex space-x-4 overflow-x-auto py-2 cursor-grab scrollbar-hide"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          whileTap={{ cursor: 'grabbing' }}
        >
          {/* {!loading && products.map((product, index) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.03 }}
              className="min-w-[180px] flex-shrink-0 bg-white dark:bg-gray-800 shadow rounded-lg p-4 hover:shadow-lg transition transform"
            >
              <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 mb-4 rounded-lg overflow-hidden flex items-center justify-center">
                {(product?.imageUrl) ? (
                  <img
                    draggable={false}
                    src={product?.imageUrl[0] || 'https://via.placeholder.com/300x400'}
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
          ))} */}

          {products && !loading && products.map((product, idx) => <ProductCard key={product?.id || idx} product={product}/> )}
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
        {products.map((_, index) => (
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

export default ProductsPerCategory;
