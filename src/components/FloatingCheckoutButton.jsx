import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { currencyFormater } from '../helpers/formater';
import toast from 'react-hot-toast';

const FloatingCheckoutButton = () => {
  const navigate = useNavigate();
  const cartItems = useSelector(state => state?.cart?.items);

  // Local state to handle live updates (e.g., storage events)
  const [cartTotal, setCartTotal] = useState(cartItems?.reduce((sum, item) => sum + item.unitPrice * item.qty, 0) || 0);

  // Update total whenever Redux state changes
  useEffect(() => {
    const total = cartItems?.reduce((sum, item) => sum + item.unitPrice * item.qty, 0) || 0;
    setCartTotal(total);
  }, [cartItems]);

  // Listen for localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'cartState') {
        const updatedCart = JSON.parse(event.newValue || '{}')?.items || [];
        const total = updatedCart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
        setCartTotal(total);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!cartTotal || cartTotal <= 0) return null;
  
  const handleCompleteOrder = async () => {
    toast.success("Placing order...");
  }

  return (
    <button
      onClick={handleCompleteOrder}
      className='fixed flex items-center justify-center px-4 py-2 text-white bg-orange-500 rounded-full shadow-lg bottom-6 right-6 hover:bg-orange-600 transition'
    >
      <ShoppingCart className='mr-2' size={20} />
      {/* {currencyFormater.format(cartTotal)} */}
      <span>Complete Order</span>
    </button>
  );
};

export default FloatingCheckoutButton;
