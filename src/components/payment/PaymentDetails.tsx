import React from 'react';

// Define the structural data contract for payment record metadata attributes
export interface PaymentDetailsRecord {
  method: string;
  mobileNumber?: string;
  transactionId?: string;
  status?: string;
  [key: string]: unknown; // Fallback mapping for dynamic parameters
}

// Define the incoming props contract for the component wrapper
export interface PaymentDetailsProps {
  payment: PaymentDetailsRecord | null | undefined;
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({ payment }) => {
  return (
    <>
      <div>
        <div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">Payment</span>
        </div>
        
        {/* Optional detail block to render if payment information has loaded successfully */}
        {payment && (
          <div className="flex flex-col text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <div>
              <span className="font-semibold">Method:</span>{" "}
              <span className="capitalize">{payment.method}</span>
            </div>
            {payment.mobileNumber && (
              <div>
                <span className="font-semibold">Mobile Number:</span>{" "}
                <span>{payment.mobileNumber}</span>
              </div>
            )}
            {payment.transactionId && (
              <div>
                <span className="font-semibold">Transaction ID:</span>{" "}
                <span className="font-mono text-xs">{payment.transactionId}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentDetails;