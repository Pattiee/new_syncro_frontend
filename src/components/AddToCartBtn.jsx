import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, decrementCartItemQuantity } from '../slices/cartSlice';
import toast from 'react-hot-toast';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AddToCartBtn = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const cartItems = useSelector(state => state?.cart?.items);
  const cartItem = useMemo(() => cartItems.find(i => i.id === product.id), [cartItems, product.id]);
  const quantityInCart = cartItem?.qty || 0;

  const maxReached = quantityInCart >= product.stock;
  const outOfStock = product.stock <= 0;
  const inCart = !!cartItem;

  const handleAddToCart = useCallback(() => {
    if (!user && !loading) return navigate('/auth/login');
    if (maxReached || outOfStock) return toast.error('No more stock available');

    const discounted = product?.percent_discount > 0;
    const productPrice = discounted
      ? product.price - (product.percent_discount / 100) * product.price
      : product.price;
    
    const item = {
      id: product.id,
      name: product.name,
      unitPrice: productPrice,
      qty: 1,
    };

    dispatch(addItem(item));
  }, [maxReached, outOfStock, product, dispatch, loading]);

  const handleDecrementQuantity = e => {
    e.stopPropagation();
    dispatch(decrementCartItemQuantity(product.id));
  };

  return (
    <div className="flex w-full justify-center">
      {inCart ? (
        <div className="flex items-center justify-between w-full gap-2">
          {/* Decrement */}
          <button
            onClick={handleDecrementQuantity}
            className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full text-white shadow
              transition-all duration-300 transform active:scale-90 select-none
              ${quantityInCart <= 1 ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            <FiMinus size={16} />
          </button>

          {/* Quantity */}
          <div className="h-8 sm:h-10 min-w-[36px] sm:min-w-[40px] flex items-center justify-center 
            rounded-full shadow text-xs sm:text-sm font-medium select-none bg-white dark:bg-neutral-800
            text-black dark:text-white border border-orange-500">
            {quantityInCart}
          </div>

          {/* Increment */}
          <button
            onClick={handleAddToCart}
            disabled={maxReached}
            className={`h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full text-white shadow
              transition-all duration-300 transform active:scale-90 select-none bg-orange-500 hover:bg-orange-600
              ${maxReached ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FiPlus size={16} />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          aria-label={outOfStock ? 'Out of Stock' : 'Add to Cart'}
          className={`w-full h-8 sm:h-10 px-2 sm:px-4 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm
            font-medium rounded-full shadow transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-1
            ${outOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ShoppingCart size={16} />
          {outOfStock ? 'Out of Stock' : 'Add'}
        </button>
      )}
    </div>
  );
};

export default AddToCartBtn;
