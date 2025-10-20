import { useNavigate } from 'react-router-dom';
import { currencyFormater, percentageFormater } from '../helpers/formater';
import { useCart } from '../hooks/useCart';
import { clearCart, removeItem } from '../slices/cartSlice';
import { useEffect, useState } from 'react';
import { Trash2, ArrowLeft, Smartphone, CreditCard, } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { MAIN_LINKS_FRONTEND } from '../links';
import { useDispatch, useSelector } from 'react-redux';
import { createNewOrder } from '../services/order.service';
import { MpesaModal } from '../components/modals/MpesaModal';
import { PaymentConfirmationModal } from '../components/modals/PaymentConfirmationModal';
import toast from 'react-hot-toast';
import { getCurrentUsersPhoneNumber } from '../services/user.service';

export const CheckoutPage = () => {
  const [subTotal, setSubTotal] = useState(0.00);
  const [paymentMethod, setPaymentMethod] = useState('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [useRegisteredNumber, setUseRegisteredNumber] = useState(true);
  const [registeredNumber, setRegisteredNumber] = useState("");
  const [showPaymentConfirmationModal, setShowPaymentConfirmationModal] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);  
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [vat, setVat] = useState(0);
  const [shippingFee, setShippingFee] = useState(0.00);
  const [grandTotal, setGrandTotal] = useState(0.00);
  const [vatRate, setVatRate] = useState(0.16);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useAuth();
  const { cart } = useCart();
  const cartItems = useSelector(state => state?.cart?.items || []);

  useEffect(() => {
    const cartTotals = cartItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);

    // Shipping fee, 5% of amount cart totals
    const accumulatedShippingFee = 0.05 * cartTotals;
    setShippingFee(accumulatedShippingFee.toFixed(2));
    setSubTotal(cartTotals.toFixed(2));
    
    // VAT, variabe rate; default: 16% of cart totals
    const vat = cartTotals * vatRate;
    setVat(vat.toFixed(2));

    // Grand total or payable amount, cartTotals + vat + shippingFee
    setGrandTotal(cartTotals + vat + accumulatedShippingFee);
    if (cartItems.length <= 0) navigate('/', { replace: true });
  }, [cartItems, navigate]);
  

  useEffect(() => {
    if (!user && !loading) navigate('/', { replace: true });
    const loadUserData = async () => {
      const { data } = await getCurrentUsersPhoneNumber();
      if (data) setRegisteredNumber(data?.trim()?.replace("+254 ", '0'));
    }

    loadUserData();
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
    const orderRequestItems = cartItems.map(item => ({
      id: item.id,
      skuCode: item.skuCode,
      quantity: item.qty,
    }));
    
    if (!user) return toast.error("Unable to build customer data");
    
    const paymentInfo = {
      method: paymentMethod,
      mobileNumber: mobileNumber,
    }

    const data = {
      items: orderRequestItems,
      paymentInfo: paymentInfo,
      shippingAddress: {
        id: '1234567890',
        city: 'Eldoret',
        zip: '3160',
        country: 'Kenya',
      },
    };

    if (!placingOrder) setPlacingOrder(true);
    await createNewOrder(data).then(res => {
      if (res?.data) dispatch(clearCart());
      console.log(res);
      navigate('/account');
    }).finally(() => setPlacingOrder(false));
  };

  const handleRemoveCartItem = (id) => dispatch(removeItem(id));
  const handleClearCart = () => {
    dispatch(clearCart());
    navigate('/');
  }
  const handlePaymentSelection = method => setPaymentMethod(method);

  const handleUseRegisteredNumber = () => {
    setShowPhoneInput(false);
    setUseRegisteredNumber(true);
  }

  const handleShowPhoneInput = () => {
    setUseRegisteredNumber(false);
    setShowPhoneInput(true);
  }

  const handleProceedToPay = () => {
    if (!user?.username) return toast.error('Please login to continue.');
    setShowPaymentConfirmationModal(true);
  };

  const confirmPayment = () => {
    setShowPaymentConfirmationModal(false);
    // TODO: integrate with order API
    console.log('Proceeding to payment with:', {
      method: paymentMethod,
      phone: useRegisteredNumber ? registeredNumber : mobileNumber,
      total: grandTotal,
    });
    handlePlaceOrder();    
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

            {/* Totals */}
            <div className="dark:border-gray-700 mt-6 pt-4 space-y-2 text-gray-700 dark:text-gray-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{currencyFormater.format(subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT {percentageFormater.format(vatRate.toFixed(2))}</span>
                <span>{currencyFormater.format(vat)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping fee</span>
                <span>{currencyFormater.format(shippingFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-gray-300 dark:border-gray-600 pt-2">
                <span>Payable Amount</span>
                <span className="text-orange-600 dark:text-orange-400">
                  {currencyFormater.format(grandTotal)}
                </span>
              </div>
            </div>

            {/* Payment Section */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Choose Payment Method
              </h3>

              <div className='flex items-center px-4 py-2 justify-between'>
                <div className="flex flex-col rounded-xl gap-3 px-4 py-2">
                  <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      name="payment"
                      value="mobile"
                      checked={paymentMethod === 'mobile'}
                      onChange={(e) => handlePaymentSelection(e.target.value)}
                    />
                    <Smartphone size={18} /> Pay with Mobile
                  </label>
                  <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => handlePaymentSelection(e.target.value)}
                    />
                    <CreditCard size={18} /> Pay with Card
                  </label>
                </div>

                {paymentMethod === 'mobile' && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">

                    {/* Choose payment number */}
                    {registeredNumber && (
                      <label className="flex items-center gap-3 text-gray-700 dark:text-gray-200 mb-2">
                        <input
                          type="checkbox"
                          checked={useRegisteredNumber}
                          onChange={handleUseRegisteredNumber}
                        />
                        Use registered number? {useRegisteredNumber && (registeredNumber)}
                      </label>
                    )}

                    {!showPhoneInput && (
                      <label className="flex items-center gap-3 text-gray-700 dark:text-gray-200 mb-2">
                        <input
                          type="checkbox"
                          checked={showPhoneInput}
                          onChange={handleShowPhoneInput}
                        />
                        Enter mobile number
                      </label>
                    )}

                    {!useRegisteredNumber && showPhoneInput && (
                      <div className='flex items-center gap-3 -z-50'>
                        <input
                          type="tel"
                          placeholder={"Enter safaricom mobile number"}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />

                        <button 
                        className='flex relative items-center float-right'>
                          Done
                        </button>
                      </div>
                    )}

                  </div>
                )}
              </div>

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
        {showPaymentConfirmationModal && (
          <PaymentConfirmationModal subTotal={grandTotal} setShowModal={setShowPaymentConfirmationModal} confirmPayment={confirmPayment} paymentMethod={paymentMethod}/>
        )}
      </div>

      {/* MPESA Modal */}
      {showMpesaModal && (
        <div>
          <MpesaModal paymentSuccess={paymentSuccess}/>
        </div>
      )}
    </div>
  );
};
