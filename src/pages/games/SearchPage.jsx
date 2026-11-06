import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useGames } from '../../hooks/useGames';
import { useFavorites } from '../../hooks/useFavorites';
import { ROUTES } from '../../utils/constants';
import GameSearch from '../../components/games/GameSearch';
import GameGrid from '../../components/games/GameGrid';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { games, loading } = useGames();
  const { favorites, toggleFavorite } = useFavorites();

  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  const results = query.trim()
    ? games.filter(
        (g) =>
          g.name?.toLowerCase().includes(query.toLowerCase()) ||
          g.description?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <button onClick={() => navigate(ROUTES.GAMES)} className="text-white/80 hover:text-white text-sm inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> {t('back') || 'Back'}
        </button>

        <GameSearch
          value={query}
          onChange={setQuery}
          placeholder={t('searchGames') || 'Search games...'}
          autoFocus
        />

        {query.trim() && (
          <p className="text-white/80 text-sm">
            <strong className="text-white">{results.length}</strong>{' '}
            {t('resultsFor') || 'results for'} "{query}"
          </p>
        )}

        <GameGrid
          games={results}
          loading={loading}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          emptyMessage={query ? t('noResults') || 'No results found' : t('startTyping') || 'Start typing to search'}
        />
      </div>
    </div>
  );
};

export default SearchPage;
