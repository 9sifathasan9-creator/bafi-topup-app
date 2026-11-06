import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useGames } from '../../hooks/useGames';
import { useFavorites } from '../../hooks/useFavorites';
import { ROUTES } from '../../utils/constants';
import GameDetails from '../../components/games/GameDetails';
import GameReviews from '../../components/games/GameReviews';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const GameDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { games, loading } = useGames();
  const { favorites, toggleFavorite } = useFavorites();

  const game = games.find((g) => g.id === id);
  const isFavorite = favorites.includes(id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">{t('loading') || 'Loading...'}</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card variant="gaming" padding="lg" className="text-center max-w-md">
          <p className="text-2xl mb-2">🎮</p>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
            {t('gameNotFound') || 'Game not found'}
          </h2>
          <Button variant="primary" onClick={() => navigate(ROUTES.GAMES)} fullWidth>
            {t('browseGames') || 'Browse Games'}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <GameDetails
          game={game}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />

        <GameReviews gameId={id} />
      </div>
    </div>
  );
};

export default GameDetailsPage;
