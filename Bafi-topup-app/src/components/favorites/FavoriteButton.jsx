import React from 'react';
import { Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

const FavoriteButton = ({ gameId, isFavorite, onToggle, size = 'md', variant = 'icon' }) => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { notifyInfo, notifySuccess } = useNotifications();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      notifyInfo(t('loginRequired') || 'Please login first');
      return;
    }

    onToggle?.(gameId);
    if (!isFavorite) {
      notifySuccess(t('addedToFavorites') || 'Added to favorites!');
    }
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
          isFavorite
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        {isFavorite ? t('favorited') || 'Favorited' : t('addToFavorites') || 'Add to Favorites'}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center backdrop-blur-lg transition ${
        isFavorite
          ? 'bg-red-500 text-white'
          : 'bg-white/20 text-white hover:bg-red-500'
      }`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`${iconSizes[size]} ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  );
};

export default FavoriteButton;
