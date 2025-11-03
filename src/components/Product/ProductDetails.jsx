import React from "react";
import { motion } from "framer-motion";

const ProductDetails = ({ product = {} }) => {
  const {
    condition = "N/A",
    category,
    stock,
    price,
    percent_discount,
    specs,
  } = product;

  const stockLabel =
    stock <= 5
      ? `Hurry! Only ${stock} left`
      : `${stock ?? 0} units available`;

  const isLowStock = stock !== undefined && stock <= 5;
  const hasDiscount = percent_discount && percent_discount > 0;

  const details = [
    { label: "Condition", value: condition },
    category && { label: "Category", value: category },
    stock !== undefined && {
      label: "Stock",
      value: stockLabel,
      valueClass: isLowStock ? "text-red-600 dark:text-red-400" : "",
    },
    price !== undefined && {
      label: "Price",
      value: `$${price.toFixed(2)}`,
    },
    hasDiscount && {
      label: "Discount",
      value: `${percent_discount}% OFF`,
      valueClass: "text-green-600 dark:text-green-400 font-medium",
    },
    {
      label: "Specs",
      value: specs || "No specs available.",
      valueClass: "leading-relaxed",
    },
  ].filter(Boolean);

  return (
    <section className="mt-16 max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-300 dark:border-gray-700 pb-2">
        Product Details
      </h2>

      <motion.div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-md ring-1 ring-gray-100 dark:ring-gray-800 p-6 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <dl className="divide-y divide-gray-200 dark:divide-gray-700">
          {details.map((item, index) => (
            <DetailItem
              key={item.label}
              index={index}
              {...item}
            />
          ))}
        </dl>
      </motion.div>
    </section>
  );
};

const DetailItem = ({ label, value, valueClass = "", index }) => (
  <motion.div
    className="flex flex-col sm:flex-row sm:items-start justify-between py-3 sm:py-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.25 }}
  >
    <dt className="w-full sm:w-1/3 font-medium text-gray-800 dark:text-gray-200 mb-1 sm:mb-0">
      {label}
    </dt>
    <dd
      className={`w-full sm:w-2/3 text-gray-700 dark:text-gray-300 ${valueClass}`}
    >
      {value}
    </dd>
  </motion.div>
);

export default ProductDetails;