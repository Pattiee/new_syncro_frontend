import React from 'react'
import { ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { currencyFormater } from '../helpers/formater'

const FloatingCheckoutButton = () => {
    const cartItems = useSelector((state) => state?.cart?.items);
    const cartTotals = cartItems?.reduce((sum, item) => sum + item?.price * item?.quantity, 0).toFixed(2);

    // todo: if no username: => auth

    const navigate = useNavigate();


    if (cartTotals > 0) return (
        <button
            onClick={() => navigate('/checkout')}
            className='fixed flex flex-col items-center justify-center px-4 py-2 mx-auto text-white transition bg-orange-500 rounded-full shadow-lg bottom-6 right-6 center hover:bg-orange-600'
        >
            <span className='flex'>
                <ShoppingCart absoluteStrokeWidth alignmentBaseline='auto' allowReorder='yes' className='mx-1' /> {currencyFormater.format(cartTotals)}
            </span>
        </button>
    )
}

export default FloatingCheckoutButton
