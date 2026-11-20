import React from 'react';
import { Loader2, Package } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import GameCard from './GameCard';

const GameGrid = ({ games = [], loading = false, favorites = [], onToggleFavorite, emptyMessage, columns = 'auto', gap = 'md' }) => {
  const { t } = useLanguage();

  // মোবাইলে ২ কলাম, ডেস্কটপে ৩ বা ৪ কলাম
  const columnClasses = {
    auto: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    '2': 'grid-cols-2',
    '3': 'grid-cols-2 md:grid-cols-3',
    '4': 'grid-cols-2 md:grid-cols-4',
  };
  const gapClasses = { sm: 'gap-2', md: 'gap-3', lg: 'gap-4' };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <p className="text-gray-500 text-sm">{t('loading') || 'Loading games...'}</p>
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">{emptyMessage || t('noGames') || 'No games available'}</h3>
        <p className="text-gray-500 text-xs max-w-xs">{t('noGamesDesc') || 'Try changing your filters or check back later'}</p>
      </div>
    );
  }

  return (
    <div className={`grid ${columnClasses[columns] || columnClasses.auto} ${gapClasses[gap] || gapClasses.md}`}>
      {games.map((game) => (
        <GameCard key={game.id} game={game} isFavorite={favorites.includes(game.id)} onToggleFavorite={onToggleFavorite} />
      ))}
    </div>
  );
};

export default GameGrid;
