import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AutoSlideButton } from "../toggles/AutoSlideButton";

// Structural data contract interface mapping full product entity fields
export interface ModalProductRecord {
  name: string;
  imageUrls?: string[];
  [key: string]: unknown;
}

// Define the incoming props contract for the component wrapper
export interface ProductImagesModalProps {
  product: ModalProductRecord;
  modalOpen?: boolean;
  closeModal: () => void;
}

export const ProductImagesModal: React.FC<ProductImagesModalProps> = ({
  product,
  modalOpen = false,
  closeModal,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [autoSlide, setAutoSlide] = useState<boolean>(false);
  const images: string[] = product?.imageUrls || [];

  const showPreviousImage = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const showNextImage = () =>
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  // Lock scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalOpen]);

  // Keyboard shortcuts (Rewritten to safely avoid closure stale state freezes)
  useEffect(() => {
    if (!modalOpen) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") showPreviousImage();
      if (e.key === "ArrowRight") showNextImage();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen, closeModal, images.length, currentImageIndex]); // Include dependencies to pass closure checks securely

  // Auto-slide interval orchestration
  useEffect(() => {
    if (!modalOpen || !autoSlide || images.length < 2) return;
    const interval = setInterval(showNextImage, 3000);
    return () => clearInterval(interval);
  }, [modalOpen, autoSlide, images.length]);

  if (!modalOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Top-right controls */}
      <div className="flex absolute top-4 right-8 gap-3 items-center z-50">
        <AutoSlideButton autoSlide={autoSlide} toggleAutoSlide={setAutoSlide} />
        <button
          type="button"
          onClick={closeModal}
          className="text-white text-3xl font-bold hover:text-gray-300 focus:outline-none transition-colors"
          aria-label="Close Modal"
        >
          &times;
        </button>
      </div>

      <button
        type="button"
        onClick={showPreviousImage}
        className="absolute left-6 text-white text-4xl hover:text-gray-300 font-bold focus:outline-none select-none z-40"
        aria-label="Previous Image"
      >
        ❮
      </button>

      <motion.img
        key={images[currentImageIndex]}
        src={images[currentImageIndex]}
        alt={`${product.name} - View ${currentImageIndex + 1}`}
        className="max-w-4xl max-h-[80vh] object-contain rounded-3xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />

      <button
        type="button"
        onClick={showNextImage}
        className="absolute right-6 text-white text-4xl hover:text-gray-300 font-bold focus:outline-none select-none z-40"
        aria-label="Next Image"
      >
        ❯
      </button>
    </div>
  );
};

export default ProductImagesModal;