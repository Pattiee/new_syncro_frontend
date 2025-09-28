import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from '../../hooks/useQuery'
import { cancelOrder, getOrders } from '../../services/order.service';
import { motion } from 'framer-motion';
import { ShippingAddress } from '../../components/shipping/ShippingAddress';
import { Loader } from '../../components/Loader';
import { OrderItems } from '../../components/orders/OrderItems';
import { PaymentDetails } from '../../components/payment/PaymentDetails';
import { useNavigate } from 'react-router-dom';
import { MAIN_LINKS_FRONTEND } from '../../links';
import toast from 'react-hot-toast';
import { useKeycloak } from '@react-keycloak/web';

export const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const query = useQuery();
  const { keycloak } = useKeycloak();
  const orderId = query.get("id");
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrder = async () => {
      await getOrders({ username: keycloak.tokenParsed?.email, orderId }).then(res => {
        if (res) {
          console.log(res.data);
          setOrder(res.data);
        }
      }).catch(err => {
        console.error(err);
      }).finally(() => {
        setLoadingOrder(false);
      });
    }
    loadOrder();
  }, [orderId, keycloak.tokenParsed?.email]);

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
      {loadingOrder
        ? <Loader />
        : (
          <div className='flex flex-col items-center w-full'>
            <header className='flex w-full px-4 py-2 bg-white'>
              <div className='flex items-center justify-between w-full px-4'>
                <span className='text-xl font-bold'>Order: {order?.code}</span>
                {order?.status && (
                  <span className={`text-sm px-2 py-1 rounded-full ${order.status === 'Cancelled'
                    ? 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100'
                    : order.status === 'Delivered'
                      ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100'
                      : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'
                    }`}>
                    {order?.status}
                  </span>
                )}
              </div>
            </header>
            <body className='flex items-center justify-center w-full'>
              <main className=''>                
                <section className='flex'>
                  {order?.items && <OrderItems items={order.items || []} />}
                </section>

                <section>
                  <PaymentDetails/>
                </section>
                
                <section className='space-y-3'>
                  {order?.address && <ShippingAddress address={order.address} />}
                </section>
              </main>
            </body>
            <footer>
              <button onClick={handleCancelOrder}>Cancel Order</button>
            </footer>
        </div>
        )}
    </motion.div>
  )
}
