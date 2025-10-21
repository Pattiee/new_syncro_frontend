import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useFormater } from '../../hooks/useFormater'

export const CartItem = ({ item, removeItem }) => {
    const { id, name, unitPrice, qty } = item;
    const { currencyFormater } = useFormater();
    const navigate = useNavigate();

    const handleNavigateToProduct = id => navigate(`/product?id=${id}`);
    
  return (
    <div 
        className='flex bg-orange-100 dark:bg-gray-700 justify-between items-center rounded-lg p-2' 
        >
            <div className='flex flex-col justify-between w-full px-2 rounded-md'
                onClick={() => handleNavigateToProduct(id)}
            >
                <div>
                    <p className='font-semibold text-gray-800 dark:text-white'>{ name }</p>
                </div>

                <div className='flex justify-between'>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>@{ unitPrice } x { qty }</p>
                    <p className='text-sm text-gray-800 dark:text-gray-300'>{ currencyFormater.format(unitPrice * qty) }</p>
                </div>
            </div>

            <button
                onClick={removeItem}
                className='flex justify-center transition items-center px-4 text-sm text-red-500 hover:font-semibold'
            >
                X
            </button>
    </div>
  )
}
