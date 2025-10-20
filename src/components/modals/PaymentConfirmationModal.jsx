import React from 'react'
import { currencyFormater } from '../../helpers/formater'

export const PaymentConfirmationModal = ({ subTotal, paymentMethod, setShowModal, confirmPayment }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Confirm Payment
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
            You are about to pay{' '}
            <span className="text-orange-500 font-bold">
                {currencyFormater.format(subTotal)}
            </span>{' '}
            via{' '}
            <span className="font-semibold capitalize">
                {paymentMethod}
            </span>
            .
            </p>

            <div className="flex justify-end gap-3">
            <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            >
                Cancel
            </button>
            <button
                onClick={confirmPayment}
                className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
            >
                Confirm
            </button>
            </div>
        </div>
    </div>
  )
}
