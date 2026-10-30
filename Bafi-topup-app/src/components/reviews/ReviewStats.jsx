import React, { useMemo } from 'react';
import { Star, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../ui/Card';
import RatingStars from './RatingStars';

// ============================================
// 📊 Review Stats Component
// ============================================
// রিভিউয়ের পরিসংখ্যান দেখায় (গড় রেটিং, ব্রেকডাউন)

const ReviewStats = ({
  reviews = [],
  loading = false,
  variant = 'full',         // full | compact | minimal
  className = '',
}) => {
  const { t } = useLanguage();

  // ============================================
  // 📈 Calculate Stats
  // ============================================
  const stats = useMemo(() => {
    const total = reviews.length;

    if (total === 0) {
      return {
        total: 0,
        average: 0,
        distribution: [5, 4, 3, 2, 1].map((star) => ({
          star,
          count: 0,
          percent: 0,
        })),
        positivePercent: 0,
      };
    }

    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    const average = sum / total;

    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter(
        (r) => Math.round(Number(r.rating)) === star
      ).length;
      return {
        star,
        count,
        percent: (count / total) * 100,
      };
    });

    // 4★ + 5★ এর অনুপাত (positive reviews)
    const positive = reviews.filter((r) => Number(r.rating) >= 4).length;
    const positivePercent = (positive / total) * 100;

    return {
      total,
      average,
      distribution,
      positivePercent,
    };
  }, [reviews]);

  // ============================================
  // ⏳ Loading
  // ============================================
  if (loading) {
    return (
      <Card variant="gaming" padding="md" className={className}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3" />
          <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-2 bg-gray-300 dark:bg-gray-600 rounded"
              />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // ============================================
  // 📉 Minimal Variant
  // ============================================
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <RatingStars rating={stats.average} size="sm" />
        <span className="text-sm font-semibold text-gray-800 dark:text-white">
          {stats.average.toFixed(1)}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({stats.total})
        </span>
      </div>
    );
  }

  // ============================================
  // 📊 Compact Variant
  // ============================================
  if (variant === 'compact') {
    return (
      <Card variant="gaming" padding="sm" className={className}>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {stats.average.toFixed(1)}
            </p>
            <RatingStars rating={stats.average} size="sm" />
          </div>
          <div className="flex-1 space-y-1">
            {stats.distribution.slice(0, 3).map(({ star, percent }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 w-6">
                  {star}★
                </span>
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // ============================================
  // 🎯 Full Variant (Default)
  // ============================================
  return (
    <Card variant="gaming" padding="md" className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* ============================================
            Left: Big Rating
            ============================================ */}
        <div className="text-center sm:border-r border-gray-200 dark:border-gray-700 sm:pr-5 flex flex-col items-center justify-center">
          <p className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
            {stats.average.toFixed(1)}
          </p>
          <RatingStars rating={stats.average} size="md" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {t('basedOn') || 'Based on'}{' '}
            <strong className="text-gray-800 dark:text-white">
              {stats.total}
            </strong>{' '}
            {t('reviews') || 'reviews'}
          </p>

          {/* Positive badge */}
          {stats.total > 0 && stats.positivePercent >= 70 && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
              <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
              <span className="text-[10px] font-bold text-green-700 dark:text-green-300">
                {Math.round(stats.positivePercent)}%{' '}
                {t('positive') || 'positive'}
              </span>
            </div>
          )}
        </div>

        {/* ============================================
            Right: Distribution Bars
            ============================================ */}
        <div className="sm:col-span-2 space-y-2">
          {stats.distribution.map(({ star, count, percent }) => (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12 flex-shrink-0">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {star}
                </span>
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
              </div>

              <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-10 text-right flex-shrink-0">
                {count}
              </span>

              <span className="text-xs text-gray-400 dark:text-gray-500 w-10 text-right flex-shrink-0 hidden sm:block">
                {Math.round(percent)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================
          Bottom: Quick Stats
          ============================================ */}
      {stats.total > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
              <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              {stats.total}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              {t('totalReviews') || 'Total Reviews'}
            </p>
          </div>

          <div className="text-center">
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
              <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400 fill-current" />
            </div>
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              {stats.distribution[0].count}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              {t('fiveStar') || '5 Star'}
            </p>
          </div>

          <div className="text-center">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
              <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              {Math.round(stats.positivePercent)}%
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              {t('positive') || 'Positive'}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ReviewStats;