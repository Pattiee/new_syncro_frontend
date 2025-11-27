import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { clearCart, removeItem } from "../slices/cartSlice";
import { useEffect, useState } from "react";
import { Trash2, ArrowLeft, Smartphone, CreditCard } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { MAIN_LINKS_FRONTEND } from "../links";
import { useDispatch, useSelector } from "react-redux";
import { createNewOrder } from "../services/order.service";
import { MpesaModal } from "../components/modals/MpesaModal";
import { OrderConfirmationModal } from "../components/modals/OrderConfirmationModal";
import toast from "react-hot-toast";
import { getCurrentUsersPhoneNumber } from "../services/user.service";
import { useFormater } from "../hooks/useFormater";
import axios from "axios";

export const CheckoutPage = () => {
  const [subTotal, setSubTotal] = useState(0.0);
  const [paymentMethod, setPaymentMethod] = useState("mobile");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [useRegisteredNumber, setUseRegisteredNumber] = useState(true);
  const [registeredNumber, setRegisteredNumber] = useState("0716227064");
  const [showOrderConfirmationModal, setShowOrderConfirmationModal] =
    useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [vat, setVat] = useState(0);
  const [shippingFee, setShippingFee] = useState(0.0);
  const [grandTotal, setGrandTotal] = useState(0.0);
  const [vatRate, setVatRate] = useState(0.16);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useAuth();
  const { currencyFormater, percentageFormater } = useFormater();
  const { cartItems, cartTotals } = useCart();

  useEffect(() => {
    // Shipping fee, 5% of amount cart totals
    const accumulatedShippingFee = 0.05 * cartTotals;
    setShippingFee(accumulatedShippingFee.toFixed(2));
    setSubTotal(cartTotals.toFixed(2));

    // VAT, variabe rate; default: 16% of cart totals
    const vat = cartTotals * vatRate;
    setVat(vat.toFixed(2));

    // Grand total or payable amount, cartTotals + vat + shippingFee
    setGrandTotal(cartTotals + vat + accumulatedShippingFee);
    if (cartItems.length <= 0) navigate("/", { replace: true });
  }, [cartItems, navigate]);

  useEffect(() => {
    if (!user && !loading) navigate("/", { replace: true });
    const loadUserData = async () => {
      try {
        const requests = [await getCurrentUsersPhoneNumber()];

        const result = await Promise.allSettled(requests);

        const usersPhoneResult = result[0];

        if (usersPhoneResult.status === "fulfilled") {
          const { data } = usersPhoneResult.value;
          if (data) setRegisteredNumber(data?.trim()?.replace("+254 ", "0"));
        }
      } catch (error) {}
    };

    loadUserData();
  }, [user, loading, navigate, placingOrder]);

  const downloadPdf = async () => {
    try {
      const response = await axios.get("http://localhost:8080/generate-pdf", {
        responseType: "blob", // Receive as a binary blob
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "downloaded_document.pdf"); // Set desired filename
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up the temporary link
      window.URL.revokeObjectURL(url); // Release the object URL
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  // Open in new tab
  const downloadPdfAndOpen = async () => {
    try {
      const response = await axios.get("http://localhost:8080/generate-pdf", {
        responseType: "blob", // Receive as a binary blob
      });

      // Create a Blob from the response data
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      // Generate a temporary URL for the blob
      const url = window.URL.createObjectURL(pdfBlob);

      // Open the URL in a new tab
      // The browser will render the PDF inline in the new tab
      window.open(url, "_blank");

      // It's good practice to revoke the object URL after the new window is opened
      // The browser window now manages the blob's lifecycle (or the user closes the tab)
      // Revoking too soon might prevent the document from loading.
      // You can defer the revocation slightly if needed, but it often works immediately.
      // window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching or opening PDF:", error);
    }
  };

  const handleValidatePaymentInfo = async () => {
    if (!user) return toast.error("Unable to build customer data");

    const paymentInfoData = {
      method: paymentMethod,
    };

    if (paymentMethod === "mobile") {
      // Mobile
      const paymentMobileNumber = mobileNumber || registeredNumber;
      if (!paymentMobileNumber)
        return toast.error("Invalid mobile payment details");
      paymentInfoData.mobileNumber = paymentMobileNumber;

      setPaymentInfo(paymentInfoData);
      setShowOrderConfirmationModal(true);
    } else {
      return toast.error("Sorry, banks payments coming soon...");
      // TODO: Bank
    }
  };

  const handlePlaceOrder = async () => {
    if (!user && !loading) return navigate("/auth/login");
    if (!paymentInfo) return toast.error("Error building payment info");

    // Close order confirmation modal
    setShowOrderConfirmationModal(false);
    const orderRequestItems = cartItems.map((item) => ({
      id: item.id,
      skuCode: item.skuCode,
      quantity: item.qty,
    }));

    const data = {
      items: orderRequestItems,
      paymentInfo: paymentInfo,
      shippingAddress: {
        id: "1234567890",
        city: "Eldoret",
        zip: "3160",
        country: "Kenya",
      },
    };

    try {
      setPlacingOrder(true);
      setShowMpesaModal(true);

      console.log("ORDER DATA: ", data);

      const requests = [await createNewOrder(data)];

      const result = await Promise.allSettled(requests);

      const createOrderResult = result[0];

      if (createOrderResult.status === "fulfilled") {
        const { data } = createOrderResult.value;
        console.log("CREATE ORDER RESULT: ", data);
        if (data) {
          dispatch(clearCart());
          setPaymentSuccess(true);
          toast.success("Order placed successfully!");
          setTimeout(() => {
            navigate(`/order/${data}`);
          }, 500);
        }
      } else {
        console.log("CREATE ORDER ERROR: ", createOrderResult.reason);
      }
    } catch (error) {
    } finally {
      setShowMpesaModal(false);
      setPlacingOrder(false);
    }
  };

  // navigate(`/orders/details?id=${data.orderId}`);

  const handleRemoveCartItem = (id) => dispatch(removeItem(id));
  const handleClearCart = () => {
    dispatch(clearCart());
    navigate("/");
  };
  const handlePaymentSelection = (method) => setPaymentMethod(method);

  const handleUseRegisteredNumber = () => {
    setShowPhoneInput(false);
    setUseRegisteredNumber(true);
  };

  const handleShowPhoneInput = () => {
    setUseRegisteredNumber(false);
    setShowPhoneInput(true);
  };

  const placeOrder = async () => {
    if (!user && !loading) return navigate("/auth/login", { replace: true });
    await handleValidatePaymentInfo();
  };

  return (
    <div className="flex justify-center items-start min-h-screen py-8 bg-transparent">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-10 relative">
        <h2 className="text-2xl font-bold text-center text-orange-600 dark:text-orange-400 mb-6">
          Order Summary
        </h2>

        {cartItems.length > 0 ? (
          <>
            {/* Product Table */}
            <div className="overflow-x-auto border-b border-gray-300 dark:border-gray-700 mb-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2">Product</th>
                    <th className="py-2">Unit Price</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2">Price</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 dark:border-gray-700"
                    >
                      <td className="py-3 font-medium text-gray-800 dark:text-white">
                        {item.name}
                      </td>
                      <td className="py-3 text-gray-600 dark:text-gray-300">
                        {item?.unitPrice}
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

              <div className="flex items-center px-4 py-2 justify-between">
                <div className="flex flex-col rounded-xl gap-3 px-4 py-2">
                  <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      name="payment"
                      value="mobile"
                      checked={paymentMethod === "mobile"}
                      onChange={(e) => handlePaymentSelection(e.target.value)}
                    />
                    <Smartphone size={18} /> Pay with Mobile
                  </label>
                  <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => handlePaymentSelection(e.target.value)}
                    />
                    <CreditCard size={18} /> Pay with Card
                  </label>
                </div>

                {paymentMethod === "mobile" && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    {/* Choose payment number */}
                    {registeredNumber && (
                      <label className="flex items-center gap-3 text-gray-700 dark:text-gray-200 mb-2">
                        <input
                          type="checkbox"
                          checked={useRegisteredNumber}
                          onChange={handleUseRegisteredNumber}
                        />
                        Use registered number?{" "}
                        {useRegisteredNumber && registeredNumber}
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
                      <div className="flex items-center gap-3 -z-50">
                        <input
                          type="tel"
                          placeholder={"Enter safaricom mobile number"}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full px-4 py-2 mt-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />

                        <button className="flex relative items-center float-right">
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
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 w-full sm:w-auto py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-full transition"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </button>

              <button
                onClick={handleClearCart}
                disabled={cartItems?.length < 1}
                className="flex items-center justify-center gap-2 w-full sm:w-auto py-2 px-4 bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={18} /> Clear Cart
              </button>

              <button
                onClick={placeOrder}
                className="w-full sm:w-auto py-2 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition"
              >
                Place Order
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
            Your cart is empty.
          </p>
        )}

        {/* Payment Confirmation Modal */}
        {showOrderConfirmationModal && (
          <OrderConfirmationModal
            subTotal={grandTotal}
            setShowModal={setShowOrderConfirmationModal}
            confirmOrder={handlePlaceOrder}
            paymentMethod={paymentMethod}
            paymentNumber={mobileNumber || registeredNumber}
          />
        )}
      </div>

      {/* MPESA Modal */}
      {showMpesaModal && (
        <div>
          <MpesaModal
            paymentSuccess={paymentSuccess}
            mobileNumber={mobileNumber || registeredNumber}
          />
        </div>
      )}
    </div>
  );
};
