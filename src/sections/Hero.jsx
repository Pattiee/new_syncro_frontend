import React from "react";
import { motion } from "framer-motion";
import { SearchBar } from "../components/SearchBar";
import { useProducts } from "../hooks/useProducts";
import { CategoryNav } from "../components/nav/CategoryNav";

const SHOP_NAME = process.env.REACT_APP_SHOP_NAME || "Our Store";
const TAG_LINE =
  process.env.REACT_APP_TAG_LINE ||
  "Your favorite products, just a click away.";

const Hero = () => {
  const { categories, setSearchQuery } = useProducts();

  const handleSearch = (query = "") =>
    setSearchQuery(query.trim().toLowerCase());

  return (
    <section className="relative flex flex-col justify-around items-center h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-100 px-6 overflow-hidden transition-colors duration-500">
      {/* Overlay */}
      {categories?.length > 0 && <CategoryNav />}
      <div className="absolute inset-0 bg-white/20 dark:bg-black/30 backdrop-blur-sm pointer-events-none" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center space-y-6"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Welcome to{" "}
          <span className="text-orange-600 dark:text-orange-400 drop-shadow-sm">
            {SHOP_NAME}
          </span>
        </h1>

        <p className="text-lg sm:text-xl font-light text-gray-700 dark:text-gray-300">
          {TAG_LINE}
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto w-full">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* CTA */}
        <motion.a
          href="/shop"
          whileHover={{ scale: 1.05 }}
          className="inline-block mt-6 px-6 py-3 rounded-full bg-orange-600 text-white font-medium shadow-md hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 transition"
        >
          Shop Now
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Hero;
