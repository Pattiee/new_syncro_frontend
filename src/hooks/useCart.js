import { useSelector } from 'react-redux';

export const useCart = () => {
  const cart = useSelector(state => state?.cart);
  return { cart };
}
