import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ message }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-xl">
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </motion.div>
  );
};

export default Loader;
