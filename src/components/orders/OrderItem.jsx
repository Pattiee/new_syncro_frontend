import React from 'react'

export const OrderItem = ({ item }) => {
    const { id, name, quantity, unitPrice, subTotal } = item;
    return (
        <>
            <div className='flex bg-orange-100'>
                <span>
                    { name }
                </span>
                
                <span>
                    { unitPrice }
                </span>
                
                <span>{ quantity }</span>
            </div>
        </>
    )
}
