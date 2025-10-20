import React, { useState } from 'react'

export const MpesaModal = ({ paymentSuccess = false, mobileNumber = '' }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
        <div className="p-8 bg-white rounded-xl shadow-lg dark:bg-gray-800">
        {!paymentSuccess ? (
            <>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Processing MPESA Payment
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
                An STK Push has been sent to <strong>{mobileNumber}</strong>.
            </p>
            <div className="w-10 h-10 mx-auto border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </>
        ) : (
            <>
            <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-3">
                Payment Successful
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
                Your order is being processed. Redirecting...
            </p>
            </>
        )}
        </div>
    </div>
  )
}
