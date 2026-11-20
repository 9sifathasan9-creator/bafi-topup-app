import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useGames } from '../../hooks/useGames';
import { useFavorites } from '../../hooks/useFavorites';
import { ROUTES } from '../../utils/constants';
import GameDetails from '../../components/games/GameDetails';
import GameReviews from '../../components/games/GameReviews';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StepIndicator from '../../components/common/StepIndicator';

const GameDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { games, loading } = useGames();
  const { favorites, toggleFavorite } = useFavorites();

  const game = games.find((g) => g.id === id);
  const isFavorite = favorites.includes(id);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-white text-lg">Loading...</div></div>;
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card variant="gaming" padding="lg" className="text-center max-w-md">
          <p className="text-2xl mb-2">🎮</p>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{t('gameNotFound') || 'Game not found'}</h2>
          <Button variant="primary" onClick={() => navigate(ROUTES.GAMES)} fullWidth>{t('browseGames') || 'Browse Games'}</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 bg-[#f3f4f6] dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        
        {/* হেডার: Back বাটন এবং Step Indicator (ধাপ ২) */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => navigate(ROUTES.GAMES)} className="text-slate-700 dark:text-white/80 hover:text-purple-600 dark:text-white text-sm inline-flex items-center gap-2 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <StepIndicator currentStep={2} />
        </div>

        <div className="space-y-6">
          <GameDetails game={game} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
          <GameReviews gameId={id} />
        </div>
      </div>
    </div>
  );
};
export default GameDetailsPage;
