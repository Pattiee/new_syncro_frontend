import React from 'react';
import { motion } from 'framer-motion';

// Define the incoming props contract for the loader component
export interface CustomLoader1Props {
  message?: string;
}

export const CustomLoader1: React.FC<CustomLoader1Props> = ({ 
  message = "Loading..." 
}) => {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/40 bg-opacity-40 backdrop-blur-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
          {/* Spinner */}
          <div className="w-10 h-10 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="font-medium text-gray-700 dark:text-gray-200 text-sm">{message}</p>
        </div>
      </motion.div>
    </>
  );
};

export default CustomLoader1;