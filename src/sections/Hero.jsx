import React, { Fragment, useState } from 'react';
import { motion } from 'framer-motion';

const SHOP_NAME = process.env.REACT_APP_SHOP_NAME || 'our store';
const TAG_LINE = process.env.REACT_APP_TAG_LINE || 'Your favorite products, just a click away.';

const Hero = () => {
  const [images] = useState([
    '../assets/images/lg.png',
    '../assets/images/pk.png',
  ]);

  return (
    <>
      <div className="relative py-24 h-[50vh] w-full overflow-hidden bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 text-gray-100 px-6 text-center transition-colors duration-300">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="absolute top-0 left-0 w-[300%] h-full flex animate-slide">
              {images && images.concat(images).map((src, index) => (
                  <div key={index} className="flex-shrink-0 w-1/3 h-full">
                      <img
                            src={src}
                            alt={`Hero ${index}`}
                            className="object-cover w-full h-full opacity-60"
                        />
                </div>
              ))}
            </div>

            {/* overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-10" />

            {/* content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <h1 className="mb-3 font-serif text-4xl font-semibold text-gray-100 sm:text-5xl animate-slide-in">
                Welcome to {SHOP_NAME}
              </h1>
              <p className="mb-6 text-xl font-light text-gray-100 sm:text-xl animate-fade-in">
                {TAG_LINE}
              </p>
              <a
                href="/shop"
                className="px-6 py-2 font-semibold text-orange-500 transition-all duration-300 ease-in-out bg-gray-100 rounded-full shadow-lg hover:bg-gray-200"
              >
                Shop Now
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Hero;
