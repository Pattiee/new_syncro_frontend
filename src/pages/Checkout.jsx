import { useEffect, useState } from 'react';
import { clearCart } from '../slices/cartSlice'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createNewOrder } from '../services/order.service';
import { currencyFormater, percentageFormater } from '../helpers/formater';
import { MAIN_LINKS_FRONTEND } from '../links';
import { useKeycloak } from '@react-keycloak/web';

const required = value => {
  if(!value) return <span className='invalid-feedback d-block text-red-500 text-sm mt-1' >This field is required</span>
}

const CheckoutPage = () => {
  const { keycloak } = useKeycloak();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart?.items || []);
  const cartTotals = cartItems?.reduce((sum, item) => sum + item?.price * item?.quantity, 0).toFixed(2);
  const [valueAddedTaxPercent, setValueAddedTaxPercent] = useState(0);
  const [vatCharges, setVatCharges] = useState(0);
  const [totalCheckout, setTotalCheckout] = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false);


  useEffect(() => {
    if (!keycloak.authenticated) navigate(MAIN_LINKS_FRONTEND.HOME, { replace: true });
    const vatAmount = (valueAddedTaxPercent / 100) * cartTotals;
    setVatCharges(vatAmount);
    const gt = Number(cartTotals) + Number(vatAmount);
    setTotalCheckout(gt);
  }, [cartTotals, valueAddedTaxPercent, navigate, keycloak.authenticated]);

  useEffect(() => {
    const loadVATPercentage = async () => {
      setValueAddedTaxPercent(16.1);
    }
    loadVATPercentage();
  }, []);

  const handlePlaceOrder = async () => {
    if (!keycloak.authenticated) return keycloak.login();
    if (!cartItems) navigate(MAIN_LINKS_FRONTEND.HOME, { replace: true });

    setPlacingOrder(true);

    const orderRequestItems = [];

    cartItems?.forEach(item=> {
      const i = {};
      i.id = item?.id;
      i.skuCode = item.skuCode;
      i.quantity = item.quantity;

      orderRequestItems.push(i);
    });

    const data = {
      username: keycloak.tokenParsed?.email ?? '',
      items: orderRequestItems,
      shippingAddress: {
        id: "1234567890",
        city: "Eldoret",
        zip: "3160",
        country: "Kenya"
      }
    };

    await createNewOrder(data).then(res => {
      if (res?.data) dispatch(clearCart());
    }).finally(() => {
      setPlacingOrder(false);
      navigate(MAIN_LINKS_FRONTEND.HOME, { replace: true });
    });
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
        {/* Checkout Header */}
        <h1 className="mb-8 text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Checkout
        </h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Payment Information */}
          <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-700">
            <h2 className="mb-4 text-xl font-medium text-gray-800 dark:text-gray-100">Payment Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Card Number</label>
                <input
                  type="text"
                  autoComplete='billing cc-number'
                  placeholder="1234 5678 9876 5432"
                  className="w-full p-3 mt-2 text-gray-700 border border-gray-300 rounded-md dark:border-gray-600 dark:text-gray-200 bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-3 mt-2 text-gray-700 border border-gray-300 rounded-md dark:border-gray-600 dark:text-gray-200 bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full p-3 mt-2 text-gray-700 border border-gray-300 rounded-md dark:border-gray-600 dark:text-gray-200 bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-700">
            <div className='px-4 py-2 bg-orange-100 dark:bg-gray-800 rounded-xl'>
              <h2 className="mb-4 text-xl font-medium text-gray-800 dark:text-gray-100">Order Summary</h2>
              {cartItems && cartItems?.map(({ id, name, price, quantity }) => (
                <div key={id} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{name} @{ price } x { quantity }</span>
                  <span className="text-gray-800 dark:text-gray-100">{ currencyFormater.format(price  * quantity) }</span>
              </div>
              ))}
            </div>

            {/* VAT */}
            <div className="flex justify-between px-4 py-2 mt-2 border-b border-orange-300 rounded-t-full bg-orange-50 dark:bg-gray-800">
              <span className="text-orange-600 dark:text-gray-600">VAT</span>
              <span className="flex text-gray-800 dark:text-gray-100">
                <p className='px-2 text-orange-500'>({percentageFormater.format(valueAddedTaxPercent / 100)})</p>
                <p>{currencyFormater.format(vatCharges)}</p>
              </span>
            </div>

            {/* Grand total */}
            <div className="flex justify-between px-4 pt-4 font-semibold text-gray-900 dark:text-gray-50 dark:border-gray-600">
              <span className='text-lg'>Total Checkout</span>
              <span className='text-lg'>{currencyFormater.format(totalCheckout)}</span>
            </div>

            {/* Checkout */}
            <button
              disabled={placingOrder}
              onClick={handlePlaceOrder}
              className="w-full py-3 mt-8 text-white transition rounded-lg bg-primary dark:bg-primary-600 hover:bg-primary-600 dark:hover:bg-primary-700"
            >
              {placingOrder
                ? <div className='flex justify-center w-6 h-6 mx-auto border-4 border-t-4 border-orange-500 border-solid rounded-full animate-spin'></div>
                : <span>Checkout</span>
              }
            </button>
          </div>
        </div>

        {/* Cart Summary */}
        {/* <div className="p-6 mt-8 bg-white rounded-lg shadow dark:bg-gray-700">
        <h2 className="mb-4 text-xl font-medium text-gray-800 dark:text-gray-100">Shipping details</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Item 1</span>
              <span className="text-gray-800 dark:text-gray-100">$50.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Item 2</span>
              <span className="text-gray-800 dark:text-gray-100">$30.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Shipping</span>
              <span className="text-gray-800 dark:text-gray-100">$5.00</span>
            </div>
            <div className="flex justify-between pt-4 font-semibold text-gray-900 border-t border-orange-300 dark:text-gray-50 dark:border-gray-600">
              <span>Total</span>
              <span>$85.00</span>
            </div>
          </div>
        </div> */}

        {/* Checkout Button */}

        <Link
          to={"/"}
          className='flex justify-center mx-auto border-none w-full py-2 px-4 mt-4 text-white transition rounded-lg bg-primary dark:bg-primary-600 hover:bg-primary-600 dark:hover:bg-primary-700'
          >
            Home
        </Link>
      </div>
    </div>
  );
};

export default CheckoutPage;
