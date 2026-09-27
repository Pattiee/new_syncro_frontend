import React from 'react';
import { motion } from 'framer-motion';

// Define the incoming props contract for the loader component
export interface CustomLoader2Props {
  message?: string;
}

export const CustomLoader2: React.FC<CustomLoader2Props> = ({ 
  message = "Loading..." 
}) => {
  return (
    <>
      <motion.div
        className='flex items-center justify-center w-full h-screen px-4 bg-white dark:bg-gray-900 fixed inset-0 z-50 bg-opacity-40 backdrop-blur-sm'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center">
          <div className='relative'>
            {/* Glow Pulse */}
            <div className='absolute inset-0 bg-orange-500 rounded-full opacity-50 dark:bg-gray-500 blur-lg animate-ping' />
            
            {/* Spinning ring */}
            <div className='w-16 h-16 border-4 border-orange-500 rounded-full border-t-transparent animate-spin'/>
          </div>
          <p className='mt-4 text-lg font-medium text-gray-700 dark:text-gray-300'>{message}</p>
        </div>
      </motion.div>
    </>
  );
};

export default CustomLoader2;