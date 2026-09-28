import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useFormater } from '../hooks/useFormater';

// Structural interface defining an individual item stored in your shopping cart
export interface FloatingCartItem {
  id: string | number;
  unitPrice: number;
  qty: number;
  name?: string;
  [key: string]: unknown;
}

// Interface representing the slice container for your cart
interface CartStateSlice {
  items: FloatingCartItem[];
}

// Interface defining the unified Redux store schema
interface ReduxRootState {
  cart?: CartStateSlice;
}

export const FloatingCheckoutButton: React.FC = () => {
  const navigate = useNavigate();
  const { currencyFormater } = useFormater();
  
  // Strongly type the inline selector state criteria parameters
  const cartItems = useSelector((state: ReduxRootState) => state?.cart?.items);

  // Local state to handle live updates (e.g., storage events)
  const [cartTotal, setCartTotal] = useState<number>(
    cartItems?.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.qty || 0), 0) || 0
  );

  // Update total whenever Redux state changes
  useEffect(() => {
    const total = cartItems?.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.qty || 0), 0) || 0;
    setCartTotal(total);
  }, [cartItems]);

  // Listen for localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent): void => {
      if (event.key === 'cartState' && event.newValue) {
        try {
          const parsedState = JSON.parse(event.newValue);
          const updatedCart: FloatingCartItem[] = parsedState?.items || [];
          const total = updatedCart.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.qty || 0), 0);
          setCartTotal(total);
        } catch (error) {
          console.error("Failed to parse cross-tab storage synchronization data:", error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!cartTotal || cartTotal <= 0) {
    return null;
  }
  
  const handleCompleteOrder = async (): Promise<void> => {
    toast.success("Placing order...");
    navigate('/checkout');
  };

  return (
    <button
      type="button"
      onClick={handleCompleteOrder}
      className='fixed flex items-center justify-center px-4 py-2 text-white bg-orange-500 rounded-full shadow-lg bottom-6 right-6 hover:bg-orange-600 transition z-50'
    >
      <ShoppingCart className='mr-2' size={20} />
      
      {/* Example currency print formatting wrapper: */}
      <span className="mr-2 font-medium">{currencyFormater.format(cartTotal)}</span>
      <span>Complete Order</span>
    </button>
  );
};

export default FloatingCheckoutButton;