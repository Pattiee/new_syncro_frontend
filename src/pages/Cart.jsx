import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, clearCart, removeItem } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
    const cartItems = useSelector((state) => state?.cart?.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartTotals = cartItems?.reduce((sum, item) => sum + item?.price * item?.quantity, 0);

    const handleCheckout = async () => {
        
    }

    const handleClearCart = async () => {
        dispatch(clearCart());
    }

    return (
        <div className='max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg sm:px-8 sm:py-10'>
            <h2 className='text-2xl font-bold text-orange-600 dark:text-orange-400 mb-6 text-center'>Your cart</h2>
            {(cartItems?.length > 0) && (
                <>
                    <ul className='space-y-5'>
                        {cartItems?.map(item => (
                            <li key={item.id}
                                onClick={() => navigate(`/product?id=${item.id}`)}
                                className='flex justify-between items-center border-b pb-3 border-gray-200 dark:border-gray-700 transition-transform duration-300 hover:scale-[1.01]'
                            >
                                <div>
                                    <p className='font-semibold text-gray-800 dark:text-white'>{item?.name}</p>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>x {item?.quantity}</p>
                                    <p className='text-sm text-gray-600 dark:text-gray-300'>USD { (item?.price * item?.quantity).toFixed(2) }</p>
                                </div>

                                <button
                                    onClick={() => dispatch(removeItem(item?.id ?? 0))}
                                    className='text-red-500 hover:underline text-sm'
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className='mt-6 text-right font-semibold text-lg text-gray-800 dark:text-white'>
                        Total: <span className='text-orange-600 dark:text-orange-400'>USD { cartTotals?.toFixed(2) }</span>
                    </div>

                    <div className='mt-6 space-y-3'>
                        <button
                            onClick={() => navigate('/checkout')}
                            className='w-full rounded-full py-2 bg-green-600 text-white  hover:bg-green-700 transition'
                        >
                            Proceed to Checkout
                        </button>

                        <button
                            onClick={() => handleClearCart()}
                            className='w-full py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition'
                        >
                            Clear cart
                        </button>
                    </div>
                </>
            )}

            {cartItems?.length === 0 && (
                <p className='text-center text-gray-400 mt-6'>Your cart is empty.</p>
            )}

            <div className='mt-6'>
                <button
                    onClick={() => navigate('/')}
                    className='w-full py-2 border border-orange-500 text-orange-600 dark:text-orange-400 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900 transition'
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    )
}

export default Cart
