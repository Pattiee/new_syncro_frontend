import React from 'react';

const ProductDetails = ({ product }) => {
  return (
    <div className="mt-16 max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-300 pb-2">
        Product Details
      </h2>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md p-6 space-y-6">
        {/* Classic Specs Table */}
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Condition */}
            <tr className="py-2">
              <th className="w-1/3 px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">
                Condition
              </th>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300 italic">
                {product?.condition || 'N/A'}
              </td>
            </tr>

            {/* Category */}
            {product?.category && (
              <tr className="py-2">
                <th className="w-1/3 px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">
                  Category
                </th>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  {product.category}
                </td>
              </tr>
            )}

            {/* Stock */}
            {product?.stock !== undefined && product?.stock !== null && (
              <tr className="py-2">
                <th className="w-1/3 px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">
                  Stock
                </th>
                <td
                  className={`px-4 py-2 ${
                    product.stock <= 5
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {product.stock <= 5
                    ? `Hurry! Only ${product.stock} left.`
                    : `${product.stock} units available`}
                </td>
              </tr>
            )}

            {/* Price */}
            {product?.price !== undefined && (
              <tr className="py-2">
                <th className="w-1/3 px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">
                  Price
                </th>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  ${product.price.toFixed(2)}
                </td>
              </tr>
            )}

            {/* Discount */}
            {product?.percent_discount > 0 && (
              <tr className="py-2">
                <th className="w-1/3 px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">
                  Discount
                </th>
                <td className="px-4 py-2 text-green-600 dark:text-green-400">
                  {product.percent_discount}% OFF
                </td>
              </tr>
            )}

            {/* Description */}
            <tr className="py-2">
              <th className="w-1/3 px-4 py-2 font-semibold text-gray-800 dark:text-gray-200">
                Description
              </th>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                {product?.desc || 'No description available.'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetails;
