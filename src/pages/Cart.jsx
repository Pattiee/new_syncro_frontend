import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart, removeItem } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { currencyFormater } from '../helpers/formater'
import { MAIN_LINKS_FRONTEND } from '../links';

const Cart = () => {
    const cartItems = useSelector(state => state?.cart?.items || []);
    const user = useSelector(state => state?.auth?.user || null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartTotals = cartItems?.reduce((sum, item) => sum + item?.price * item?.quantity, 0);

    const handleClearCart = () => dispatch(clearCart());

    const handleRemoveCartItem = (id) => (e) => {
        e.stopPropagation();
        dispatch(removeItem(id ?? ''));
    }

    const handleNavigateToProduct = id => {
        if (id) navigate(`/product?id=${id}`);
    }

    const handleNavigateCheckout = () => {
        if (user && user?.username) {
            navigate(MAIN_LINKS_FRONTEND.CHECKOUT);
        } else {
            navigate(MAIN_LINKS_FRONTEND.AUTH);
        }
    }

    const handleNavigateHome = () => navigate('/');

    return (
        <div className='max-w-xl p-6 m-auto bg-white shadow-xl dark:bg-gray-800 rounded-2xl sm:px-8 sm:py-10'>
            <h2 className='mb-6 text-2xl font-bold text-center text-orange-600 dark:text-orange-400'>Your cart</h2>
            {cartItems?.length > 0 && (
                <>
                    <ul className='space-y-5'>
                        {cartItems.map(({ id, name, price, quantity, inStock }) => (
                            <li key={id}
                                onClick={() => handleNavigateToProduct(id)}
                                className='flex justify-between items-center border-b pb-3 border-gray-200 dark:border-gray-700 transition-transform duration-300 hover:scale-[1.01]'
                            >
                                <div>
                                    <p className='font-semibold text-gray-800 dark:text-white'>{ name }</p>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>@{ price } x { quantity }</p>
                                    <p className='text-sm text-gray-600 dark:text-gray-300'>{ currencyFormater.format(price * quantity) }</p>
                                </div>

                                <button
                                    onClick={handleRemoveCartItem(id)}
                                    className='text-sm text-red-500 hover:underline'
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className='mt-6 text-lg font-semibold text-right text-gray-800 dark:text-white'>
                        Total: <span className='text-orange-600 dark:text-orange-400'>{ currencyFormater.format(cartTotals?.toFixed(2)) }</span>
                    </div>

                    <div className='flex mt-6 space-y-3'>
                        <button
                            onClick={handleNavigateCheckout}
                            className='w-full py-2 text-white transition bg-green-600 rounded-full hover:bg-green-700'
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}

            {cartItems?.length <= 0 && (
                <p className='mt-6 text-center text-gray-400'>Your cart is empty.</p>
            )}

            <div className='flex rounded-3xl justify-between mt-3'>
                {/* Clear cart */}
                <p
                    disabled={ cartItems?.length <= 0 }
                    onClick={handleClearCart}
                    className='px-4 font-mono py-2 text-red-500 transition border-none rounded-full dark:text-red-400 hover:bg-red-100 dark:hover:bg-orange-900 disabled:opacity-50 disabled:cursor-not-allowed hover:disabled:bg-transparent dark:hover:disabled:bg-transparent'
                >
                    Clear cart
                </p>

                {/* Continue shopping */}
                <p
                    onClick={handleNavigateHome}
                    className='flex px-4 py-2 text-orange-600 transition border-none border-orange-500 rounded-full float-end font-mono dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900'
                >
                    Continue Shopping
                </p>
            </div>
        </div>
    )
}

export default Cart
