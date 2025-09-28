import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, decrementCartItemQuantity } from '../slices/cartSlice';
import toast from 'react-hot-toast';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { ShoppingCart } from 'lucide-react';
import { useKeycloak } from '@react-keycloak/web';
import { addToCart } from '../services/cart.service';

const AddToCartBtn = ({ product }) => {
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const [desiredQty, setDesiredQty] = useState(1);
  const userId = keycloak.authenticated ? keycloak.tokenParsed.sub : '';
  const cartItems = useSelector(state => state?.cart?.items);
  const cartItem = useMemo(() => cartItems.find(i => i.id === product.id), [cartItems, product.id]);
  const quantityInCart = cartItem?.quantity || 0;

  const maxReached = quantityInCart >= product.stock;
  const outOfStock = product.stock <= 0;
  const inCart = !!cartItem;

  const handleAddToCart = useCallback(() => {
    if (maxReached || outOfStock) return toast.error('No more stock available');
    if (!userId) return keycloak.login();


    const discounted = product?.percent_discount > 0;
    const productPrice = discounted
      ? product.price - (product.percent_discount / 100) * product.price
      : product.price;
    
    const item = {
      id: product.id,
      uid: userId,
      name: product.name,
      unitPrice: productPrice,
      quantity: desiredQty,
      skuCode: product.skuCode,
    };

    addToCart(item).then(res => {
      console.log(res);
    });

    // dispatch(addItem(item));
  }, [product, keycloak, userId, maxReached, outOfStock, desiredQty]);

  const handleDecrementQuantity = e => {
    e.stopPropagation();
    dispatch(decrementCartItemQuantity(product?.id ?? ''));
  };

  const baseButtonStyles = 'h-10 w-10 flex items-center justify-center rounded-full text-white shadow transition-all duration-300 transform active:scale-90 select-none';
  const disabledStyles = maxReached || outOfStock ? 'opacity-50 cursor-not-allowed' : '';

  // Fixed width for container — tweak as needed to fit your layout nicely
  const containerMinWidth = 'min-w-[140px]';

  return (
    <div className={`flex w-full justify-center ${containerMinWidth}`}>
      {inCart ? (
        <div className="flex items-center justify-center w-full gap-3 sm:gap-4">
          {/* Decrement */}
          <button
            onClick={handleDecrementQuantity}
            className={`${baseButtonStyles} ${
              quantityInCart <= 1 ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            <FiMinus size={20} />
          </button>

          {/* Quantity */}
          <div
            className="h-10 sm:h-12 min-w-[40px] sm:min-w-[48px] px-2 flex items-center justify-center 
              rounded-full shadow text-sm sm:text-base font-medium select-none
              bg-white dark:bg-neutral-800 text-black dark:text-white border border-orange-500"
          >
            {quantityInCart}
          </div>

          {/* Increment */}
          <button
            onClick={handleAddToCart}
            disabled={maxReached}
            className={`${baseButtonStyles} bg-orange-500 hover:bg-orange-600 font-bold ${disabledStyles}`}
          >
            <FiPlus size={20} />
          </button>
        </div>
      ) : (
          <>
            <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label={outOfStock ? 'Out of Stock' : 'Add to Cart'}
            className={`h-10 px-6 bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base font-medium 
              rounded-full shadow transition-all duration-300 transform active:scale-95 select-none w-full 
              flex items-center justify-center gap-2 ${disabledStyles}`}>
                <ShoppingCart size={20} />
                { outOfStock ? 'Out of Stock' : 'Add' }
                </button>

          </>
      )}
    </div>
  );
};

export default AddToCartBtn;
