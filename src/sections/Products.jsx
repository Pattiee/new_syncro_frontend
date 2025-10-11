import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from '../components/Loader';
import { SearchBar } from '../components/SearchBar';
import ProductCard from '../components/Product/ProductCard';
import { useProducts } from '../hooks/useProducts';

export const Products = () => {
  const {
    products,
    categories,
    loading,
    errMessage,
    filter,
    setFilter,
    featured,
    setFeatured,
    setSearchQuery
  } = useProducts();

  const handleUpdateFilter = (category) => {
    const current = (filter ?? '').trim().toLowerCase();
    const selected = category?.name?.trim().toLowerCase();
    setFilter(current === selected ? '' : category?.name);
  };

  const handleIsFeatured = () => setFeatured(!featured);
  const handleSearch = (query = '') => setSearchQuery(query.trim().toLowerCase());

  if (loading) return <Loader />;

  const filteredProducts = products.filter(product => {
    if (featured && !product.featured) return false;
    if (filter && product.category.toLowerCase() !== filter.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Search */}
      <SearchBar onSearch={handleSearch} />

      {/* Categories / Featured */}
      {categories.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-orange-600 dark:text-orange-400">
            Browse by Category
          </h2>
          <div className="flex flex-wrap gap-3">
            {/* Featured Button */}
            <motion.button
              onClick={handleIsFeatured}
              whileTap={{ scale: 0.95 }}
              animate={{ scale: featured ? 1.05 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`flex px-6 py-3 rounded-full font-medium transition-colors hover:bg-orange-200 dark:hover:bg-orange-700 cursor-pointer ${
                featured
                  ? 'bg-orange-500 text-white dark:bg-orange-400 dark:text-black'
                  : 'bg-orange-100 text-orange-700 dark:bg-gray-700 dark:text-orange-300'
              }`}
            >
              Featured
            </motion.button>

            {/* Categories */}
            {categories.map(category => {
              const isSelected = filter.toLowerCase() === category.name.toLowerCase();
              const productCount = products.filter(p => p.category.toLowerCase() === category.name.toLowerCase()).length;

              return (
                <motion.button
                  key={category.id}
                  onClick={() => handleUpdateFilter(category)}
                  whileTap={{ scale: 0.95 }}
                  animate={{ scale: isSelected ? 1.05 : 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`flex px-6 py-3 rounded-full font-medium transition-colors hover:bg-orange-200 dark:hover:bg-orange-700 cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500 text-white dark:bg-orange-400 dark:text-black'
                      : 'bg-orange-100 text-orange-700 dark:bg-gray-700 dark:text-orange-300'
                  }`}
                >
                  {category.name}
                  {isSelected && productCount > 0 && (
                    <span className="ml-2 px-2 bg-white dark:bg-gray-900 rounded-full text-xs">{productCount}</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filtered Products with animated transitions */}
      {filteredProducts.length > 0 ? (
        <div>
          {filter && (
            <h2 className="mb-4 text-2xl font-semibold text-orange-600 dark:text-orange-400">{filter}</h2>
          )}
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.03, duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
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
