import React from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

// Explicit interface shape matching your custom cart hook's return layout contract
interface CartHookResult {
  cartItems: Array<{
    id: string | number;
    [key: string]: unknown;
  }>;
  cartTotals: number;
  isEmpty: boolean;
}

export const NavbarCartIcon: React.FC = () => {
  const navigate = useNavigate();
  
  // Cast the hook result securely to prevent implicit 'any' tracing flags
  const { cartItems } = useCart() as CartHookResult;

  const handleNavigateToCart = (): void => {
    navigate("/cart");
  };

  return (
    <button
      type="button"
      onClick={handleNavigateToCart}
      aria-label="View Cart"
      className="relative flex items-center justify-center p-1 mx-2 rounded-full hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
    >
      {/* Cart Icon */}
      <ShoppingCart size={24} />

      {/* Badge */}
      {cartItems?.length > 0 && (
        <span
          className="absolute -top-1 -right-2 flex items-center justify-center
                     w-4 h-4 text-[10px] font-bold bg-red-600 text-white
                     rounded-full shadow-md select-none"
        >
          {cartItems.length}
        </span>
      )}
    </button>
  );
};

export default NavbarCartIcon;