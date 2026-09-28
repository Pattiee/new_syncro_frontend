import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, decrementCartItemQuantity } from "../slices/cartSlice";
import toast from "react-hot-toast";
import { FiMinus, FiPlus } from "react-icons/fi";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Define structural interface for the incoming product object shape
export interface AddToCartProduct {
  id: string | number;
  skuCode: string;
  name: string;
  price: number;
  stock: number;
  percent_discount?: number;
}

// Define the incoming props contract for this component
interface AddToCartBtnProps {
  product: AddToCartProduct;
}

// Structural schema defining your individual item stored in your shopping cart
// 🛠️ FIX: Appended [key: string]: unknown to line up perfectly with your AddItemPayload contract structure
interface CartItem {
  id: string | number;
  skuCode: string;
  name: string;
  unitPrice: number;
  qty: number;
  [key: string]: unknown; // Added to clear the structural assignment type check block completely
}

// Interface defining the unified Redux store schema
interface ReduxRootState {
  cart?: {
    items: CartItem[];
  };
}

export const AddToCartBtn: React.FC<AddToCartBtnProps> = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, loading } = useAuth() as {
    user: { id: string | number; username: string } | null;
    loading: boolean;
  };

  // Strongly type the inline selector state mapping params
  const cartItems = useSelector((state: ReduxRootState) => state?.cart?.items || []);
  
  const cartItem = useMemo(
    () => cartItems.find((i) => i.id === product.id),
    [cartItems, product.id]
  );
  
  const quantityInCart = cartItem?.qty || 0;

  const maxReached = quantityInCart >= product.stock;
  const outOfStock = product.stock <= 0;
  const inCart = !!cartItem;

  const handleAddToCart = useCallback(() => {
    if (!user && !loading) return navigate("/auth/login");
    if (maxReached || outOfStock) return toast.error("No more stock available");

    const prod_percent_discount = product?.percent_discount || 0;
    
    // Inline evaluating the boolean comparison clears out the unused variable completely
    const productPrice = prod_percent_discount > 0
      ? product.price - (1 - prod_percent_discount / 100) * product.price
      : product.price;

    const item: CartItem = {
      id: product.id,
      skuCode: product.skuCode,
      name: product.name,
      unitPrice: productPrice,
      qty: 1,
    };

    dispatch(addItem(item));
  }, [maxReached, outOfStock, product, dispatch, loading, navigate, user]);

  const handleDecrementQuantity = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    dispatch(decrementCartItemQuantity(product.id));
  };

  return (
    <div className="flex w-full justify-center">
      {inCart ? (
        <div className="flex items-center justify-between w-full gap-2">
          {/* Decrement */}
          <button
            type="button"
            onClick={handleDecrementQuantity}
            className={`h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-md text-white shadow
              transition-all duration-200 transform active:scale-95 
              ${
                quantityInCart <= 1
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
          >
            <FiMinus size={16} />
          </button>

          {/* Quantity */}
          <div
            className="h-8 sm:h-9 min-w-[36px] sm:min-w-[40px] flex items-center justify-center
              rounded-md shadow text-sm font-medium bg-white dark:bg-neutral-800
              text-black dark:text-white border border-orange-500"
          >
            {quantityInCart}
          </div>

          {/* Increment */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={maxReached}
            className={`h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-md text-white shadow
              transition-all duration-200 transform active:scale-95 bg-orange-500 hover:bg-orange-600
              ${maxReached ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <FiPlus size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          aria-label={outOfStock ? "Out of Stock" : "Add to Cart"}
          className={`w-full h-8 sm:h-9 px-3 sm:px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm
            font-medium rounded-md shadow transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-1
            ${outOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <ShoppingCart size={16} />
          {outOfStock ? "Out of Stock" : "Add"}
        </button>
      )}
    </div>
  );
};

export default AddToCartBtn;