import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useProducts } from "../../hooks/useProducts";

export const CategoryNav = () => {
  const { categories, loading } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading || !categories?.length) return null;

  const params = new URLSearchParams(location.search);
  const currentCategory = params.get("name") || "";

  const handleNavigate = (name) => {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/category/${encodeURIComponent(slug)}`);
  };

  return (
    <div className="w-full bg-orange-50 dark:bg-gray-900 border-b border-orange-100 dark:border-gray-700 shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-3 sm:gap-4 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => {
          const active = currentCategory === cat.name;
          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigate(cat.name)}
              className={`whitespace-nowrap px-5 py-2 sm:px-6 sm:py-2.5 rounded-full font-medium text-sm sm:text-base transition-colors duration-200 shadow-sm ${
                active
                  ? "bg-orange-500 text-white dark:bg-orange-400 dark:text-black"
                  : "bg-orange-100 text-orange-700 dark:bg-gray-800 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
