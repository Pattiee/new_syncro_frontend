import { useSelector } from "react-redux";

// Structural interface defining an individual item stored in your shopping cart
export interface CartItemRecord {
  id: string | number;
  name: string;
  unitPrice: number;
  qty: number;
  skuCode?: string;
  [key: string]: unknown; // Fallback mapping for additional parameters
}

// Interface representing the slice container for your cart
interface CartStateSlice {
  items: CartItemRecord[];
}

// Interface defining the unified Redux store schema
interface ReduxRootState {
  cart?: CartStateSlice;
}

export const useCart = () => {
  // Strongly type the inline selector state criteria parameters
  const cart = useSelector((state: ReduxRootState) => state?.cart);
  
  const cartItems: CartItemRecord[] = cart?.items || [];
  
  const cartTotals: number = cartItems.reduce(
    (sum, item) => sum + (item?.unitPrice || 0) * (item?.qty || 0),
    0
  );
  
  const isEmpty: boolean = cartItems.length < 1;
  
  return { cartItems, cartTotals, isEmpty };
};