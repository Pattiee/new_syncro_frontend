import React from 'react'
import { OrderItem } from './OrderItem'

export const OrderItems = ({ items = [] }) => {
    return (
        <>
            <div>
                <div>
                    <span className='text-lg font-bold text-gray-900'>Items</span>
                </div>

                <div>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Unit price</th>
                            <th>Quantity</th>
                            <th>Subtotals</th>
                        </tr>
                        
                        {items && items.map(({ name, price, quantity }) => (
                            <tr className='bg-gray-700'>
                                <td>{name}</td>
                                <td>{price}</td>
                                <td>{quantity}</td>
                                <td>{ price * quantity }</td>
                            </tr>
                        ))}
                    </table>
                </div>
            </div>
        </>
    )
}
