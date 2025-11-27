import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormater } from "../../hooks/useFormater";

export const OrderCard = ({ order }) => {
  const { id, code, status, timeStamp } = order;
  const { dateFormater } = useFormater();
  const navigate = useNavigate();

  const handleShowOrderDetails = () => {
    if (id) navigate(`/order/${id}`);
  };

  return (
    <motion.div
      onClick={handleShowOrderDetails}
      className="flex flex-col gap-2 p-4 my-2 bg-gray-100 rounded-lg shadow dark:bg-gray-700"
    >
      <div className="flex p-2 items-center justify-between">
        <span className="font-semibold text-orange-600 dark:text-orange-400">
          Order: {code}
        </span>
        <span className="font-medium">
          {dateFormater.format(new Date(timeStamp))}
        </span>
        <span
          className={`text-sm px-2 py-1 rounded-full ${
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
