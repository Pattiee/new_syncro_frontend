import { ShoppingCart } from 'lucide-react';
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const FloatingCart = () => {
    const cartItems = useSelector(state => state?.cart?.items);
    const navigate = useNavigate();
    const totalQuantity = cartItems?.reduce((sum, item) => sum + item?.quantity, 0);
    const uniqueItemCount = cartItems?.length;


    return (
        <button
            onClick={() => navigate('/cart')}
            className='fixed bottom-6 right-6 bg-orange-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-orange-600 transition'
        >
            <div className='relative'>
                <ShoppingCart size={24} />
                {uniqueItemCount > 0 && (
                    <span className='absolute -top-2 -right-2 bg-white text-orange-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                        { uniqueItemCount }
                    </span>
                )}
            </div>
        </button>
    )
}

export default FloatingCart
