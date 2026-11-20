import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useGames } from '../../hooks/useGames';
import { useFavorites } from '../../hooks/useFavorites';
import GameSearch from '../../components/games/GameSearch';
import GameGrid from '../../components/games/GameGrid';

const GamesPage = () => {
  const { t } = useLanguage();
  const {
    filteredGames,
    loading,
    searchQuery,
    setSearchQuery,
  } = useGames();

  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="min-h-screen px-4 py-6 bg-[#f3f4f6] dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        
        {/* 🔵 নীল দাগের জায়গা: Topup এবং Step Indicator */}
        <div className="flex items-center justify-between mb-2 mt-2">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            Topup
          </h1>
          
          {/* Step Indicator (1-2-3) */}
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-500/30">
              1
            </span>
            <span className="w-4 h-[1px] bg-gray-300 dark:bg-gray-600"></span>
            <span className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 text-gray-400 flex items-center justify-center text-sm font-bold">
              2
            </span>
            <span className="w-4 h-[1px] bg-gray-300 dark:bg-gray-600"></span>
            <span className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 text-gray-400 flex items-center justify-center text-sm font-bold">
              3
            </span>
          </div>
        </div>

        {/* 🔴 লাল দাগের জায়গা: Tagline */}
        <p className="text-sm text-slate-600 dark:text-gray-400 mb-6 max-w-xs leading-relaxed">
          Your ultimate gaming top-up platform. Secure, fast, and reliable.
        </p>

        {/* সার্চ বার (ঐচ্ছিক, কিন্তু ইউজার এক্সপেরিয়েন্সের জন্য ভালো) */}
        <div className="mb-6">
          <GameSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('searchGames') || 'Search your game...'}
          />
        </div>

        {/* Choose your game টাইটেল */}
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
          Choose your game
        </h2>

        {/* গেম গ্রিড (২ কলাম) */}
        <GameGrid
          games={filteredGames}
          loading={loading}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          columns="2" /* স্ক্রিনশটের মতো ২ কলাম করা হলো */
        />

      </div>
    </div>
  );
};

export default GamesPage;
