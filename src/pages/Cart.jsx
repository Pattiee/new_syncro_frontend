import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart, removeItem } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { currencyFormater } from '../helpers/formater'
import { MAIN_LINKS_FRONTEND } from '../links';

const Cart = () => {
    const cartItems = useSelector((state) => state?.cart?.items);
    const user = useSelector(state => state.auth?.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartTotals = cartItems?.reduce((sum, item) => sum + item?.price * item?.quantity, 0);

    const handleClearCart = () => {
        dispatch(clearCart());
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
        <div className='max-w-xl p-6 mx-auto mt-10 bg-white shadow-lg dark:bg-gray-800 rounded-2xl sm:px-8 sm:py-10'>
            <h2 className='mb-6 text-2xl font-bold text-center text-orange-600 dark:text-orange-400'>Your cart</h2>
            {cartItems?.length > 0 && (
                <>
                    <ul className='space-y-5'>
                        {cartItems?.map(({ id, name, price, quantity }) => (
                            <li key={id}
                                onClick={() => navigate(`/product?id=${id}`)}
                                className='flex justify-between items-center border-b pb-3 border-gray-200 dark:border-gray-700 transition-transform duration-300 hover:scale-[1.01]'
                            >
                                <div>
                                    <p className='font-semibold text-gray-800 dark:text-white'>{name}</p>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>@{price} x {quantity}</p>
                                    <p className='text-sm text-gray-600 dark:text-gray-300'>{ currencyFormater.format((price * quantity)) }</p>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(removeItem(id ?? ''));
                                    }}
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

                    <div className='mt-6 space-y-3'>
                        <button
                            onClick={handleNavigateCheckout}
                            className='w-full py-2 text-white transition bg-green-600 rounded-full hover:bg-green-700'
                        >
                            Proceed to Checkout
                        </button>

                        <button
                            onClick={handleClearCart}
                            className='w-full py-2 text-white transition bg-red-500 rounded-full hover:bg-red-600'
                        >
                            Clear cart
                        </button>
                    </div>
                </>
            )}

            {cartItems?.length === 0 && (
                <p className='mt-6 text-center text-gray-400'>Your cart is empty.</p>
            )}

            <div className='mt-6'>
                <button
                    onClick={handleNavigateHome}
                    className='w-full py-2 text-orange-600 transition border border-orange-500 rounded-full dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900'
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    )
}

export default Cart
