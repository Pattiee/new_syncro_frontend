import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrders,
  cancelOrder,
  getOrderInvoice,
} from "../../services/order.service";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { MAIN_LINKS_FRONTEND } from "../../links";
import { useFormater } from "../../hooks/useFormater";
import { FiDownloadCloud } from "react-icons/fi";
import { CustomLoader1 } from "../../components/loaders/CustomLoader1";

// Shape definition for order breakdown products line items
export interface OrderDetailsLineItem {
  name: string;
  unitPrice: number;
  quantity: number;
  subTotal: number;
}

// Structural type profile matching your order payload metadata
export interface OrderRecordType {
  code: string;
  status: string;
  totals: number;
  items: OrderDetailsLineItem[];
}

export const OrderDetails: React.FC = () => {
  const [order, setOrder] = useState<OrderRecordType | null>(null);
  const [loadingOrder, setLoadingOrder] = useState<boolean>(true);
  
  const { user, loading } = useAuth() as {
    user: { id: string | number; roles: string[] } | null;
    loading: boolean;
  };
  
  const { id } = useParams<{ id: string }>();
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
        // Ensure id fallback maps effectively as a safe parameter string
        const response = await getOrders({ orderId: id || "" });
        const resData = response?.data as OrderRecordType | undefined;

        if (!resData) {
          navigate("/", { replace: true });
        } else {
          setOrder(resData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrder(false);
      }
    };

    if (id) {
      loadOrder();
    }
  }, [id, user, loading, navigate]);

  const handleCancelOrder = async (): Promise<void> => {
    try {
      const res = await cancelOrder({ orderId: id || "" });
      toast.success(res?.data || "Order cancelled successfully");
      navigate(MAIN_LINKS_FRONTEND.ACCOUNT_INFO);
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order.");
    }
  };

  const downloadOrderInvoice = async (): Promise<void> => {
    try {
      const response = await getOrderInvoice(id || "");

      // Create a Blob from the response data
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      // Generate a temporary URL for the blob
      const url = window.URL.createObjectURL(pdfBlob);

      // Open the URL in a new tab
      window.open(url, "_blank");

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF invoice:", error);
      toast.error("Failed to fetch invoice data.");
    }
  };

  // Fixed silent loop evaluation bug by appending return statement
  if (loadingOrder) {
    return <CustomLoader1 />;
  }

  if (!order) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-center items-start min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
        <div className="m-auto w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-10 relative">
          {/* Header */}
          <div className="flex items-center mb-6 justify-between">
            <span className="text-gray-700 dark:text-white font-medium">
              Code: {order.code}
            </span>

            <h2 className="flex text-2xl gap-3 font-bold text-center text-orange-600 dark:text-orange-400">
              Order Summary
            </h2>

            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 uppercase tracking-wider">
              {order.status}
            </span>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto border-b border-gray-300 dark:border-gray-700 py-6">
            <table className="w-full">
              <thead>
                <tr className="text-gray-700 border-none text-center bg-gradient-to-r from-white via-orange-300 to-white dark:text-gray-800 dark:bg-gradient-to-r dark:from-gray-800 dark:via-orange-300 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 text-sm">
                  <th className="py-2">Product</th>
                  <th className="py-2">Unit Price</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {order.items?.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b text-center border-gray-100 dark:border-gray-700 text-sm"
                  >
                    <td className="py-3 font-medium text-gray-800 dark:text-white">
                      {item.name}
                    </td>
                    <td className="py-3 text-gray-800 dark:text-gray-100">
                      {currencyFormater.format(item.unitPrice || 0)}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-300 font-semibold">
                      {currencyFormater.format(item.subTotal || 0)}
                    </td>
                  </tr>
                ))}

                {/* Totals Row Breakdown */}
                <tr className="text-sm font-bold border-t-2 border-gray-200 dark:border-gray-700">
                  <td className="py-4 text-left pl-4 text-gray-700 dark:text-gray-300">Total Payable Amount</td>
                  <td></td>
                  <td></td>
                  <td className="py-4 text-center text-orange-600 dark:text-orange-400 text-base">
                    {currencyFormater.format(order.totals || 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action Links Tray */}
          <div className="flex px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl justify-between items-center mt-6">
            <div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                onClick={() => downloadOrderInvoice()}
              >
                <FiDownloadCloud size={18} />
                <span>Download Invoice</span>
              </button>
            </div>
            {order.status.toLowerCase() === "pending" && (
              <div>
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};