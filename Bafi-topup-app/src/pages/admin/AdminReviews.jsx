import React, { useEffect, useState } from 'react';
import { Star, Trash2, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { supabase } from '../../supabaseClient';
import { formatRelativeTime, formatInitials } from '../../utils/formatters';
import Card from '../../components/ui/Card';
import RatingStars from '../../components/reviews/RatingStars';

const AdminReviews = () => {
  const { t } = useLanguage();
  const { notifySuccess } = useNotifications();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false }).limit(50);
    setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete') || 'Delete this review?')) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) {
      notifySuccess(t('reviewDeleted') || 'Review deleted');
      fetchReviews();
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Star className="w-6 h-6" /> {t('reviews') || 'Reviews'}
        </h1>
        <p className="text-white/70 text-sm">{reviews.length} {t('total') || 'total'}</p>
      </div>

      {loading ? (
        <div className="gaming-card p-8 text-center text-gray-500">{t('loading') || 'Loading...'}</div>
      ) : reviews.length === 0 ? (
        <Card variant="gaming" padding="lg" className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">{t('noReviews') || 'No reviews yet'}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id} variant="gaming" padding="md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {formatInitials(review.user_name || review.user_email || 'U')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {review.user_name || review.user_email?.split('@')[0] || 'User'}
                    </p>
                    <RatingStars rating={review.rating} size="sm" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{formatRelativeTime(review.created_at)}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
                </div>
                <button onClick={() => handleDelete(review.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
