import React from "react";
import { motion } from "framer-motion";

const SHOP_NAME = process.env.REACT_APP_SHOP_NAME || "Our Store";
const TAG_LINE =
  process.env.REACT_APP_TAG_LINE ||
  "Your favorite products, just a click away.";

const Hero = () => {
  return (
    <div className="relative h-[35vh] w-full flex items-center justify-center bg-transparent text-gray-700 px-6">
      {/* Overlay */}
      <div className="absolute inset-0 bg-transparent" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 text-center"
      >
        <h1 className="mb-2 font-serif text-3xl text-orange-500 font-bold sm:text-4xl">
          Welcome to {SHOP_NAME}
        </h1>
        <p className="mb-4 text-base text-gray-500 dark:text-white font-light sm:text-lg">{TAG_LINE}</p>
        <a
          href="/shop"
          className="px-5 py-2 font-semibold text-orange-600 bg-gray-100 rounded-full shadow hover:bg-gray-200 transition"
        >
          Shop Now
        </a>
      </motion.div>
    </div>
  );
};

export default Hero;
