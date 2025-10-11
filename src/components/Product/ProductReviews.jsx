import React, { useState, useMemo, useEffect } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const ProductReviews = ({ product }) => {
  const [reviews, setReviews] = useState(product?.reviews || [
    { id: 1, name: 'Jane Doe', rating: 5, comment: 'Amazing quality and super comfortable!', date: '2025-10-10' },
    { id: 2, name: 'John Smith', rating: 4.5, comment: 'Battery lasts forever, and sound is 🔥!', date: '2025-10-08' },
  ]);

  const [newReview, setNewReview] = useState({ name: '', rating: 0, comment: '' });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Average rating & review count
  const { averageRating, reviewCount } = useMemo(() => {
    const count = reviews.length;
    const avg = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    return { averageRating: avg, reviewCount: count };
  }, [reviews]);

  // Scroll-to-top detection
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (i - rating < 1) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment || newReview.rating === 0) return;

    const reviewToAdd = {
      id: Date.now(),
      ...newReview,
      date: new Date().toISOString().split('T')[0],
    };

    setReviews([reviewToAdd, ...reviews]);
    setNewReview({ name: '', rating: 0, comment: '' });
  };

  // Optional: sort 5-star reviews first
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => b.rating - a.rating);
  }, [reviews]);

  return (
    <div className="mt-16 max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 pb-2">
        Customer Reviews
      </h2>

      {/* Average Rating */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center">{renderStars(averageRating)}</div>
        <span className="text-gray-700 dark:text-gray-300 font-semibold">
          {averageRating.toFixed(1)} / 5
        </span>
        <span className="text-gray-500 dark:text-gray-400">({reviewCount} reviews)</span>
      </div>

      {/* Reviews List */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md p-6 space-y-6">
        {sortedReviews.length === 0 && (
          <p className="text-gray-600 dark:text-gray-400 italic">
            No reviews yet. Be the first to review this product!
          </p>
        )}

        {sortedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-gray-800 dark:text-gray-200">{review.name}</p>
              <div className="flex items-center">{renderStars(review.rating)}</div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">{review.comment}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{review.date}</p>
          </div>
        ))}
      </div>

      {/* Write a Review Form */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md p-6 mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Write a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:ring focus:ring-orange-200 dark:focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={newReview.name}
              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Rating</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                >
                  {star <= newReview.rating ? (
                    <FaStar className="text-yellow-400 text-xl" />
                  ) : (
                    <FaRegStar className="text-yellow-400 text-xl" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Comment</label>
            <textarea
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:ring focus:ring-orange-200 dark:focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              rows={4}
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold transition"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full shadow-lg z-50 transition"
        >
          ↑ Top
        </button>
      )}
    </div>
  );
};

export default ProductReviews;
