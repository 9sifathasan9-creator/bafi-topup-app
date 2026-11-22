import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useGames } from '../../hooks/useGames';
import { useFavorites } from '../../hooks/useFavorites';
import GameSearch from '../../components/games/GameSearch';
import GameGrid from '../../components/games/GameGrid';
import StepIndicator from '../../components/common/StepIndicator';

const GamesPage = () => {
  const { t } = useLanguage();
  const { filteredGames, loading, searchQuery, setSearchQuery, refresh } = useGames();
  const { favorites, toggleFavorite } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (refresh) await refresh();
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-[#f3f4f6] dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex items-center justify-between mb-2 mt-2">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            Topup
          </h1>
          <StepIndicator currentStep={1} />
        </div>
        
        <div className="flex justify-between items-start mb-6">
          <p className="text-sm text-slate-600 dark:text-gray-400 max-w-xs leading-relaxed">
            Your ultimate gaming top-up platform. Secure, fast, and reliable.
          </p>
          {/* ম্যানুয়াল রিফ্রেশ বাটন */}
          <button onClick={handleRefresh} className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <RefreshCw className={`w-5 h-5 ${refreshing || loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="mb-6">
          <GameSearch value={searchQuery} onChange={setSearchQuery} placeholder={t('searchGames') || 'Search your game...'} />
        </div>

        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Choose your game</h2>
        <GameGrid games={filteredGames} loading={loading} favorites={favorites} onToggleFavorite={toggleFavorite} columns="auto" />
      </div>
    </div>
  );
};
export default GamesPage;
