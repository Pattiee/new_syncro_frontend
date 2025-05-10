import React from 'react';
import toast from 'react-hot-toast';
import { placeOrder } from '../slices/cartSlice'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createNewOrder } from '../services/order.service';

const CheckoutPage = () => {
  const username = useSelector(state => state.auth?.user.username);
  const cartItems = useSelector(state => state.cart?.items);

  const handlePlaceOrder = async () => {
    if(!username || !cartItems) toast.error("Error placing order.")
    const data = {}
    
    data.username = username;
    data.items = cartItems;
    data.shippingAddress = {};

    data.shippingAddress.addressId = "1234567890";
    data.shippingAddress.city = "Eldoret";
    data.shippingAddress.zip = "3160";
    data.shippingAddress.country = "Kenya";

    // if (data.username && data.items && data.shippingAddress) placeOrder(data);
    await createNewOrder(data).then(res => {
      toast.success("Order created successfully");
    }).catch(err => {
      toast.error(err?.message || "Unknown error occured")
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {/* Checkout Header */}
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full p-3 mt-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full p-3 mt-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Phone Number</label>
                <input
                  type="text"
                  placeholder="123-456-7890"
                  className="w-full p-3 mt-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9876 5432"
                  className="w-full p-3 mt-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-3 mt-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full p-3 mt-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="mt-8 bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Item 1</span>
              <span className="text-gray-800 dark:text-gray-100">$50.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Item 2</span>
              <span className="text-gray-800 dark:text-gray-100">$30.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Shipping</span>
              <span className="text-gray-800 dark:text-gray-100">$5.00</span>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-600 pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>$85.00</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-primary dark:bg-primary-600 text-white py-3 mt-8 rounded-lg hover:bg-primary-600 dark:hover:bg-primary-700 transition"
        >
          Complete Checkout
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
