import { useNavigate } from 'react-router-dom';
import { currencyFormater } from '../helpers/formater';
import { useCart } from '../hooks/useCart';
import { clearCart, removeItem } from '../slices/cartSlice';
import { useEffect, useState } from 'react';
import { Trash2, ArrowLeft, Smartphone, CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { MAIN_LINKS_FRONTEND } from '../links';
import { useDispatch, useSelector } from 'react-redux';
import { createNewOrder } from '../services/order.service';

export const CheckoutPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [useRegisteredNumber, setUseRegisteredNumber] = useState(true);
  const [showModal, setShowModal] = useState(false);  
  const [shippingCost] = useState(250); // flat shipping fee
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const cartItems = useSelector(state => state.cart?.items || []);
  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const total = subtotal + shippingCost;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useCart();
  const { user, loading } = useAuth();

  useEffect(() => {
    const cartItems = cart?.items || [];
    const amount = cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.qty,
      0
    );
    setSubTotal(amount.toFixed(2));
  }, [cart?.items]);

  useEffect(() => {
    if (!user && !loading) navigate('/', { replace: true });
    if (user?.phone) setMobileNumber(user.phone);
  }, [user, loading, navigate]);

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'mobile') {
      setShowMpesaModal(true);
      setTimeout(() => {
        setPaymentSuccess(true);
        setTimeout(async () => {
          await finalizeOrder();
        }, 2000);
      }, 3000);
    } else {
      await finalizeOrder();
    }
  };

  const finalizeOrder = async () => {
    setShowMpesaModal(false);
    setPlacingOrder(true);

    const orderRequestItems = cartItems.map(item => ({
      id: item.id,
      skuCode: item.skuCode,
      quantity: item.qty,
    }));

    const data = {
      username: user?.email || user?.username,
      items: orderRequestItems,
      shippingAddress: {
        id: '1234567890',
        city: 'Eldoret',
        zip: '3160',
        country: 'Kenya',
      },
      paymentMethod,
      mobileNumber,
    };

    await createNewOrder(data).then(res => {
      if (res?.data) dispatch(clearCart());
    }).finally(() => {
      setPlacingOrder(false);
      navigate(MAIN_LINKS_FRONTEND.HOME, { replace: true });
    });
  };

  const handleRemoveCartItem = (id) => dispatch(removeItem(id));
  const handleClearCart = () => dispatch(clearCart());
  const handlePaymentSelection = (method) => setPaymentMethod(method);

  const handleProceedToPay = () => {
    if (!paymentMethod) return alert('Select a payment method first.');
    setShowModal(true);
  };

  const confirmPayment = () => {
    setShowModal(false);
    // TODO: integrate with order API
    console.log('Proceeding to payment with:', {
      method: paymentMethod,
      phone: useRegisteredNumber ? user?.phone : mobileNumber,
      total: subTotal,
    });
    dispatch(clearCart());
    navigate('/orders/success');
  };

  return (
    <div className="flex justify-center items-start min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-10 relative">
        <h2 className="text-2xl font-bold text-center text-orange-600 dark:text-orange-400 mb-6">
          Order Summary
        </h2>

        {cart?.items?.length > 0 ? (
          <>
            {/* Product Table */}
            <div className="overflow-x-auto border-b border-gray-300 dark:border-gray-700 mb-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2">Product</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2">Price</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 dark:border-gray-700"
                    >
                      <td className="py-3 font-medium text-gray-800 dark:text-white">
                        {item.name}
                      </td>
                      <td className="py-3 text-gray-600 dark:text-gray-300">
                        {item.qty}
                      </td>
                      <td className="py-3 text-gray-800 dark:text-gray-100">
                        {currencyFormater.format(item.unitPrice * item.qty)}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleRemoveCartItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between text-lg font-semibold text-gray-800 dark:text-white mb-6">
              <span>Subtotal</span>
              <span className="text-orange-600 dark:text-orange-400">
                {currencyFormater.format(subTotal)}
              </span>
            </div>

            {/* Payment Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Choose Payment Method
              </h3>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="payment"
                    value="mobile"
                    checked={paymentMethod === 'mobile'}
                    onChange={() => handlePaymentSelection('mobile')}
                  />
                  <Smartphone size={18} /> Pay with Mobile
                </label>
                <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => handlePaymentSelection('card')}
                  />
                  <CreditCard size={18} /> Pay with Card
                </label>
              </div>

              {paymentMethod === 'mobile' && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="flex items-center gap-3 text-gray-700 dark:text-gray-200 mb-2">
                    <input
                      type="checkbox"
                      checked={useRegisteredNumber}
                      onChange={() =>
                        setUseRegisteredNumber(!useRegisteredNumber)
                      }
                    />
                    Use registered number ({user?.phone || 'N/A'})
                  </label>

                  {!useRegisteredNumber && (
                    <input
                      type="text"
                      placeholder="Enter another mobile number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 w-full sm:w-auto py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-full transition"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </button>

              <button
                onClick={handleClearCart}
                disabled={!cart?.items?.length}
                className="flex items-center justify-center gap-2 w-full sm:w-auto py-2 px-4 bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={18} /> Clear Cart
              </button>

              <button
                onClick={handleProceedToPay}
                className="w-full sm:w-auto py-2 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition"
              >
                Proceed to Pay
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
            Your cart is empty.
          </p>
        )}

        {/* Payment Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg w-[90%] max-w-md">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Confirm Payment
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You are about to pay{' '}
                <span className="text-orange-500 font-bold">
                  {currencyFormater.format(subTotal)}
                </span>{' '}
                via{' '}
                <span className="font-semibold capitalize">
                  {paymentMethod}
                </span>
                .
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPayment}
                  className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MPESA Modal */}
      {showMpesaModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="p-8 bg-white rounded-xl shadow-lg dark:bg-gray-800">
            {!paymentSuccess ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  Processing MPESA Payment
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  An STK Push has been sent to <strong>{mobileNumber}</strong>.
                </p>
                <div className="w-10 h-10 mx-auto border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-3">
                  Payment Successful
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your order is being processed. Redirecting...
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
