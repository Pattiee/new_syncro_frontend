import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const OrderCard = ({ order }) => {
  const { id, code, status, timeStamp, totals } = order;
  const navigate = useNavigate();

  const handleShowOrderDetails = () => {
    if (id) navigate(`/order?id=${id}`);
  }

  return (
    <motion.div onClick={handleShowOrderDetails} className="flex flex-col gap-2 p-4 bg-gray-100 rounded-lg shadow dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-orange-600 dark:text-orange-400">Order #{code}</span>
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            status === 'Cancelled'
              ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-100'
              : status === 'Delivered'
              ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100'
              : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
          }`}>
          {status}
        </span>
      </div>

      <div className="text-sm text-gray-700 dark:text-gray-300">
        Placed on: <span className="font-medium">{timeStamp}</span>
      </div>

      {totals != null && (
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Total: <span className="text-orange-500 dark:text-orange-300">KSh {totals}</span>
        </div>
      )}
    </motion.div>
  );
};
