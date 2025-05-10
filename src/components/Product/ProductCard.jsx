import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState('');
  const [progress, setProgress] = useState(100);
  const [offerExpired, setOfferExpired] = useState(false);

  const discountedPrice = useMemo(() => {
    const discounted = product?.percent_discount > 0;
    if (discounted) return (product.price - (product.price * (product.percent_discount / 100))).toFixed(2);
    return product?.price?.toFixed(2);
  }, [product]);

  useEffect(() => {
    if (!product?.offerExpiresAt) return;

    const start = new Date();
    const end = new Date(product?.offerExpiresAt);
    const totalTime = end - start;

    const countdown = setInterval(() => {
      const now = new Date();
      const timeRemaining = end - now;

      if (timeRemaining <= 0) {
        clearInterval(countdown);
        setTimeLeft('');
        setOfferExpired(true);
        setProgress(0);
        return;
      }

      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);

      const percent = Math.max(0, (timeRemaining / totalTime) * 100);
      setProgress(percent.toFixed(0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [product?.offerExpiresAt]);

  const handleCardClick = () => {
    const targetProductId = (product?.productId == null || product?.productId === "") ? null : product?.productId;
    if (targetProductId != null) navigate(`/product?id=${targetProductId}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-300 ease-in-out cursor-pointer group relative"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Badge Section */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {product?.percent_discount > 0 && (
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            -{product?.percent_discount}%
          </span>
        )}
        {product?.offerExpiresAt && (
          <span className={`text-xs px-2 py-1 rounded-full ${offerExpired ? 'bg-gray-500' : 'bg-red-500 text-white'}`}>
            {offerExpired ? 'Offer Expired' : 'Limited Offer'}
          </span>
        )}
      </div>

      {/* Image */}
      <div
        className="w-full h-40 bg-gray-200 mb-4 rounded-t-lg dark:bg-gray-600"
        style={{
          backgroundImage: `url(${product?.imageUrl ?? "https://via.placeholder.com/500"})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">{product?.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{product?.category}</p>

        <div className="mt-2 flex items-center justify-between">
          {product?.percent_discount > 0 && (
            <p className="text-sm text-gray-400 line-through dark:text-gray-600">${product?.price.toFixed(2)}</p>
          )}
          <p className="font-bold text-orange-500 text-lg dark:text-orange-400">${discountedPrice}</p>
        </div>

        {/* Countdown */}
        {product?.offerExpiresAt && (
          <>
            <p className={`text-xs mt-1 ${offerExpired ? 'text-gray-400 dark:text-gray-500' : 'text-red-500 dark:text-red-400'}`}>
              {offerExpired ? 'Deal has ended' : `Ends in ${timeLeft}`}
            </p>

            {/* Progress Bar */}
            <div className="mt-1 w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
              <div
                className="h-full bg-red-500 transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </>
        )}

        <button
          onClick={handleAddToCart}
          disabled={offerExpired}
          className={`mt-4 w-full py-2 rounded-md transition ${
            offerExpired
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500'
          }`}
        >
          {offerExpired ? 'Expired' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
