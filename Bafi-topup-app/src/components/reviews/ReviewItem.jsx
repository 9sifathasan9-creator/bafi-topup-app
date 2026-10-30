import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Trash2, Edit, Loader2, Flag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { deleteReview } from '../../supabaseClient';
import { formatRelativeTime, formatName, formatInitials } from '../../utils/formatters';
import Card from '../ui/Card';
import RatingStars from './RatingStars';

// ============================================
// 💬 Review Item Component
// ============================================
// একটি রিভিউ দেখানোর কম্পোনেন্ট
// Reply, Like, Delete, Edit সব সাপোর্ট

const ReviewItem = ({
  review,
  onDelete,
  onEdit,
  onReply,
  showActions = true,
  compact = false,
  className = '',
}) => {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const { notifySuccess, notifyError } = useNotifications();

  const [deleting, setDeleting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  if (!review) return null;

  // ============================================
  // ✅ Can Edit / Delete Check
  // ============================================
  const isOwnReview = user?.id === review.user_id;
  const canDelete = isAdmin || isOwnReview;
  const canEdit = isOwnReview;

  // ============================================
  // 🗑️ Handle Delete
  // ============================================
  const handleDelete = async () => {
    if (!window.confirm(t('confirmDelete') || 'Delete this review?')) return;

    setDeleting(true);
    try {
      const success = await deleteReview(review.id);
      if (!success) throw new Error('Failed to delete');

      notifySuccess(t('reviewDeleted') || 'Review deleted');
      onDelete?.(review.id);
    } catch (err) {
      console.error('Delete error:', err);
      notifyError(t('deleteFailed') || 'Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  // ============================================
  // 👍 Handle Like
  // ============================================
  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  // ============================================
  // 👎 Handle Dislike
  // ============================================
  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  // ============================================
  // 💬 Handle Reply
  // ============================================
  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply?.(review.id, replyText.trim());
    setReplyText('');
    setShowReply(false);
  };

  // ============================================
  // 🎨 Avatar Color (Based on Name)
  // ============================================
  const getAvatarGradient = (name) => {
    const gradients = [
      'from-purple-500 to-blue-500',
      'from-pink-500 to-purple-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-yellow-500 to-orange-500',
    ];
    const char = (name || 'U').charCodeAt(0);
    return gradients[char % gradients.length];
  };

  const displayName = review.user_name || review.user_email?.split('@')[0] || 'User';

  return (
    <Card
      variant="gaming"
      padding={compact ? 'sm' : 'md'}
      className={`${deleting ? 'opacity-50' : ''} ${className}`}
    >
      <div className="flex items-start gap-3">
        {/* ============================================
            Avatar
            ============================================ */}
        <div
          className={`${
            compact ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
          } rounded-full bg-gradient-to-br ${getAvatarGradient(
            displayName
          )} flex items-center justify-center flex-shrink-0`}
        >
          <span className="text-white font-bold">
            {formatInitials(displayName) || 'U'}
          </span>
        </div>

        {/* ============================================
            Content
            ============================================ */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p
              className={`font-semibold ${
                compact ? 'text-xs' : 'text-sm'
              } text-gray-800 dark:text-white`}
            >
              {formatName(displayName)}
            </p>

            {isOwnReview && (
              <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-[10px] font-bold rounded">
                {t('you') || 'You'}
              </span>
            )}

            {isAdmin && (
              <span className="px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 text-[10px] font-bold rounded">
                {t('admin') || 'Admin'}
              </span>
            )}

            <RatingStars rating={review.rating} size={compact ? 'sm' : 'sm'} />
          </div>

          {/* Date */}
          <p
            className={`${
              compact ? 'text-[10px]' : 'text-xs'
            } text-gray-500 dark:text-gray-400 mb-2`}
          >
            {formatRelativeTime(review.created_at)}
          </p>

          {/* Comment */}
          <p
            className={`
              ${compact ? 'text-xs' : 'text-sm'}
              text-gray-700 dark:text-gray-300
              leading-relaxed whitespace-pre-wrap break-words
            `.trim()}
          >
            {review.comment}
          </p>

          {/* ============================================
              Actions Bar
              ============================================ */}
          {showActions && (
            <div className="flex items-center gap-3 mt-3">
              {/* Like */}
              <button
                onClick={handleLike}
                className={`
                  flex items-center gap-1 text-xs font-medium transition
                  ${
                    liked
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                  }
                `.trim()}
              >
                <ThumbsUp
                  className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`}
                />
                <span>{t('helpful') || 'Helpful'}</span>
              </button>

              {/* Dislike */}
              <button
                onClick={handleDislike}
                className={`
                  flex items-center gap-1 text-xs font-medium transition
                  ${
                    disliked
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                  }
                `.trim()}
              >
                <ThumbsDown
                  className={`w-3.5 h-3.5 ${disliked ? 'fill-current' : ''}`}
                />
              </button>

              {/* Edit (own only) */}
              {canEdit && onEdit && (
                <button
                  onClick={() => onEdit(review)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {t('edit') || 'Edit'}
                  </span>
                </button>
              )}

              {/* Delete */}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition disabled:opacity-50"
                >
                  {deleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {t('delete') || 'Delete'}
                  </span>
                </button>
              )}

              {/* Report */}
              {!isOwnReview && (
                <button
                  className="ml-auto flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-yellow-600 transition"
                  title={t('report') || 'Report'}
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ReviewItem;