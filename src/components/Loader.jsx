import { motion } from 'framer-motion';

export const Loader = ({ message = "Loading..." }) => {
  
  
  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-xl">
          {/* Spinner */}
          <div className="w-10 h-10 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
              <p className="font-medium text-gray-700">{message}</p>
        </div>
        </motion.div>
      </>
  );
};
