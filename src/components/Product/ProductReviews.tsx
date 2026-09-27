import React, { useState, useMemo, useEffect, memo } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

// ==========================================
// Type & Interface Specifications
// ==========================================

export interface ReviewData {
  id: string | number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ReviewFormFields {
  name: string;
  rating: number;
  comment: string;
}

export interface ProductMetaPayload {
  id?: string | number;
  reviews?: ReviewData[];
  [key: string]: unknown;
}

interface StarRatingProps {
  rating: number;
}

interface ReviewItemProps {
  review: ReviewData;
}

interface ReviewListProps {
  reviews: ReviewData[];
}

interface ReviewFormProps {
  onSubmit: (review: ReviewFormFields) => void;
}

interface ScrollTopButtonProps {
  onClick: () => void;
}

interface ProductReviewsProps {
  product?: ProductMetaPayload;
  productId?: string | number; // Backwards compatibility for parent parameters
}

// ─── Reusable Star Rating Component ───────────────────────────────
const StarRating: React.FC<StarRatingProps> = memo(({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const index = i + 1;
    if (index <= Math.floor(rating)) {
      return <FaStar key={index} className="text-yellow-400" />;
    }
    if (index - rating < 1) {
      return <FaStarHalfAlt key={index} className="text-yellow-400" />;
    }
    return <FaRegStar key={index} className="text-yellow-400" />;
  });
  return <div className="flex">{stars}</div>;
});

StarRating.displayName = "StarRating";

// ─── Review Item ─────────────────────────────────────────────────
const ReviewItem: React.FC<ReviewItemProps> = memo(({ review }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
    <div className="flex items-center justify-between mb-1">
      <p className="font-semibold text-gray-800 dark:text-gray-200">{review.name}</p>
      <StarRating rating={review.rating} />
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400 italic">{review.comment}</p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{review.date}</p>
  </div>
));

ReviewItem.displayName = "ReviewItem";

// ─── Review List ─────────────────────────────────────────────────
const ReviewList: React.FC<ReviewListProps> = memo(({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400 italic text-sm">
        No reviews yet. Be the first to review this product!
      </p>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md p-6 space-y-6">
      {reviews.map((r) => (
        <ReviewItem key={r.id} review={r} />
      ))}
    </div>
  );
});

ReviewList.displayName = "ReviewList";

// ─── Review Form ─────────────────────────────────────────────────
const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState<ReviewFormFields>({ name: '', rating: 0, comment: '' });

  const handleChange = (field: keyof ReviewFormFields, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.comment || form.rating === 0) return;
    onSubmit(form);
    setForm({ name: '', rating: 0, comment: '' });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md p-6 mt-8">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 font-medium">Your Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 text-sm rounded border border-gray-300 dark:border-gray-700 
                       focus:ring focus:ring-orange-200 dark:focus:ring-orange-500 focus:outline-none
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 font-medium">Rating</label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => handleChange('rating', star)} className="focus:outline-none">
                {star <= form.rating ? (
                  <FaStar className="text-yellow-400 text-xl" />
                ) : (
                  <FaRegStar className="text-yellow-400 text-xl" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1 font-medium">Comment</label>
          <textarea
            required
            className="w-full px-4 py-2 text-sm rounded border border-gray-300 dark:border-gray-700 
                       focus:ring focus:ring-orange-200 dark:focus:ring-orange-500 focus:outline-none
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
            rows={4}
            value={form.comment}
            onChange={(e) => handleChange('comment', e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded text-sm font-semibold transition shadow-sm"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

// ─── Scroll To Top Button ─────────────────────────────────────────
const ScrollTopButton: React.FC<ScrollTopButtonProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 
               text-white px-4 py-2 rounded-full shadow-lg z-50 transition font-medium text-sm focus:outline-none"
  >
    &uarr; Top
  </button>
);

// ─── Main ProductReviews Component ────────────────────────────────
export const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const [reviews, setReviews] = useState<ReviewData[]>(
    product?.reviews || [
      { id: 1, name: 'Jane Doe', rating: 5, comment: 'Amazing quality!', date: '2025-10-10' },
      { id: 2, name: 'John Smith', rating: 4.5, comment: 'Battery lasts forever!', date: '2025-10-08' },
    ]
  );
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  const { averageRating, reviewCount } = useMemo(() => {
    const count = reviews.length;
    const avg = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    return { averageRating: avg, reviewCount: count };
  }, [reviews]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const addReview = (review: ReviewFormFields) => {
    const newReview: ReviewData = {
      id: Date.now(),
      ...review,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const sortedReviews = useMemo(() => [...reviews].sort((a, b) => b.rating - a.rating), [reviews]);

  return (
    <div className="mt-16 max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
        Customer Reviews
      </h2>

      <div className="flex items-center space-x-3 mb-6">
        <StarRating rating={averageRating} />
        <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">{averageRating.toFixed(1)} / 5</span>
        <span className="text-gray-500 dark:text-gray-400 text-sm">({reviewCount} reviews)</span>
      </div>

      <ReviewList reviews={sortedReviews} />
      <ReviewForm onSubmit={addReview} />
      {showScrollTop && <ScrollTopButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />}
    </div>
  );
};

export default ProductReviews;