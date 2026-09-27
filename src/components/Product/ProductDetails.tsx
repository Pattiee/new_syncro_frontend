import React from "react";
import { motion } from "framer-motion";
import { useFormater } from "../../hooks/useFormater";

// Structural data contract interface mapping full product entity fields
export interface DetailedProductRecord {
  condition?: string;
  category?: string;
  stock?: number;
  price?: number;
  percent_discount?: number;
  specs?: string;
  [key: string]: unknown;
}

// Interface defining the incoming component props contract
export interface ProductDetailsProps {
  product?: DetailedProductRecord;
  discountedPrice?: number | string;
}

// Structural template interface matching a single rows key-value presentation block
interface DetailItemType {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}

interface DetailItemProps extends DetailItemType {
  index: number;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product = {}, 
  discountedPrice = 0 
}) => {
  const {
    condition = "N/A",
    category,
    stock,
    price,
    percent_discount,
    specs,
  } = product;
  
  const { currencyFormater, percentageFormater } = useFormater();

  const isLowStock = stock !== undefined && stock <= 5;
  const hasDiscount = percent_discount !== undefined && percent_discount > 0;

  const priceTag = (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-orange-600 dark:text-orange-400">
        {currencyFormater.format(Number(discountedPrice))}
      </span>
      {price !== undefined && (
        <span className="text-sm font-medium line-through text-gray-400 dark:text-gray-500">
          {currencyFormater.format(price)}
        </span>
      )}
    </div>
  );

  // Explicit type assertion required to map dynamic filters securely without type inference clashes
  const details = ([
    { label: "Condition", value: condition },
    category ? { label: "Category", value: category } : null,
    stock !== undefined ? {
      label: "Stock",
      value: stock || 0,
      valueClass: isLowStock ? "text-red-600 dark:text-red-400 font-medium" : "",
    } : null,
    price !== undefined ? {
      label: "Price",
      value: priceTag,
    } : null,
    hasDiscount && percent_discount !== undefined ? {
      label: "Discount",
      value: `${percentageFormater.format(percent_discount)} Off`,
      valueClass: "text-green-600 dark:text-green-400 font-medium",
    } : null,
    {
      label: "Specs",
      value: specs || "No specs available.",
      valueClass: "leading-relaxed whitespace-pre-line",
    },
  ].filter(Boolean) as DetailItemType[]);

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
            <DetailItem key={item.label} index={index} {...item} />
          ))}
        </dl>
      </motion.div>
    </section>
  );
};

const DetailItem: React.FC<DetailItemProps> = ({ 
  label, 
  value, 
  valueClass = "", 
  index 
}) => (
  <motion.div
    className="flex flex-col sm:flex-row sm:items-start justify-between py-3 sm:py-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.25 }}
  >
    <dt className="w-full sm:w-1/3 font-medium text-gray-800 dark:text-gray-200 mb-1 sm:mb-0 text-sm">
      {label}
    </dt>
    <dd className={`w-full sm:w-2/3 text-gray-700 dark:text-gray-300 text-sm ${valueClass}`}>
      {value}
    </dd>
  </motion.div>
);

export default ProductDetails;