import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Define the structural data contract for a Single Product record
export interface RelatedProductData {
  id: string | number;
  name: string;
  category: string;
  price: number;
  percent_discount?: number;
  imageUrl?: string;
  imageUrls?: string[];
}

// Define the incoming props contract for the component wrapper
export interface RelatedProductProps {
  product: RelatedProductData;
}

export const RelatedProduct: React.FC<RelatedProductProps> = ({ product }) => {
  const navigate = useNavigate();

  const discountedPrice =
    product?.percent_discount && product.percent_discount > 0
      ? (product.price - product.price * (product.percent_discount / 100)).toFixed(2)
      : product?.price?.toFixed(2) || "0.00";

  const handleCardClick = (): void => {
    navigate(`/product?id=${product?.id ?? ''}`);
  };

  return (
    // Moved key statement to the top-most level element returned inside mapping sets
    <div key={product.id}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="min-w-[180px] flex-shrink-0 bg-white dark:bg-gray-800 shadow rounded-lg p-4 hover:shadow-lg transition transform"
      >
        <div
          onClick={handleCardClick}
          className="w-full h-40 bg-gray-200 dark:bg-gray-700 mb-4 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
        >
          {product?.imageUrl || product?.imageUrls ? (
            <img
              src={product?.imageUrl || product?.imageUrls?.[0] || 'https://via.placeholder.com/300x400'}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-sm">No Image</span>
          )}
        </div>

        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {product.category}
        </p>
        <p className="mt-2 font-bold text-orange-500 dark:text-orange-400">
          \${discountedPrice}
        </p>
      </motion.div>
    </div>
  );
};

export default RelatedProduct;