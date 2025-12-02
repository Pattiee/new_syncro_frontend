import { useEffect, useState } from "react";
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
import { DownloadIcon } from "lucide-react";
import { FiDownloadCloud } from "react-icons/fi";
import { CustomLoader1 } from "../../components/loaders/CustomLoader1";

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

  const downloadOrderInvoice = async () => {
    try {
      const response = await getOrderInvoice(id);

      // Create a Blob from the response data
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      // Generate a temporary URL for the blob
      const url = window.URL.createObjectURL(pdfBlob);

      // Open the URL in a new tab
      // The browser will render the PDF inline in the new tab
      window.open(url, "_blank");

      // const link = document.createElement("a");
      // link.href = url;
      // link.setAttribute("download", "downloaded_document.pdf"); // Set desired filename
      // document.body.appendChild(link);
      // link.click();
      // link.remove(); // Clean up the temporary link
      window.URL.revokeObjectURL(url); // Release the object URL
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  if (loadingOrder) <CustomLoader1 />;

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
                <tr className="text-gray-700 border-none text-center bg-gradient-to-r from-white via-orange-300 to-white dark:text-gray-800 dark:bg-gradient-to-r dark:from-gray-800 dark:via-orange-300 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
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

          {/* Actions */}
          <div className="flex px-4 py-2 bg-red-100">
            <div>
              <button
                className="flex gap-1"
                onClick={() => downloadOrderInvoice()}
              >
                <FiDownloadCloud size={18} />
                <span>Download Invoice</span>
              </button>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
