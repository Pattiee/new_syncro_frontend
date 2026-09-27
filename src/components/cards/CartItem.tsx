import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormater } from '../../hooks/useFormater';

// Structural data contract interface mapping full cart item model properties
export interface SharedCartItemRecord {
  id: string | number;
  name: string;
  unitPrice: number;
  qty: number;
  skuCode?: string;
  [key: string]: unknown; // Fallback mapping for dynamic parameters
}

// Define the incoming props contract for the component wrapper
export interface CartItemProps {
  item: SharedCartItemRecord | null | undefined;
  removeItem: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, removeItem }) => {
  const { currencyFormater } = useFormater();
  const navigate = useNavigate();

  // Early guard to prevent destructuring undefined or null values
  if (!item) return null;

  const { id, name, unitPrice, qty } = item;

  const handleNavigateToProduct = (productId: string | number): void => {
    navigate(`/product?id=${productId}`);
  };

  return (
    <div className='flex bg-orange-100 dark:bg-gray-700 justify-between items-center rounded-lg p-2 border border-transparent dark:border-gray-600/50 shadow-sm'>
      <div 
        className='flex flex-col justify-between w-full px-2 rounded-md cursor-pointer group'
        onClick={() => handleNavigateToProduct(id)}
      >
        <div>
          <p className='font-semibold text-gray-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-150'>
            {name}
          </p>
        </div>

        <div className='flex justify-between mt-1 text-sm'>
          <p className='text-gray-500 dark:text-gray-400'>
            {currencyFormater.format(unitPrice)} x {qty}
          </p>
          <p className='font-medium text-gray-800 dark:text-gray-300 tabular-nums'>
            {currencyFormater.format(unitPrice * qty)}
          </p>
        </div>
      </div>

      <button
        type='button'
        onClick={removeItem}
        className='flex justify-center transition items-center px-4 text-sm text-red-500 hover:text-red-600 hover:font-semibold focus:outline-none'
        aria-label={`Remove ${name} from cart`}
      >
        X
      </button>
    </div>
  );
};

export default CartItem;