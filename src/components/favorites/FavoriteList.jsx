import React from 'react';
import { Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import EmptyState from '../common/EmptyState';
import SkeletonLoader from '../common/SkeletonLoader';
import FavoriteCard from './FavoriteCard';

const FavoriteList = ({ favorites = [], games = [], loading = false, onRemove }) => {
  const { t } = useLanguage();

  const favoriteGames = games.filter((g) => favorites.includes(g.id));

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <SkeletonLoader variant="card" count={4} />
      </div>
    );
  }

  if (favoriteGames.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title={t('noFavorites') || 'No favorites yet'}
        description={t('noFavoritesDesc') || 'Add games to your favorites to see them here'}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {favoriteGames.map((game) => (
        <FavoriteCard key={game.id} game={game} onRemove={onRemove} />
      ))}
    </div>
  );
};

export default FavoriteList;
