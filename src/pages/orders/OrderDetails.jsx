import { useEffect, useState } from 'react'
import { useQuery } from '../../hooks/useQuery'
import { cancelOrder, getOrders } from '../../services/order.service';
import { motion } from 'framer-motion';
import { ShippingAddress } from '../../components/shipping/ShippingAddress';
import { CustomLoader2 } from '../../components/loaders/CustomLoader2';
import { PaymentDetails } from '../../components/payment/PaymentDetails';
import { useNavigate } from 'react-router-dom';
import { MAIN_LINKS_FRONTEND } from '../../links';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { OrderItem } from '../../components/orders/OrderItem';
import { Smartphone } from 'lucide-react';
import { CreditCard } from 'appwrite';

export const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const query = useQuery();
  const { user, loading} = useAuth();
  const orderId = query.get("id");
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrder = async () => {
      if (!user && !loading) navigate("/", { replace: true });

      try {
        if (!loadingOrder) setLoadingOrder(true);

        const requests = [
          await getOrders({ orderId: orderId }),
        ];

        const result = await Promise.allSettled(requests);

        const ordersResponse = result[0];

        if (ordersResponse.status === 'fulfilled') {
          const ordersValue = ordersResponse.value;

          setOrder(ordersValue.data);
        } else {
          console.error(ordersResponse.reason);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrder(false);
      }
    }
    loadOrder();
  }, [orderId, user]);

  // if (!loadingOrder && !order) navigate(MAIN_LINKS_FRONTEND.HOME, { replace: true });
  
  const handleCancelOrder = async () => {
    await cancelOrder({ orderId }).then(res => {
      toast.success(res?.data);
      navigate(MAIN_LINKS_FRONTEND.ACCOUNT_INFO);
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <motion.div>
      <div className="flex justify-center items-start min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-10 relative">
          <div className='flex items-center mb-6 justify-between'>
            <span className='text-gray-700 dark:text-white'>Code: {order?.code}</span>

            <h2 className="flex text-2xl gap-3 font-bold text-center text-orange-600 dark:text-orange-400">
              Order Summary
              <span>(KSh {order?.totals})</span>
            </h2>

            <span className='text-gray-700 dark:text-white'>{order?.status}</span>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto border-b border-gray-300 dark:border-gray-700 mb-6">
            <table className="w-full text-left">
              <thead className=''>
                <tr className="text-gray-700 bg-orange-300 rounded-xl text-center dark:text-white dark:bg-orange-700 border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2">Product</th>
                  <th className="py-2">Unit Price</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {order?.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b text-center border-gray-100 dark:border-gray-700"
                  >
                    <td className="py-3 font-medium text-gray-800 dark:text-white">
                      {item.name}
                    </td>
                    <td className="py-3 text-gray-800 dark:text-gray-100">
                      {item.unitPrice}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">
                      {item.subTotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Section */}
          {/* <div className="p-6">
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
                  />
                  <Smartphone size={18} /> Pay with Mobile
                </label>
                <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                  />
                  <CreditCard size={18} /> Pay with Card
                </label>
              </div>
            </div>

          </div> */}

          {/* Action Buttons */}
          {/* <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
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
          </div> */}
        </div>
      </div>
    </motion.div>
  )
}
