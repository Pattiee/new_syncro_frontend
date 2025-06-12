import React from 'react'

export const OrderItem = ({ item }) => {
    const { id, name, price, quantity } = item;
    return (
        <>
            <div>
                <span>
                    { name }
                </span>
                
                <span>
                    { price }
                </span>
                
                <span>{ quantity }</span>
            </div>
        </>
    )
}
