import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useGames } from '../../hooks/useGames';
import { useFavorites } from '../../hooks/useFavorites';
import GameSearch from '../../components/games/GameSearch';
import GameGrid from '../../components/games/GameGrid';
import StepIndicator from '../../components/common/StepIndicator';

const GamesPage = () => {
  const { t } = useLanguage();
  const { filteredGames, loading, searchQuery, setSearchQuery } = useGames();
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="min-h-screen px-4 py-6 bg-[#f3f4f6] dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2 mt-2">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            Topup
          </h1>
          <StepIndicator currentStep={1} />
        </div>
        
        <p className="text-sm text-slate-600 dark:text-gray-400 mb-6 max-w-xs leading-relaxed">
          Your ultimate gaming top-up platform. Secure, fast, and reliable.
        </p>

        <div className="mb-6">
          <GameSearch value={searchQuery} onChange={setSearchQuery} placeholder={t('searchGames') || 'Search your game...'} />
        </div>

        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Step 1: Choose your game</h2>
        <GameGrid games={filteredGames} loading={loading} favorites={favorites} onToggleFavorite={toggleFavorite} columns="auto" />
      </div>
    </div>
  );
};
export default GamesPage;
