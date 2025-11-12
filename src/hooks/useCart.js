import { useSelector } from "react-redux";

export const useCart = () => {
  const cart = useSelector((state) => state?.cart);
  const cartItems = cart?.items || [];
  const cartTotals = cartItems.reduce(
    (sum, item) => sum + item?.unitPrice * item?.qty,
    0
  );
  const isEmpty = cartItems.length < 1;
  return { cartItems, cartTotals, isEmpty };
};
