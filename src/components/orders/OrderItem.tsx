import React from 'react';

// Define the structural data contract for a single order item instance line
export interface OrderItemRecord {
  id: string | number;
  name: string;
  quantity: number;
  unitPrice: number;
  subTotal?: number;
}

// Define the incoming props contract for the component wrapper
export interface OrderItemProps {
  item: OrderItemRecord | null | undefined;
}

export const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
  // Early guard to prevent destructuring undefined or null values
  if (!item) return null;

  const { name, quantity, unitPrice } = item;

  return (
    <>
      <div className="flex bg-orange-100 dark:bg-orange-950/30 p-3 rounded-lg justify-between items-center text-sm text-gray-800 dark:text-gray-200 gap-4 mb-2">
        <span className="font-medium flex-1 truncate">
          {name}
        </span>
        
        <span className="text-gray-600 dark:text-gray-400 tabular-nums">
          \${unitPrice.toFixed(2)}
        </span>
        
        <span className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-gray-700">
          x{quantity}
        </span>
      </div>
    </>
  );
};

export default OrderItem;