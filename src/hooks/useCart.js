import { useSelector } from 'react-redux';

export const useCart = () => {
  const cart = useSelector(state => state?.cart);
  const cartItems = cart?.items || [];
  const cartTotals = cartItems.reduce((sum, item) => sum + item?.unitPrice * item?.qty, 0);
  return { cartItems, cartTotals };
}
