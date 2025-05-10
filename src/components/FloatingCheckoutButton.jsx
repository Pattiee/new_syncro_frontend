import React from 'react'
import { ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const FloatingCheckoutButton = () => {
    const cartItems = useSelector((state) => state?.cart?.items);
    const cartTotals = cartItems?.reduce((sum, item) => sum + item?.price * item?.quantity, 0).toFixed(2);

    const navigate = useNavigate();


    if (cartTotals > 0) return (
        <button
            onClick={() => navigate('/checkout')}
            className='px-4 py-2 fixed bottom-6 right-6 center mx-auto bg-orange-500 text-white rounded-full flex flex-col items-center justify-center shadow-lg hover:bg-orange-600 transition'
        >
            <span>Checkout: USD {cartTotals}</span>
        </button>
    )
}

export default FloatingCheckoutButton
