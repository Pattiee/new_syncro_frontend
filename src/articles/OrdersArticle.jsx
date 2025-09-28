import React from 'react'
import { OrderCard } from '../components/orders/OrderCard'
import { Loader } from '../components/Loader'

export const OrdersArticle = ({ loading, orders = [] }) => {
  return (
    <>
      <article className="md:col-span-2">
        <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
          <span>{orders?.length > 0 ? `You have ${orders?.length ?? 0} orders.` : 'You currently have no orders.'}</span>
        </h2>

        {loading
          ? <Loader />
          : orders.length <= 0
            ? <p className="text-gray-500 dark:text-gray-400">You've got no orders yet.</p>
            : (
                <ul className="grid gap-6">
                  {orders.filter(o => o?.status !== "cancelled").map(order => <OrderCard key={order.id} order={order} /> )}
                </ul>
              )}

          </article>
      </>
  )
}
