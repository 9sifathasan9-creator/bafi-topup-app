import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useGames } from '../../hooks/useGames';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../utils/constants';
import FavoriteList from '../../components/favorites/FavoriteList';

const FavoritesPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { games, loading } = useGames();
  const { user } = useAuth();
  const { notifySuccess } = useNotifications();

  const [favorites, setFavorites] = React.useState(() => {
    try {
      const saved = localStorage.getItem(`bafi-fav-${user?.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleRemove = (gameId) => {
    const updated = favorites.filter((id) => id !== gameId);
    setFavorites(updated);
    localStorage.setItem(`bafi-fav-${user?.id}`, JSON.stringify(updated));
    notifySuccess(t('removedFromFavorites') || 'Removed from favorites');
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-5">
        <button onClick={() => navigate(ROUTES.USER_DASHBOARD)} className="text-white/80 hover:text-white text-sm inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> {t('back') || 'Back'}
        </button>

        <h1 className="text-2xl font-bold text-white">
          ❤️ {t('myFavorites') || 'My Favorites'}
        </h1>

        <FavoriteList
          favorites={favorites}
          games={games}
          loading={loading}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
};

export default FavoritesPage;
