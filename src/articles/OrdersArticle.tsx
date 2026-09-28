import React from 'react';
import { OrderCard, UserOrderCardData } from '../components/orders/OrderCard';
import { CustomLoader2 } from '../components/loaders/CustomLoader2';

// Define the incoming props contract for the component wrapper
export interface OrdersArticleProps {
  loading: boolean;
  orders?: UserOrderCardData[];
}

export const OrdersArticle: React.FC<OrdersArticleProps> = ({ 
  loading, 
  orders = [] 
}) => {
  const activeOrdersCount: number = orders?.length || 0;

  return (
    <>
      <article className="md:col-span-2">
        <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
          <span>
            {activeOrdersCount > 0 
              ? `You have ${activeOrdersCount} orders.` 
              : 'You currently have no orders.'}
          </span>
        </h2>

        {loading ? (
          <CustomLoader2 />
        ) : activeOrdersCount <= 0 ? (
          <p className="text-gray-500 dark:text-gray-400">You've got no orders yet.</p>
        ) : (
          <ul className="grid gap-6">
            {orders
              .filter((o) => o?.status && o.status.toLowerCase() !== "cancelled")
              .map((order) => (
                <li key={order.id}>
                  <OrderCard order={order} />
                </li>
              ))}
          </ul>
        )}
      </article>
    </>
  );
};

export default OrdersArticle;