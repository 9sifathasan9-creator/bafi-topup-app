import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, Loader2, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { getReviews, addReview } from '../../supabaseClient';
import { formatRelativeTime } from '../../utils/formatters';
import Card from '../ui/Card';
import Button from '../ui/Button';
import RatingStars from '../reviews/RatingStars';

// ============================================
// ⭐ Game Reviews Component
// ============================================
// গেমের রিভিউ দেখা ও লেখার কম্পোনেন্ট

const GameReviews = ({ gameId, className = '' }) => {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { notifySuccess, notifyError, notifyInfo } = useNotifications();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  // ============================================
  // 📥 Fetch Reviews
  // ============================================
  const fetchReviews = async () => {
    if (!gameId) return;
    setLoading(true);
    try {
      const data = await getReviews(gameId);
      setReviews(data || []);
    } catch (err) {
      console.error('Fetch reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  // ============================================
  // 📤 Submit Review
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      notifyInfo(t('loginRequired') || 'Please login first');
      return;
    }

    if (!comment.trim() || comment.trim().length < 3) {
      notifyError(t('reviewTooShort') || 'Review must be at least 3 characters');
      return;
    }

    setSubmitting(true);
    try {
      const result = await addReview({
        game_id: gameId,
        user_id: user.id,
        user_email: user.email,
        user_name: user.user_metadata?.full_name || user.email.split('@')[0],
        rating,
        comment: comment.trim(),
      });

      if (result) {
        notifySuccess(t('reviewSubmitted') || 'Review submitted!');
        setComment('');
        setRating(5);
        setShowForm(false);
        await fetchReviews();
      } else {
        throw new Error('Failed to submit');
      }
    } catch (err) {
      console.error('Submit review error:', err);
      notifyError(t('reviewFailed') || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // 📊 Stats
  // ============================================
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
    percent:
      reviews.length > 0
        ? (reviews.filter((r) => Math.round(r.rating) === star).length / reviews.length) * 100
        : 0,
  }));

  return (
    <div className={`space-y-5 ${className}`}>
      {/* ============================================
          Summary Section
          ============================================ */}
      <Card variant="gaming" padding="md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Big Rating */}
          <div className="text-center sm:border-r border-gray-200 dark:border-gray-700">
            <p className="text-5xl font-bold text-gray-800 dark:text-white mb-2">
              {avgRating.toFixed(1)}
            </p>
            <RatingStars rating={avgRating} size="md" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {reviews.length} {t('reviews') || 'reviews'}
            </p>
          </div>

          {/* Breakdown */}
          <div className="sm:col-span-2 space-y-1.5">
            {ratingCounts.map(({ star, count, percent }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-8">
                  {star} ★
                </span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Button */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant={showForm ? 'secondary' : 'primary'}
            size="md"
            leftIcon={MessageSquare}
            onClick={() => setShowForm(!showForm)}
            fullWidth
          >
            {showForm
              ? t('cancel') || 'Cancel'
              : t('writeReview') || 'Write a Review'}
          </Button>
        </div>
      </Card>

      {/* ============================================
          Review Form
          ============================================ */}
      {showForm && (
        <Card variant="gaming" padding="md" className="animate-slide-down">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-2">
                {t('yourRating') || 'Your Rating'}
              </label>
              <RatingStars
                rating={rating}
                size="lg"
                interactive
                onChange={setRating}
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-2">
                {t('yourReview') || 'Your Review'}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  t('reviewPlaceholder') || 'Share your experience...'
                }
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                {comment.length}/500
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              leftIcon={Send}
              loading={submitting}
              disabled={submitting || !comment.trim()}
              fullWidth
            >
              {submitting
                ? t('submitting') || 'Submitting...'
                : t('submitReview') || 'Submit Review'}
            </Button>
          </form>
        </Card>
      )}

      {/* ============================================
          Reviews List
          ============================================ */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('loading') || 'Loading reviews...'}
          </p>
        </div>
      ) : reviews.length === 0 ? (
        <Card variant="gaming" padding="lg" className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
            {t('noReviews') || 'No reviews yet'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t('beFirstReview') || 'Be the first to review'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id} variant="gaming" padding="md">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {(review.user_name || review.user_email || 'U')
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-gray-800 dark:text-white">
                      {review.user_name || review.user_email?.split('@')[0] || 'User'}
                    </p>
                    <RatingStars rating={review.rating} size="sm" />
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {formatRelativeTime(review.created_at)}
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                    {review.comment}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameReviews;