import { useSelector } from 'react-redux';

export const useCart = () => {
    const { error, items, loading } = useSelector(state => state?.cart);
  return { error, items, loading }
}
