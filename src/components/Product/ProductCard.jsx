import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useProducts } from '../../hooks/useProducts';
import { useNavigate } from 'react-router-dom';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const discountedPrice =
    product?.percent_discount > 0
      ? (product.price - product.price * (product.percent_discount / 100)).toFixed(2)
      : product?.price?.toFixed(2);

  const handleCardClick = () => navigate(`/product?id=${product?.id ?? ''}`);


  return (
    <div>
        <motion.div
            key={product.id}
              whileHover={{ scale: 1.01 }}
              className="min-w-[180px] flex-shrink-0 bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg transition transform"
            >
              <div
                onClick={handleCardClick}
                className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                {product?.imageUrls ? (
                  <img
                    draggable={false}
                    src={product?.imageUrls[0] || 'https://via.placeholder.com/300x400'}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">No Image</span>
                )}
              </div>

              <div className='flex flex-col p-4'>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                <p className="mt-2 font-bold text-orange-500 dark:text-orange-400">${discountedPrice}</p>
              </div>

        </motion.div>
    </div>
  )
}
