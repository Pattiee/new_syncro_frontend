import { motion, AnimatePresence } from "framer-motion";
import { CustomLoader2 } from "../components/loaders/CustomLoader2";
import { useProducts } from "../hooks/useProducts";
import ProductsPerCategory from "./ProductsPerCategory";

export const Products = () => {
  const {
    products,
    categories,
    loading,
    errMessage,
    filter,
    setCategoryFilter,
    featured,
    setFeatured,
  } = useProducts();

  if (loading) return <CustomLoader2 />;

  const handleToggleFeatured = () => setFeatured(!featured);

  const handleFilterByCategory = categoryName => {
    setCategoryFilter(prev => prev?.toLowerCase() === categoryName?.toLowerCase() ? "" : categoryName);
  };

  // const getProductCount = categoryName => products?.filter(p => p?.category.toLowerCase() === categoryName?.toLowerCase()).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Category & Featured Buttons */}
      {categories.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold text-orange-600 dark:text-orange-400">
            Browse by Category
          </h2>
          <div className="flex flex-wrap gap-3">
            {/* Featured Button */}
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
              Featured
            </motion.button>

            {/* Dynamic Categories */}
            {categories.map(category => {
              const isSelected = filter.toLowerCase() === category?.name.toLowerCase();
              const count = 0

              return (
                <motion.button
                  key={category.id}
                  onClick={() => handleFilterByCategory(category.name)}
                  whileTap={{ scale: 0.95 }}
                  animate={{ scale: isSelected ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors cursor-pointer
                    ${ isSelected
                        ? "bg-orange-500 text-white dark:bg-orange-400 dark:text-black"
                        : "bg-orange-100 text-orange-700 dark:bg-gray-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-700"
                    }`}
                >
                  {category.name}
                  {count > 0 && (
                    <span className="px-2 bg-white dark:bg-gray-900 rounded-full text-xs font-semibold">
                      {count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Display by Category */}
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
