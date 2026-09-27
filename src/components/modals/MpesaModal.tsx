import React from "react";

// Define the incoming props contract for the M-Pesa tracking dialog
export interface MpesaModalProps {
  paymentReceived?: boolean;
  mobileNumber?: string;
}

export const MpesaModal: React.FC<MpesaModalProps> = ({ 
  paymentReceived = false, 
  mobileNumber = "" 
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full text-center border border-gray-100 dark:border-gray-700">
        {!paymentReceived ? (
          <>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Processing M-Pesa Payment
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
              An STK Push has been sent to <strong>{mobileNumber}</strong>. Please check your phone to input your PIN.
            </p>
            <div className="w-10 h-10 mx-auto border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-3">
              Payment Received
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Your order is being processed successfully. Redirecting...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default MpesaModal;