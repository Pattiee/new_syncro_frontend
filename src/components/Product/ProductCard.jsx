import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AddToCartBtn from '../AddToCartBtn';
import { FiStar } from 'react-icons/fi';
import { currencyFormater, percentageFormater } from '../../helpers/formater';

const ProductCard = ({ product }) => {
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

    const end = new Date(product.offerExpiresAt);
    if (isNaN(end.getTime())) return;

    const start = new Date();
    const totalTime = end - start;

    const updateCountdown = () => {
      const now = new Date();
      const timeRemaining = end - now;

      if (timeRemaining <= 0) {
        setTimeLeft('');
        setOfferExpired(true);
        setProgress(0);
        return false;
      }

      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);

      const percent = Math.max(0, (timeRemaining / totalTime) * 100);
      setProgress(percent.toFixed(0));

      return true;
    };

    updateCountdown();
    const interval = setInterval(() => {
      const shouldContinue = updateCountdown();
      if (!shouldContinue) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [product?.offerExpiresAt]);

  const handleCardClick = () => {
    const targetProductId = product?.id ?? '';
    if (targetProductId) navigate(`/product?id=${targetProductId}`);
  };

  return (
    <motion.div
      className="relative overflow-hidden transition duration-300 ease-in-out bg-white rounded-lg shadow-md cursor-pointer dark:bg-gray-800 hover:shadow-xl group"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Badge Section */}
      <div className="absolute flex flex-row items-center justify-between w-full gap-1 px-2 bg-transparent top-2">
        <div className="flex flex-col top-2 left-2">
          {product?.percent_discount > 0 && (
            <span className="px-2 py-1 text-xs text-white bg-orange-500 rounded-full">
              -{percentageFormater.format(product?.percent_discount / 100)}
            </span>
          )}
          {product?.offerExpiresAt && (
            <span className={`text-xs px-2 py-1 rounded-full ${offerExpired ? 'bg-gray-500' : 'bg-red-500 text-white'}`}>
              {offerExpired ? 'Offer Expired' : 'Limited Offer'}
            </span>
          )}
        </div>

        <div className="px-2">
          {product?.featured && (
            <span className="flex items-center justify-center text-orange-500 transition-all duration-300 transform bg-transparent rounded-full dark:text-orange-500 active:scale-90">
              <FiStar size={20} color="orange" />
            </span>
          )}
        </div>
      </div>

      {/* Image */}
      <div
        onClick={handleCardClick}
        className="w-full h-40 bg-gray-200 rounded-t-lg dark:bg-gray-600"
        style={{
          backgroundImage: `url(${Array.isArray(product?.imageUrls) ? product.imageUrls[0] : product?.imageUrls || "https://via.placeholder.com/500"})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Info */}
      <div className="p-2">
        <div className='flex justify-between'>

          {/* Name */}
          <div className='flex flex-col justify-between mt-2'>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">{product?.name}</h3>
            <p className="text-sm font-thin text-gray-500 dark:text-gray-500">{product?.category}</p>
          </div>
          
          {/* Price */}
          <div className='flex flex-col items-center justify-between mt-2'>
            <p className="text-lg font-bold text-orange-500 dark:text-orange-400">{currencyFormater.format(discountedPrice)}</p>
            {product?.percent_discount > 0 && (
              <p className="text-sm text-gray-400 line-through dark:text-gray-600">${product?.price.toFixed(2)}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          
          
        </div>

        {/* Countdown */}
        {product?.offerExpiresAt && (
          <>
            <p className={`text-xs mt-1 ${offerExpired ? 'text-gray-400 dark:text-gray-500' : 'text-red-500 dark:text-red-400'}`}>
              {offerExpired ? 'Deal has ended' : `Ends in ${timeLeft}`}
            </p>

            {/* Progress Bar */}
            <div className="w-full h-2 mt-1 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
              <div
                className="h-full transition-all duration-1000 ease-linear bg-red-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </>
        )}

        <span className='text-sm text-gray-500'>
          {product.desc}
        </span>

        <AddToCartBtn product={product} />
      </div>
    </motion.div>
  );
};

export default ProductCard;
