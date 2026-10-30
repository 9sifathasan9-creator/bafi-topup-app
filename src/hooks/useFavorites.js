import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // ইউজার লগইন থাকলে তার আগের পছন্দের লিস্ট লোড করবে
  useEffect(() => {
    if (user?.id) {
      try {
        const saved = localStorage.getItem(`bafi-fav-${user.id}`);
        setFavorites(saved ? JSON.parse(saved) : []);
      } catch {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  // পছন্দের তালিকায় যোগ/বাদ দেওয়া
  const toggleFavorite = useCallback((gameId) => {
    if (!user?.id) return; // লগইন না থাকলে কিছুই করবে না

    setFavorites((prev) => {
      const isFav = prev.includes(gameId);
      const updated = isFav ? prev.filter((id) => id !== gameId) : [...prev, gameId];
      
      try {
        localStorage.setItem(`bafi-fav-${user.id}`, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  }, [user]);

  const isFavorite = useCallback((gameId) => {
    return favorites.includes(gameId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
};

export default useFavorites;
