import React from "react";
import { useFormater } from "../../hooks/useFormater";

// Define the incoming props contract for the confirmation modal dialog
export interface PaymentConfirmationModalProps {
  subTotal: number | string;
  paymentMethod: string;
  setShowModal: (isOpen: boolean) => void;
  confirmPayment: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  paymentNumber?: string;
}

export const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  subTotal,
  paymentMethod,
  setShowModal,
  confirmPayment,
  paymentNumber = "",
}) => {
  const { currencyFormater } = useFormater();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl w-[90%] max-w-md border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Confirm Order
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
          You will be prompted to pay{" "}
          <span className="text-orange-500 font-bold">
            {currencyFormater.format(Number(subTotal))}
          </span>{" "}
          via <span className="font-semibold capitalize text-gray-900 dark:text-white">{paymentMethod}</span>{" "}
          {paymentNumber && (
            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs text-gray-800 dark:text-gray-200">
              {paymentNumber}
            </span>
          )}
        </p>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmPayment}
            className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors shadow-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationModal;