import React from 'react';
import { Loader2, Search, Package } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import GameCard from './GameCard';

// ============================================
// 🎮 Game Grid Component
// ============================================
// গেমের গ্রিড লেআউট + Loading + Empty State

const GameGrid = ({
  games = [],
  loading = false,
  favorites = [],
  onToggleFavorite,
  emptyMessage,
  columns = 'auto',      // auto | 2 | 3 | 4
  gap = 'md',            // sm | md | lg
}) => {
  const { t } = useLanguage();

  // ============================================
  // 📏 Grid Columns
  // ============================================
  const columnClasses = {
    auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  // ============================================
  // ⏳ Loading State
  // ============================================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
        <p className="text-white/70 text-sm">
          {t('loading') || 'Loading games...'}
        </p>
      </div>
    );
  }

  // ============================================
  // 📭 Empty State
  // ============================================
  if (!games || games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center mb-4">
          <Package className="w-10 h-10 text-white/60" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          {emptyMessage || t('noGames') || 'No games found'}
        </h3>
        <p className="text-white/60 text-sm max-w-md">
          {t('noGamesDesc') || 'Try changing your filters or search query'}
        </p>
      </div>
    );
  }

  // ============================================
  // 🎮 Games Grid
  // ============================================
  return (
    <div
      className={`
        grid ${columnClasses[columns] || columnClasses.auto}
        ${gapClasses[gap] || gapClasses.md}
      `.trim()}
    >
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          isFavorite={favorites.includes(game.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default GameGrid;