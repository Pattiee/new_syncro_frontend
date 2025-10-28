import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const discountedPrice =
    product?.percent_discount > 0
      ? (product.price - product.price * (product.percent_discount / 100)).toFixed(2)
      : product?.price?.toFixed(2);

  const handleCardClick = () => navigate(`/product?id=${product?.id ?? ""}`);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group min-w-[200px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
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
          <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
            -{product.percent_discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-2">
          {product.category}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {product?.percent_discount > 0 && (
              <span className="text-xs line-through text-gray-400 dark:text-gray-500">
                ${product.price.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
              ${discountedPrice}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            title="Add to Cart"
            className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-300 text-white dark:text-gray-900 rounded-full shadow-md hover:shadow-lg transition"
          >
            <ShoppingCart size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
