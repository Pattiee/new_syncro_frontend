import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrders, cancelOrder } from "../../services/order.service";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { MAIN_LINKS_FRONTEND } from "../../links";
import { useFormater } from "../../hooks/useFormater";

export const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const { user, loading } = useAuth();
  const { id } = useParams();
  const { currencyFormater } = useFormater();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
      return;
    }

    const loadOrder = async () => {
      try {
        setLoadingOrder(true);

        const { data } = await getOrders({ orderId: id });

        if (!data) {
          navigate("/", { replace: true });
        } else {
          setOrder(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrder(false);
      }
    };

    loadOrder();
  }, [id, user, loading]);

  const handleCancelOrder = async () => {
    try {
      const res = await cancelOrder({ id });
      toast.success(res?.data);
      navigate(MAIN_LINKS_FRONTEND.ACCOUNT_INFO);
    } catch (err) {
      console.error(err);
    }
  };

  if (loadingOrder) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-orange-600">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div>
      <div className="flex justify-center items-start min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
        <div className="m-auto w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-10 relative">
          {/* Header */}
          <div className="flex items-center mb-6 justify-between">
            <span className="text-gray-700 dark:text-white">
              Code: {order?.code}
            </span>

            <h2 className="flex text-2xl gap-3 font-bold text-center text-orange-600 dark:text-orange-400">
              Order Summary
            </h2>

            <span className="text-gray-700 dark:text-white">
              {order?.status}
            </span>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto border-b border-gray-300 dark:border-gray-700 py-6">
            <table className="w-full">
              <thead>
                <tr className="text-gray-700 border-none bg-gradient-to-r from-orange-300 to-white text-center dark:text-white dark:bg-orange-700 border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2">Product</th>
                  <th className="py-2">Unit Price</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {order?.items?.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b text-center border-gray-100 dark:border-gray-700"
                  >
                    <td className="py-3 font-medium text-gray-800 dark:text-white">
                      {item.name}
                    </td>
                    <td className="py-3 text-gray-800 dark:text-gray-100">
                      {currencyFormater.format(item?.unitPrice || 0)}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">
                      {currencyFormater.format(item?.subTotal || 0)}
                    </td>
                  </tr>
                ))}

                {/* Totals */}
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <span>{currencyFormater.format(order?.totals || 0)}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
