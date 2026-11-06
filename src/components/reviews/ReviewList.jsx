import React, { useState, useEffect } from 'react';
import { MessageSquare, Loader2, Trash2, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { getReviews, deleteReview } from '../../supabaseClient';
import { formatRelativeTime } from '../../utils/formatters';
import Card from '../ui/Card';
import RatingStars from './RatingStars';

// ============================================
// 📋 Review List Component
// ============================================
// রিভিউয়ের লিস্ট দেখায় + ডিলিট অপশন

const ReviewList = ({
  gameId,
  reviews: externalReviews,
  loading: externalLoading = false,
  onReviewDeleted,
  showDeleteForOwn = true,
  limit,
  className = '',
}) => {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const { notifySuccess, notifyError } = useNotifications();

  const [internalReviews, setInternalReviews] = useState([]);
  const [loading, setLoading] = useState(externalReviews ? false : true);
  const [deletingId, setDeletingId] = useState(null);

  // ============================================
  // 📥 Fetch Reviews (যদি external না থাকে)
  // ============================================
  const fetchReviews = async () => {
    if (!gameId) return;
    setLoading(true);
    try {
      const data = await getReviews(gameId);
      setInternalReviews(data || []);
    } catch (err) {
      console.error('Fetch reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!externalReviews) {
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  // ============================================
  // 🎯 Use External or Internal
  // ============================================
  const reviews = externalReviews || internalReviews;
  const isLoading = externalLoading || loading;

  // Limit apply
  const displayReviews = limit ? reviews.slice(0, limit) : reviews;

  // ============================================
  // 🗑️ Handle Delete
  // ============================================
  const handleDelete = async (reviewId) => {
    if (!window.confirm(t('confirmDelete') || 'Delete this review?')) return;

    setDeletingId(reviewId);
    try {
      const success = await deleteReview(reviewId);
      if (!success) throw new Error('Failed to delete');

      notifySuccess(t('reviewDeleted') || 'Review deleted');

      // Update local state
      if (externalReviews) {
        onReviewDeleted?.(reviewId);
      } else {
        setInternalReviews((prev) => prev.filter((r) => r.id !== reviewId));
      }
    } catch (err) {
      console.error('Delete review error:', err);
      notifyError(t('deleteFailed') || 'Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================
  // ✅ Can Delete Check
  // ============================================
  const canDelete = (review) => {
    if (!user) return false;
    if (isAdmin) return true;
    if (showDeleteForOwn && review.user_id === user.id) return true;
    return false;
  };

  // ============================================
  // ⏳ Loading State
  // ============================================
  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center py-10 gap-3 ${className}`}>
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('loading') || 'Loading reviews...'}
        </p>
      </div>
    );
  }

  // ============================================
  // 📭 Empty State
  // ============================================
  if (displayReviews.length === 0) {
    return (
      <Card variant="gaming" padding="lg" className={`text-center ${className}`}>
        <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
          {t('noReviews') || 'No reviews yet'}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {t('beFirstReview') || 'Be the first to review'}
        </p>
      </Card>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {displayReviews.map((review) => {
        const isDeleting = deletingId === review.id;
        const showDelete = canDelete(review);

        return (
          <Card
            key={review.id}
            variant="gaming"
            padding="md"
            className={isDeleting ? 'opacity-50' : ''}
          >
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
                {/* Header */}
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-semibold text-sm text-gray-800 dark:text-white">
                    {review.user_name ||
                      review.user_email?.split('@')[0] ||
                      'User'}
                  </p>
                  <RatingStars rating={review.rating} size="sm" />
                </div>

                {/* Date */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {formatRelativeTime(review.created_at)}
                </p>

                {/* Comment */}
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                  {review.comment}
                </p>
              </div>

              {/* Delete Button */}
              {showDelete && (
                <button
                  onClick={() => handleDelete(review.id)}
                  disabled={isDeleting}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition flex-shrink-0 disabled:opacity-50"
                  aria-label="Delete review"
                  title={t('delete') || 'Delete'}
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </Card>
        );
      })}

      {/* Show More Indicator */}
      {limit && reviews.length > limit && (
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 py-2">
          +{reviews.length - limit} {t('more') || 'more'}...
        </p>
      )}
    </div>
  );
};

export default ReviewList;