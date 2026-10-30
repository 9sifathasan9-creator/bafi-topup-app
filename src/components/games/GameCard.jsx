import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { formatGamePrice } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import Card from '../ui/Card';
import Button from '../ui/Button';

const GameCard = ({ game, isFavorite = false, onToggleFavorite }) => {
  const { t } = useLanguage();
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { notifySuccess, notifyInfo } = useNotifications();

  if (!game) return null;

  const inCart = isInCart(game.id);

  // ব্রাউজার যেন পুরোনো লোগো ক্যাশ না করে, সেজন্য টাইমস্ট্যাম্প যোগ করা হলো
  const getCacheBustedImageUrl = (url) => {
    if (!url) return null;
    // যদি লিংকে ? থাকে তবে & ব্যবহার করবে, না থাকলে ? ব্যবহার করবে
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${new Date().getTime()}`;
  };

  const imageUrl = getCacheBustedImageUrl(game.image_url);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { notifyInfo(t('loginRequired') || 'Please login first'); return; }
    addToCart(game);
    notifySuccess(`🎮 ${game.name} ${t('addedToCart') || 'added to cart!'}`);
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { notifyInfo(t('loginRequired') || 'Please login first'); return; }
    onToggleFavorite?.(game.id);
  };

  return (
    <Link to={`${ROUTES.GAMES}/${game.id}`}>
      <Card variant="gaming" padding="none" hover className="overflow-hidden group h-full flex flex-col">
        <div className="relative bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-6 flex items-center justify-center aspect-video">
          {imageUrl ? (
            <img src={imageUrl} alt={game.name} className="w-full h-full object-cover absolute inset-0" loading="lazy" />
          ) : (
            <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{game.icon || '🎮'}</span>
          )}
          <button onClick={handleFavorite} className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-lg transition ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-red-500'}`}>
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          {game.category && <span className="absolute top-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-lg text-white text-xs font-semibold rounded-full capitalize">{game.category}</span>}
          {game.stock !== undefined && game.stock <= 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="px-4 py-2 bg-red-500 text-white font-bold text-sm rounded-lg">{t('outOfStock') || 'Out of Stock'}</span>
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-gray-800 dark:text-white text-base mb-1 line-clamp-1">{game.name}</h3>
          {game.description && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{game.description}</p>}
          <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('startingFrom') || 'From'}</p>
              <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{formatGamePrice(game.price)}</p>
            </div>
            <Button size="sm" variant={inCart ? 'success' : 'primary'} leftIcon={inCart ? Zap : ShoppingCart} onClick={handleAddToCart} disabled={game.stock !== undefined && game.stock <= 0}>
              {inCart ? t('inCart') || 'In Cart' : t('addToCart') || 'Add'}
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default GameCard;
