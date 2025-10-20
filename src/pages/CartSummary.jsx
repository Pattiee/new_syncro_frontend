import { useNavigate } from 'react-router-dom';
import { currencyFormater, percentageFormater } from '../helpers/formater';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/cards/CartItem';
import { useDispatch } from 'react-redux';
import { clearCart, removeItem } from '../slices/cartSlice';
import { useEffect, useState } from 'react';
import { ShoppingCart, Trash2, ArrowLeft, CreditCard } from 'lucide-react';

const CartSummary = () => {
  const [vat, setVat] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [cartTotals, setCartTotals] = useState(0);
  const [vatRate, setVatRate] = useState(0.16);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useCart();

  useEffect(() => {
    const cartItems = cart?.items || [];
    const amount = cartItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
    setCartTotals(amount.toFixed(2));
    
    const vat = amount.toFixed(2) * vatRate;
    setVat(vat.toFixed(2));
    
    setSubTotal(amount + vat);
    if (cartItems.length < 1) navigate('/', { replace: true });
  }, [cart?.items, navigate, vatRate]);

  const handleClearCart = () => dispatch(clearCart());
  const handleRemoveCartItem = (id) => dispatch(removeItem(id));
  const handleNavigateHome = () => navigate('/');
  const handleCheckout = () => navigate('/checkout');


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-10 relative">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
            <ShoppingCart className="text-orange-500" /> Your Cart
          </h2>
          <button
            onClick={handleClearCart}
            disabled={!cart?.items?.length}
            className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={18} /> Clear Cart
          </button>
        </div>

        {cart?.items?.length > 0 ? (
          <>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 mb-6">
              {cart.items.map((item) => (
                <li key={item.id} className="py-3">
                  <CartItem
                    item={item}
                    removeItem={() => handleRemoveCartItem(item.id)}
                  />
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-300 dark:border-gray-700 mt-6 pt-4 space-y-2 text-gray-700 dark:text-gray-200">
              <div className="flex justify-between">
                <span>Cart totals</span>
                <span>{currencyFormater.format(cartTotals)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT {percentageFormater.format(vatRate.toFixed(2))}</span>
                <span>{currencyFormater.format(vat)}</span>
              </div>

              <div className="flex justify-between font-semibold text-lg border-t border-gray-300 dark:border-gray-600 pt-2">
                <span>SubTotal</span>
                <span className="text-orange-600 dark:text-orange-400">
                  {currencyFormater.format(subTotal)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-8 border-t pt-6">
              {/* <div className="flex items-center text-lg font-semibold text-gray-700 dark:text-gray-200">
                Subtotal:&nbsp;
                <span className="text-orange-600 dark:text-orange-400">
                  {currencyFormater.format(subTotal)}
                </span>
              </div> */}

              <div className="flex gap-3">
                <button
                  onClick={handleNavigateHome}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <ArrowLeft size={18} /> Continue Shopping
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
                >
                  <CreditCard size={18} /> Checkout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
            <ShoppingCart size={60} className="mb-4 text-gray-300 dark:text-gray-600" />
            <p>Your cart is empty.</p>
            <button
              onClick={handleNavigateHome}
              className="mt-6 px-5 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSummary;
