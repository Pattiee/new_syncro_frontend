import React from 'react';

const ProductDetails = ({ product }) => {
  return (
    <div className="mt-16">
      <h2 className="text-xl font-semibold text-primary dark:text-primary mb-4">
        Product Details
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
          <p className="font-medium text-gray-700 dark:text-gray-100">Condition</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            {product?.condition || 'N/A'}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-700 dark:text-gray-100">Description</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            {product?.desc || 'No description available.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
