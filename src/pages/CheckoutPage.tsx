import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { clearCart, removeItem } from "../slices/cartSlice";
import { Trash2, ArrowLeft, Smartphone, CreditCard, CurrencyIcon, PlaneIcon, PlaneLandingIcon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { createNewOrder } from "../services/order.service";
import { MpesaModal } from "../components/modals/MpesaModal";
import { PaymentConfirmationModal } from "../components/modals/PaymentConfirmationModal";
import toast from "react-hot-toast";
import { getCurrentUsersPhoneNumber } from "../services/user.service";
import { useFormater } from "../hooks/useFormater";
import axios from "axios";

// Structural interfaces for state tracking models
export interface CartItemType {
  id: string;
  name: string;
  price: number;
  qty: number;
  skuCode: string;
  imageUrls?: string[];
}

export interface PaymentInfoType {
  method: string;
  mobileNumber?: string;
}

export const CheckoutPage: React.FC = () => {
  const [subTotal, setSubTotal] = useState<string>("0.00");
  const [paymentMethod, setPaymentMethod] = useState<string>("mobile");
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfoType | null>(null);
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [useRegisteredNumber, setUseRegisteredNumber] = useState<boolean>(true);
  const [registeredNumber, setRegisteredNumber] = useState<string>("0716227064");
  const [showPaymentConfirmationModal, setShowPaymentConfirmationModal] = useState<boolean>(false);
  const [showPhoneInput, setShowPhoneInput] = useState<boolean>(false);
  const [placingOrder, setPlacingOrder] = useState<boolean>(false);
  const [showMpesaModal, setShowMpesaModal] = useState<boolean>(false);
  const [paymentReceived, setPaymentReceived] = useState<boolean>(false);
  const [vat, setVat] = useState<string>("0.00");
  const [shippingFee, setShippingFee] = useState<string>("0.00");
  const [grandTotal, setGrandTotal] = useState<number>(0.0);
  const [vatRate] = useState<number>(0.16);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, loading } = useAuth() as {
    user: { id: string | number; roles: string[] } | null;
    loading: boolean;
  };
  
  const { currencyFormater } = useFormater();
  const { cartItems, cartTotals } = useCart() as {
    cartItems: CartItemType[];
    cartTotals: number;
  };

  useEffect(() => {
    const accumulatedShippingFee = 0.05 * cartTotals;
    setShippingFee(accumulatedShippingFee.toFixed(2));
    setSubTotal(cartTotals.toFixed(2));

    const calculatedVat = cartTotals * vatRate;
    setVat(calculatedVat.toFixed(2));

    setGrandTotal(cartTotals + calculatedVat + accumulatedShippingFee);
    
    if (cartItems.length <= 0) {
      navigate("/", { replace: true });
    }
  }, [cartItems, cartTotals, vatRate, navigate]);

  useEffect(() => {
    if (!user && !loading) {
      navigate("/", { replace: true });
      return;
    }
    
    const loadUserData = async () => {
      try {
        const response = await getCurrentUsersPhoneNumber();
        if (response?.data) {
          setRegisteredNumber(response.data.trim().replace("+254 ", "0"));
        }
      } catch (error) {
        console.error("Failed to load telephone attributes:", error);
      }
    };

    if (user && !placingOrder) {
      loadUserData();
    }
  }, [user, loading, navigate, placingOrder]);

  const downloadPdfAndOpen = async (): Promise<void> => {
    try {
      const response = await axios.get("http://localhost:8080/generate-pdf", {
        responseType: "blob",
      });
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      window.open(url, "_blank");
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching or opening PDF:", error);
    }
  };

  const handleValidatePaymentInfo = async (): Promise<void> => {
    if (!user) {
      toast.error("Unable to build customer data");
      return;
    }

    const paymentInfoData: PaymentInfoType = {
      method: paymentMethod,
    };

    if (paymentMethod === "mobile") {
      const paymentMobileNumber = mobileNumber || registeredNumber;
      if (!paymentMobileNumber) {
        toast.error("Invalid mobile payment details");
        return;
      }
      paymentInfoData.mobileNumber = paymentMobileNumber;
      setPaymentInfo(paymentInfoData);
      setShowPaymentConfirmationModal(true);
    } else {
      toast.error("Sorry, banks payments coming soon...");
    }
  };

  const handlePaymentConfirmed = async (): Promise<void> => {
    setShowPaymentConfirmationModal(false);

    if (!user && !loading) {
      navigate("/auth/login");
      return;
    }
    if (!paymentInfo) {
      toast.error("Error building payment info");
      return;
    }

    const orderItemsRequest = cartItems.map((item) => ({
      id: item.id,
      skuCode: item.skuCode,
      quantity: item.qty,
    }));

    const data = {
      items: orderItemsRequest,
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

      const response = await createNewOrder(data);
      const resData = response?.data;
      
      if (resData) {
        if (resData.paymentReceived) {
          toast.success("Payment received");
          dispatch(clearCart());
          setPaymentReceived(resData.paymentReceived);
          setTimeout(() => {
            navigate(`/order/${resData.orderId}`);
          }, 1000);
        } else {
          toast.error("Payment failed");
        }
      }
    } catch (error) {
      console.error("Order creation operation failed:", error);
    } finally {
      setShowMpesaModal(false);
      setPlacingOrder(false);
    }
  };

  const handleRemoveCartItem = (id: string): void => {
    dispatch(removeItem(id));
  };
  
  const handleClearCart = (): void => {
    dispatch(clearCart());
    navigate("/");
  };
  
  const handlePaymentSelection = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPaymentMethod(e.target.value);
  };

  const handleUseRegisteredNumber = (): void => {
    setShowPhoneInput(false);
    setUseRegisteredNumber(true);
  };

  const handleShowPhoneInput = (): void => {
    setUseRegisteredNumber(false);
    setShowPhoneInput(true);
  };

  const handleInitiatePayment = async (): Promise<void> => {
    if (!user && !loading) {
      navigate("/auth/login", { replace: true });
      return;
    }
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
            {/* Product Table Layout Grid */}
            <div className="overflow-x-auto border-b border-gray-300 dark:border-gray-700 mb-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2">Product</th>
                    <th className="py-2">Unit Price</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2 text-right">Total</th>
                    <th className="py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300">
                      <td className="py-3 font-medium">{item.name}</td>
                      <td className="py-3">{currencyFormater.format(item.price)}</td>
                      <td className="py-3">{item.qty}</td>
                      <td className="py-3 text-right font-semibold">
                        {currencyFormater.format(item.price * item.qty)}
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => handleRemoveCartItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="flex flex-col items-end gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <p>Subtotal: <span className="font-semibold text-gray-800 dark:text-gray-200">{currencyFormater.format(Number(subTotal))}</span></p>
              <p>VAT (16%): <span className="font-semibold text-gray-800 dark:text-gray-200">{currencyFormater.format(Number(vat))}</span></p>
              <p>Shipping Fee: <span className="font-semibold text-gray-800 dark:text-gray-200">{currencyFormater.format(Number(shippingFee))}</span></p>
              <p className="text-lg font-bold text-orange-600 dark:text-orange-400 mt-2">
                Grand Total: {currencyFormater.format(grandTotal)}
              </p>
            </div>

            {/* Payment Mechanics Control */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-6">
              
            </div> {/* Closes payment method options container */}

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={handleClearCart}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft size={16} /> Cancel Order
              </button>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={downloadPdfAndOpen}
                  className="px-4 py-2.5 text-sm font-medium border border-orange-500 text-orange-500 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Preview Invoice PDF
                </button>
                <button
                  disabled={placingOrder}
                  onClick={handleInitiatePayment}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-orange-600 rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-md"
                >
                  {placingOrder ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Your cart is currently empty.
          </div>
        )}
      </div>

      {/* Dynamic Overlay Status Modals */}
      <PaymentConfirmationModal
        isOpen={showPaymentConfirmationModal}
        onClose={() => setShowPaymentConfirmationModal(false)}
        onConfirm={handlePaymentConfirmed}
        paymentInfo={paymentInfo}
        grandTotal={currencyFormater.format(grandTotal)}
      />

      <MpesaModal
        isOpen={showMpesaModal}
        onClose={() => setShowMpesaModal(false)}
        placingOrder={placingOrder}
        paymentReceived={paymentReceived}
      />
    </div>
  );
};
