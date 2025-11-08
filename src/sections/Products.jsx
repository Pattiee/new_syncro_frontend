import { motion } from "framer-motion";
import { CustomLoader2 } from "../components/loaders/CustomLoader2";
import { useProducts } from "../hooks/useProducts";
import ProductsPerCategory from "./ProductsPerCategory";

export const Products = () => {
  const { products, loading, errMessage, featured, setFeatured } =
    useProducts();

  if (loading) return <CustomLoader2 />;

  const handleToggleFeatured = () => setFeatured(!featured);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Featured Toggle */}
      <div className="mb-10 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
          Products {featured && "(Featured)"}
        </h2>

        <motion.button
          onClick={handleToggleFeatured}
          whileTap={{ scale: 0.95 }}
          animate={{ scale: featured ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`px-6 py-3 rounded-full font-medium transition-colors cursor-pointer
            ${
              featured
                ? "bg-orange-500 text-white dark:bg-orange-400 dark:text-black"
                : "bg-orange-100 text-orange-700 dark:bg-gray-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-700"
            }`}
        >
          {featured ? "Show All" : "Show Featured"}
        </motion.button>
      </div>

      {/* Products by Category */}
      {products && Object.entries(products).length > 0 ? (
        Object.entries(products).map(([category, data], idx) => (
          <ProductsPerCategory
            key={idx}
            productCategory={category}
            data={data}
          />
        ))
      ) : (
        <div className="text-center mt-16">
          {errMessage ? (
            <p className="text-red-500">{errMessage}</p>
          ) : (
            <span className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 animate-pulse">
              No products found.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
