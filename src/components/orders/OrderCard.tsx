import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useFormater } from "../../hooks/useFormater";

// Structural data contract interface mapping full user order card entity fields
export interface UserOrderCardData {
  id: string | number;
  code: string;
  status: string;
  timeStamp: string | number | Date;
  [key: string]: unknown; // Fallback mapping for dynamic properties
}

// Define the incoming props contract for the component wrapper
export interface OrderCardProps {
  order: UserOrderCardData | null | undefined;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();
  const { dateFormater } = useFormater();

  // Early guard to prevent destructuring undefined or null values
  if (!order) return null;

  const { id, code, status, timeStamp } = order;

  const handleShowOrderDetails = (): void => {
    if (id) {
      navigate(`/order/${id}`);
    }
  };

  // Safe fallback date construction parameters
  const parsedDate = timeStamp ? new Date(timeStamp) : new Date();

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleShowOrderDetails}
      className="flex flex-col gap-2 p-4 my-2 bg-gray-100 rounded-lg shadow dark:bg-gray-700 cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
    >
      <div className="flex p-2 items-center justify-between text-sm sm:text-base">
        <span className="font-semibold text-orange-600 dark:text-orange-400">
          Order: {code}
        </span>
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {dateFormater.format(parsedDate)}
        </span>
        <span
          className={`text-xs sm:text-sm px-3 py-1 rounded-full font-medium ${
            status === "Cancelled"
              ? "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-100"
              : status === "Delivered"
              ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100"
              : "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
          }`}
        >
          {status}
        </span>
      </div>
    </motion.div>
  );
};

export default OrderCard;