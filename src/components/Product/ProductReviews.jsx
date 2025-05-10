import React from 'react';

const ProductReviews = () => {
  return (
    <div className="mt-16">
      <h2 className="text-xl font-semibold text-primary dark:text-primary mb-4">
        Customer Reviews
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
          <p className="font-medium text-gray-700 dark:text-gray-100">Jane Doe</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            "Amazing quality and super comfortable!"
          </p>
        </div>

        <div>
          <p className="font-medium text-gray-700 dark:text-gray-100">John Smith</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            "Battery lasts forever, and sound is 🔥!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
