import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFormater } from "../../hooks/useFormater";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { currencyFormater, percentageFormater } = useFormater();

  const discounted = product?.percent_discount > 0;
  const discountPrice = discounted
    ? product.price - (product.price * product.percent_discount) / 100
    : product?.price;

  const handleCardClick = () => navigate(`/product?id=${product?.id ?? ""}`);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group min-w-[200px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        {product?.imageUrls?.[0] ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            draggable={false}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-gray-400 dark:text-gray-500">No Image</span>
        )}

        {/* Discount Tag */}
        {product?.percent_discount > 0 && (
          <span className="absolute top-3 right-3 bg-transparent text-orange-500 text-xs font-semibold px-2 py-1">
            -{percentageFormater.format(product?.percent_discount)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col justify-between">
        {/* Name and price */}
        <div className="flex items-center justify-between">
          <span className="text-base pr-1 tracking-tight text-gray-900 dark:text-gray-100 truncate">
            {product.name}
          </span>
          <span className="text-balance font-bold text-orange-600 dark:text-orange-400">
            {currencyFormater.format(discountPrice)}
          </span>
        </div>

        {/* Specs string */}
        <div className="flex justify-between">
          <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
            {product?.specs || ""}
          </span>
          {/* {product?.percent_discount > 0 && (
            <span className="text-xs line-through text-gray-400 dark:text-gray-500">
              ${product.price.toFixed(2)}
            </span>
          )} */}

          {/* <motion.button
            whileTap={{ scale: 0.9 }}
            title="Add to Cart"
            className="p-2 rounded-full shadow-md hover:shadow-lg transition"
          >
            <span>
              <ShoppingCart className="" size={18} color="orange" />
            </span>
          </motion.button> */}
        </div>
      </div>
    </motion.div>
  );
};
