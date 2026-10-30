import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../hooks/useNotifications';
import { formatGamePrice } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import Card from '../ui/Card';

const FavoriteCard = ({ game, onRemove }) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { notifySuccess } = useNotifications();

  if (!game) return null;

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove?.(game.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(game);
    notifySuccess(`🎮 ${game.name} ${t('addedToCart') || 'added!'}`);
  };

  return (
    <Link to={`${ROUTES.GAMES}/${game.id}`}>
      <Card variant="gaming" padding="none" hover className="overflow-hidden group">
        <div className="relative aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
          {game.image_url ? (
            <img src={game.image_url} alt={game.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl group-hover:scale-110 transition-transform">
              {game.icon || '🎮'}
            </span>
          )}

          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
            aria-label="Remove"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>

          {game.rating !== undefined && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-lg rounded-full">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-white text-xs font-bold">
                {Number(game.rating).toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-2 line-clamp-1">
            {game.name}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <p className="text-base font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {formatGamePrice(game.price)}
            </p>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default FavoriteCard;
