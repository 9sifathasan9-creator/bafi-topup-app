import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { addReview } from '../../supabaseClient';
import Button from '../ui/Button';
import RatingStars from './RatingStars';

// ============================================
// ✍️ Review Form Component
// ============================================
// রিভিউ লেখার আলাদা ফর্ম (standalone)
// GameReviews থেকে আলাদা ব্যবহারের জন্য

const ReviewForm = ({
  gameId,
  onSuccess,
  onCancel,
  initialRating = 5,
  initialComment = '',
  className = '',
}) => {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { notifySuccess, notifyError, notifyInfo } = useNotifications();

  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const MAX_LENGTH = 500;
  const MIN_LENGTH = 3;

  // ============================================
  // 📤 Handle Submit
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      notifyInfo(t('loginRequired') || 'Please login first');
      return;
    }

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      setError(t('invalidRating') || 'Please select a rating');
      return;
    }

    const trimmed = comment.trim();
    if (trimmed.length < MIN_LENGTH) {
      setError(
        `${t('reviewTooShort') || 'Review must be at least'} ${MIN_LENGTH} ${t('characters') || 'characters'}`
      );
      return;
    }

    if (trimmed.length > MAX_LENGTH) {
      setError(
        `${t('reviewTooLong') || 'Review must be less than'} ${MAX_LENGTH} ${t('characters') || 'characters'}`
      );
      return;
    }

    setSubmitting(true);

    try {
      const result = await addReview({
        game_id: gameId,
        user_id: user.id,
        user_email: user.email,
        user_name:
          user.user_metadata?.full_name || user.email.split('@')[0],
        rating,
        comment: trimmed,
      });

      if (!result) throw new Error('Failed to submit');

      notifySuccess(t('reviewSubmitted') || 'Review submitted!');

      // Reset
      setRating(5);
      setComment('');

      onSuccess?.(result);
    } catch (err) {
      console.error('Submit review error:', err);
      const msg = err.message || t('reviewFailed') || 'Failed to submit review';
      setError(msg);
      notifyError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // ❌ Handle Cancel
  // ============================================
  const handleCancel = () => {
    setRating(5);
    setComment('');
    setError('');
    onCancel?.();
  };

  // ============================================
  // 📊 Char count color
  // ============================================
  const getCharCountColor = () => {
    const len = comment.length;
    if (len > MAX_LENGTH) return 'text-red-500';
    if (len > MAX_LENGTH * 0.9) return 'text-yellow-500';
    return 'text-gray-500 dark:text-gray-400';
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-5 ${className}`}
      noValidate
    >
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-red-700 dark:text-red-200 text-sm">
              {error}
            </span>
          </div>
        </div>
      )}

      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-2">
          {t('yourRating') || 'Your Rating'}{' '}
          <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <RatingStars
            rating={rating}
            size="lg"
            interactive
            onChange={setRating}
          />
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            {rating}.0
          </span>
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-2">
          {t('yourReview') || 'Your Review'}{' '}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (error) setError('');
          }}
          placeholder={
            t('reviewPlaceholder') || 'Share your experience with this game...'
          }
          rows={5}
          maxLength={MAX_LENGTH + 50}
          disabled={submitting}
          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none disabled:opacity-50"
          required
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('minChars') || 'Min'} {MIN_LENGTH}{' '}
            {t('characters') || 'characters'}
          </p>
          <p className={`text-xs font-medium ${getCharCountColor()}`}>
            {comment.length}/{MAX_LENGTH}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          variant="primary"
          size="md"
          leftIcon={Send}
          loading={submitting}
          disabled={submitting || !comment.trim()}
          fullWidth
        >
          {submitting
            ? t('submitting') || 'Submitting...'
            : t('submitReview') || 'Submit Review'}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleCancel}
            disabled={submitting}
            fullWidth
          >
            {t('cancel') || 'Cancel'}
          </Button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;