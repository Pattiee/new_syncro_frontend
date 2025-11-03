import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AutoSlideButton } from "../toggles/AutoSlideButton";

export const ProductImagesModal = ({ product, modalOpen = false, closeModal }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(false);
  const images = product?.imageUrls || [];

  const showPreviousImage = () =>
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));

  const showNextImage = () =>
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));

  // Lock scroll when modal is open
  useEffect(() => {
    if (modalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [modalOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") showPreviousImage();
      if (e.key === "ArrowRight") showNextImage();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen, closeModal, images.length]);

  // Auto-slide interval
  useEffect(() => {
    if (!modalOpen || !autoSlide || images.length < 2) return;
    const interval = setInterval(showNextImage, 3000);
    return () => clearInterval(interval);
  }, [modalOpen, autoSlide, images.length]);

  if (!modalOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      {/* Top-right controls */}
      <div className="flex absolute top-4 right-8 gap-3 items-center">
        <AutoSlideButton autoSlide={autoSlide} toggleAutoSlide={setAutoSlide} />
        <button
          onClick={closeModal}
          className="top-6 right-8 text-white text-3xl font-bold hover:text-gray-300 focus:outline-none"
        >
          &times;
        </button>
      </div>

      <button
        onClick={showPreviousImage}
        className="absolute left-6 text-white text-4xl"
      >
        &#10094;
      </button>

      <motion.img
        key={images[currentImageIndex]}
        src={images[currentImageIndex]}
        alt={product.name}
        className="max-w-4xl max-h-[80vh] object-contain rounded-3xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />

      <button
        onClick={showNextImage}
        className="absolute right-6 text-white text-4xl"
      >
        &#10095;
      </button>
    </div>
  );
};
