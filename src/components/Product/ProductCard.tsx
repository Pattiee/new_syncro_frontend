import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useFormater } from "../../hooks/useFormater";

// Structural data contract interface mapping full product card entity fields
export interface CardProductItem {
  id: string | number;
  name: string;
  price: number;
  percent_discount?: number;
  imageUrls?: string[];
  specs?: string;
  [key: string]: unknown; // Fallback mapping for additional parameters
}

// Define the incoming props contract for the component wrapper
export interface ProductCardProps {
  product: CardProductItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { currencyFormater, percentageFormater } = useFormater();

  const percentDiscount = product?.percent_discount || 0;
  const discounted = percentDiscount > 0;
  
  const discountPrice = discounted
    ? product.price - (product.price * percentDiscount) / 100
    : product?.price || 0;

  const handleCardClick = (): void => {
    navigate(`/product?id=${product?.id ?? ""}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group min-w-[200px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        {product?.imageUrls?.[0] ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            draggable={false}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-gray-400 dark:text-gray-500 text-sm">No Image</span>
        )}

        {/* Discount Tag */}
        {percentDiscount > 0 && (
          <span className="absolute top-3 right-3 bg-transparent text-orange-500 text-xs font-semibold px-2 py-1">
            -{percentageFormater.format(percentDiscount)}
          </span>
        )}
      </div>

      {/* Info Breakdown Container */}
      <div className="p-4 flex flex-col justify-between">
        {/* Name and price layout grid */}
        <div className="flex items-center justify-between">
          <span className="text-base pr-1 tracking-tight text-gray-900 dark:text-gray-100 truncate">
            {product.name}
          </span>
          <span className="text-balance font-bold text-orange-600 dark:text-orange-400">
            {currencyFormater.format(discountPrice)}
          </span>
        </div>

        {/* Specs summary string layout */}
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
            {product?.specs || ""}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;