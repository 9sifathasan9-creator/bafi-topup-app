import React, { useState } from 'react';
import { Filter, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { GAME_CATEGORIES, SORT_OPTIONS } from '../../utils/constants';
import Button from '../ui/Button';

// ============================================
// 🎛️ Game Filter Component
// ============================================
// ক্যাটাগরি + সর্ট + প্রাইস রেঞ্জ ফিল্টার

const GameFilter = ({
  selectedCategory = 'all',
  onCategoryChange,
  sortBy = 'newest',
  onSortChange,
  priceRange = { min: '', max: '' },
  onPriceChange,
  onClearAll,
  resultCount = 0,
  loading = false,
  className = '',
}) => {
  const { t, language } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);

  // ============================================
  // 🔢 Active Filter Count
  // ============================================
  const activeFiltersCount = [
    selectedCategory !== 'all',
    sortBy !== 'newest',
    priceRange.min !== '',
    priceRange.max !== '',
  ].filter(Boolean).length;

  // ============================================
  // 🧹 Clear All Filters
  // ============================================
  const handleClearAll = () => {
    onCategoryChange?.('all');
    onSortChange?.('newest');
    onPriceChange?.({ min: '', max: '' });
    onClearAll?.();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ============================================
          Top Bar: Result Count + Toggle Filters
          ============================================ */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-white/80 text-sm">
            {loading ? (
              t('loading') || 'Loading...'
            ) : (
              <>
                <strong className="text-white">{resultCount}</strong>{' '}
                {t('gamesFound') || 'games found'}
              </>
            )}
          </p>

          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-purple-500 text-white text-xs font-bold rounded-full">
              {activeFiltersCount} {t('filter') || 'filter'}
              {activeFiltersCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort (Desktop) */}
          <div className="hidden sm:block relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange?.(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-white/10 backdrop-blur-lg border border-white/20 text-white text-sm rounded-lg focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
              aria-label={t('sortBy') || 'Sort by'}
            >
              {SORT_OPTIONS.map((option) => (
                <option
                  key={option.id}
                  value={option.id}
                  className="text-gray-800"
                >
                  {language === 'bn' ? option.nameBn : option.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
          </div>

          {/* Toggle Filter */}
          <Button
            variant="secondary"
            size="sm"
            leftIcon={SlidersHorizontal}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters
              ? t('hideFilters') || 'Hide Filters'
              : t('showFilters') || 'Filters'}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              variant="danger"
              size="sm"
              leftIcon={X}
              onClick={handleClearAll}
            >
              {t('clear') || 'Clear'}
            </Button>
          )}
        </div>
      </div>

      {/* ============================================
          Filter Panel
          ============================================ */}
      {showFilters && (
        <div className="gaming-card p-5 space-y-5 animate-slide-down">
          {/* Category */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {t('category') || 'Category'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {GAME_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange?.(cat.id)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition
                    ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `.trim()}
                >
                  <span className="mr-1">{cat.icon}</span>
                  {language === 'bn' ? cat.nameBn : cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort (Mobile) */}
          <div className="sm:hidden">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
              {t('sortBy') || 'Sort By'}
            </h4>
            <select
              value={sortBy}
              onChange={(e) => onSortChange?.(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {language === 'bn' ? option.nameBn : option.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
              {t('priceRange') || 'Price Range'}
            </h4>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder={t('min') || 'Min'}
                value={priceRange.min}
                onChange={(e) =>
                  onPriceChange?.({ ...priceRange, min: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
              />
              <span className="text-gray-400 font-bold">—</span>
              <input
                type="number"
                placeholder={t('max') || 'Max'}
                value={priceRange.max}
                onChange={(e) =>
                  onPriceChange?.({ ...priceRange, max: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameFilter;