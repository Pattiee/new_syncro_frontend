import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

const NavbarCartIcon = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const handleNavigateToCart = () => navigate("/cart");

  return (
    <button
      onClick={handleNavigateToCart}
      aria-label="View Cart"
      className="relative flex items-center justify-center p-1 mx-2 rounded-full hover:text-orange-500 transition-colors"
    >
      {/* Cart Icon */}
      <ShoppingCart size={24} />

      {/* Badge */}
      {cartItems?.length > 0 && (
        <span
          className="absolute -top-1 -right-2 flex items-center justify-center
                     w-4 h-4 text-[10px] font-bold bg-red-600 text-white
                     rounded-full shadow-md"
        >
          {cartItems.length}
        </span>
      )}
    </button>
  );
};

export default NavbarCartIcon;
