import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useGames } from '../../hooks/useGames';
import { useFavorites } from '../../hooks/useFavorites';
import GameSearch from '../../components/games/GameSearch';
import GameFilter from '../../components/games/GameFilter';
import GameCategories from '../../components/games/GameCategories';
import GameGrid from '../../components/games/GameGrid';

const GamesPage = () => {
  const { t } = useLanguage();
  const {
    filteredGames,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
  } = useGames();

  const { favorites, toggleFavorite } = useFavorites();
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            🎮 {t('games') || 'Games'}
          </h1>
          <p className="text-white/70 text-sm">
            {t('browseGamesDesc') || 'Browse and top-up your favorite games'}
          </p>
        </div>

        <GameSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('searchGames') || 'Search games...'}
        />

        <GameCategories
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
          variant="horizontal"
          showIcons
        />

        <GameFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          resultCount={filteredGames.length}
          loading={loading}
        />

        <GameGrid
          games={filteredGames}
          loading={loading}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  );
};

export default GamesPage;
