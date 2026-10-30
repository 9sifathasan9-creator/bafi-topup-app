// ============================================
// 🎮 useGames Hook
// ============================================
// গেম ডাটা ম্যানেজ করে:
// ফেচ, সার্চ, ফিল্টার, সর্ট, অ্যাডমিন CRUD

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getGames,
  addGame,
  updateGame,
  deleteGame,
} from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

// ============================================
// 🎣 Main Hook
// ============================================
export const useGames = () => {
  const { isAdmin } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // ============================================
  // 📥 Fetch Games
  // ============================================
  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGames();
      setGames(data || []);
    } catch (err) {
      console.error('Fetch games error:', err);
      setError(err.message || 'Failed to load games');
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // 🔄 Auto Fetch on Mount
  // ============================================
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // ============================================
  // ➕ Add Game (Admin only)
  // ============================================
  const createGame = useCallback(
    async (gameData) => {
      if (!isAdmin) return { success: false, error: 'Admin access required' };
      try {
        const result = await addGame(gameData);
        if (!result) throw new Error('Failed to add game');
        await fetchGames();
        return { success: true, game: result };
      } catch (err) {
        console.error('Add game error:', err);
        return { success: false, error: err.message };
      }
    },
    [isAdmin, fetchGames]
  );

  // ============================================
  // ✏️ Update Game (Admin only)
  // ============================================
  const editGame = useCallback(
    async (id, updates) => {
      if (!isAdmin) return { success: false, error: 'Admin access required' };
      try {
        const result = await updateGame(id, updates);
        if (!result) throw new Error('Failed to update game');
        await fetchGames();
        return { success: true, game: result };
      } catch (err) {
        console.error('Update game error:', err);
        return { success: false, error: err.message };
      }
    },
    [isAdmin, fetchGames]
  );

  // ============================================
  // 🗑️ Delete Game (Admin only)
  // ============================================
  const removeGame = useCallback(
    async (id) => {
      if (!isAdmin) return { success: false, error: 'Admin access required' };
      try {
        const success = await deleteGame(id);
        if (!success) throw new Error('Failed to delete game');
        await fetchGames();
        return { success: true };
      } catch (err) {
        console.error('Delete game error:', err);
        return { success: false, error: err.message };
      }
    },
    [isAdmin, fetchGames]
  );

  // ============================================
  // 🔍 Filtered & Sorted Games
  // ============================================
  const filteredGames = useMemo(() => {
    let result = [...games];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (game) =>
          game.name?.toLowerCase().includes(q) ||
          game.description?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((game) => game.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'price-low':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'name':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        break;
    }

    return result;
  }, [games, searchQuery, selectedCategory, sortBy]);

  // ============================================
  // 🎁 Return
  // ============================================
  return {
    // State
    games,
    filteredGames,
    loading,
    error,

    // Filters
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,

    // Actions
    refresh: fetchGames,
    createGame,
    editGame,
    removeGame,

    // Computed
    totalGames: games.length,
    hasGames: games.length > 0,
  };
};

export default useGames;