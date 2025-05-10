import React from 'react';
import { motion } from 'framer-motion';

const RelatedProducts = () => {
  return (
    <div className="mt-16">
      <h2 className="text-xl font-semibold text-primary dark:text-primary mb-6">
        Related Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow rounded-lg p-4 hover:shadow-lg transition"
          >
            <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 mb-4 rounded-lg" />
            <h3 className="text-lg font-medium">Product {i + 1}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
            <p className="mt-2 font-bold text-primary">$39.99</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
