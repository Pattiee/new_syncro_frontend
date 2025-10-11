import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { currencyFormater } from '../../helpers/formater';

const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();
  const discountedPrice =
    product?.percent_discount > 0
      ? (product.price - product.price * (product.percent_discount / 100)).toFixed(2)
      : product?.price?.toFixed(2);

  const handleCardClick = () => navigate(`/product?id=${product?.id ?? ''}`);

  return (
    <motion.div
      className="relative flex flex-col justify-between shadow-md rounded-xl cursor-pointer bg-white dark:bg-gray-800 hover:shadow-lg overflow-hidden"
      style={{ aspectRatio: '3/4' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
    >
      {/* Featured Star */}
      {product.featured && (
        <FiStar
          size={20}
          color="orange"
          className="absolute top-2 left-2 z-10"
          title="Featured"
        />
      )}

      {/* Discount Text */}
      {product?.percent_discount > 0 && (
        <span className="absolute top-2 right-2 text-orange-500 font-semibold text-sm z-10">
          -{product.percent_discount}%
        </span>
      )}

      {/* Image */}
      <div
        onClick={handleCardClick}
        className="w-full h-3/4 flex items-center justify-center overflow-hidden"
      >
        <img
          src={product?.imageUrl || product?.imageUrls?.[0] || 'https://via.placeholder.com/300x400'}
          alt={product?.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-2 h-1/4 flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
          {product?.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {product?.desc || 'No description'}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
            {currencyFormater.format(discountedPrice)}
          </p>
          {product?.percent_discount > 0 && (
            <p className="text-xs text-gray-400 line-through dark:text-gray-600">
              {currencyFormater.format(product.price)}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
