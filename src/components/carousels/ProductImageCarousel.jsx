import React, { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';

export const ProductImageCarousel = memo(({ images = [], name = '', showModal, onShowModal }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length < 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  if (images.length < 1) {
    return (
      <img
        src="https://via.placeholder.com/500"
        alt="Placeholder"
        className="object-cover w-full h-full rounded-2xl"
      />
    );
  }

  return (
    <div 
      className="aspect-[4/3] w-full rounded-2xl bg-transparent overflow-hidden" 
      onClick={onShowModal}
    >
      { !showModal && (
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
          <motion.img
            key={images[currentImageIndex]}
            src={images[currentImageIndex]}
            alt={name}
            className="w-full h-full object-contain rounded-2xl"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </div>
      )}
    </div>
  );
});
