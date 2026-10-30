import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useGames } from '../../hooks/useGames';
import { useFavorites } from '../../hooks/useFavorites';
import { GAME_CATEGORIES, ROUTES } from '../../utils/constants';
import GameGrid from '../../components/games/GameGrid';

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { games, loading } = useGames();
  const { favorites, toggleFavorite } = useFavorites();

  const category = GAME_CATEGORIES.find((c) => c.id === slug);
  const categoryGames = games.filter((g) => g.category === slug);

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <button onClick={() => navigate(ROUTES.GAMES)} className="text-white/80 hover:text-white text-sm inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> {t('back') || 'Back'}
        </button>

        <div className="flex items-center gap-3">
          <span className="text-4xl">{category?.icon || '🎮'}</span>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {category ? (language === 'bn' ? category.nameBn : category.name) : t('category') || 'Category'}
            </h1>
            <p className="text-white/70 text-sm">
              {categoryGames.length} {t('games') || 'games'}
            </p>
          </div>
        </div>

        <GameGrid
          games={categoryGames}
          loading={loading}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
