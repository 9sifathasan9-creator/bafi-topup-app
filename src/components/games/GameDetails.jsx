import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Star,
  Zap,
  Package,
  ArrowLeft,
  Info,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { formatGamePrice } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

// ============================================
// 🎮 Game Details Component
// ============================================
// গেমের বিস্তারিত পেজ (main content)

const GameDetails = ({ game, isFavorite = false, onToggleFavorite }) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { notifySuccess, notifyInfo } = useNotifications();

  const [quantity, setQuantity] = useState(1);
  const [playerId, setPlayerId] = useState('');
  const [serverId, setServerId] = useState('');

  if (!game) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-white/70">{t('loading') || 'Loading...'}</p>
      </div>
    );
  }

  const inCart = isInCart(game.id);
  const isOutOfStock = game.stock !== undefined && game.stock <= 0;

  // ============================================
  // 🛒 Add to Cart
  // ============================================
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      notifyInfo(t('loginRequired') || 'Please login first');
      navigate(ROUTES.LOGIN);
      return;
    }

    if (isOutOfStock) {
      notifyInfo(t('outOfStock') || 'Out of stock');
      return;
    }

    addToCart({ ...game, quantity });
    notifySuccess(`🎮 ${game.name} ${t('addedToCart') || 'added to cart!'}`);
  };

  // ============================================
  // ⚡ Buy Now (Direct to Checkout)
  // ============================================
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      notifyInfo(t('loginRequired') || 'Please login first');
      navigate(ROUTES.LOGIN);
      return;
    }

    addToCart({ ...game, quantity });
    navigate(ROUTES.CHECKOUT);
  };

  // ============================================
  // ❤️ Toggle Favorite
  // ============================================
  const handleFavorite = () => {
    if (!isAuthenticated) {
      notifyInfo(t('loginRequired') || 'Please login first');
      return;
    }
    onToggleFavorite?.(game.id);
  };

  return (
    <div className="space-y-6">
      {/* ============================================
          Back Button
          ============================================ */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('back') || 'Back'}
      </button>

      {/* ============================================
          Main Grid
          ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ============================================
            Left: Image / Icon
            ============================================ */}
        <div className="lg:col-span-1">
          <Card variant="gaming" padding="none" className="overflow-hidden">
            <div className="relative aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              {game.image_url ? (
                <img
                  src={game.image_url}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-9xl">{game.icon || '🎮'}</span>
              )}

              {/* Stock Badge */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg">
                    {t('outOfStock') || 'Out of Stock'}
                  </span>
                </div>
              )}

              {/* Category Badge */}
              {game.category && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-lg text-white text-xs font-semibold rounded-full capitalize">
                  {game.category}
                </span>
              )}
            </div>
          </Card>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Card padding="sm" className="text-center">
              <Package className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('stock') || 'Stock'}
              </p>
              <p className="text-sm font-bold text-gray-800 dark:text-white">
                {isOutOfStock ? '0' : game.stock || '∞'}
              </p>
            </Card>
            <Card padding="sm" className="text-center">
              <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1 fill-current" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('rating') || 'Rating'}
              </p>
              <p className="text-sm font-bold text-gray-800 dark:text-white">
                {Number(game.rating || 0).toFixed(1)}
              </p>
            </Card>
          </div>
        </div>

        {/* ============================================
            Right: Details & Actions
            ============================================ */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Rating */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">
              {game.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(game.rating || 0)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                ))}
                <span className="text-sm text-white/70 ml-1">
                  {Number(game.rating || 0).toFixed(1)} ({game.total_reviews || 0}{' '}
                  {t('reviews') || 'reviews'})
                </span>
              </div>

              {game.category && (
                <Badge variant="purple" size="sm">
                  {game.category}
                </Badge>
              )}

              {!isOutOfStock && (
                <Badge variant="success" size="sm" dot>
                  {t('inStock') || 'In Stock'}
                </Badge>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {formatGamePrice(game.price)}
              </p>
              {game.original_price && game.original_price > game.price && (
                <p className="text-lg text-white/50 line-through">
                  {formatGamePrice(game.original_price)}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          {game.description && (
            <Card variant="gaming" padding="md">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-gray-800 dark:text-white text-sm">
                  {t('gameDescription') || 'Description'}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {game.description}
              </p>
            </Card>
          )}

          {/* ============================================
              Player Info (Game ID Input)
              ============================================ */}
          <Card variant="gaming" padding="md">
            <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-4">
              {t('playerInfo') || 'Player Information'}
            </h3>

            <div className="space-y-3">
              {/* Player ID */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  {t('playerId') || 'Player ID'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  placeholder={t('enterPlayerId') || 'Enter your player ID'}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>

              {/* Server ID (Optional) */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  {t('serverId') || 'Server ID'}{' '}
                  <span className="text-gray-400">
                    ({t('optional') || 'optional'})
                  </span>
                </label>
                <input
                  type="text"
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  placeholder={t('enterServerId') || 'Enter server ID'}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            </div>
          </Card>

          {/* ============================================
              Quantity & Action Buttons
              ============================================ */}
          <Card variant="gaming" padding="md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('quantity') || 'Qty'}:
                </span>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-bold"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="w-12 h-9 flex items-center justify-center text-sm font-bold text-gray-800 dark:text-white border-x border-gray-300 dark:border-gray-600">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="sm:ml-auto">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('total') || 'Total'}
                </p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {formatGamePrice((game.price || 0) * quantity)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <Button
                variant={inCart ? 'success' : 'secondary'}
                size="lg"
                leftIcon={inCart ? Zap : ShoppingCart}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                fullWidth
              >
                {inCart ? t('inCart') || 'In Cart' : t('addToCart') || 'Add to Cart'}
              </Button>

              <Button
                variant="primary"
                size="lg"
                rightIcon={ChevronRight}
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                fullWidth
              >
                {t('buyNow') || 'Buy Now'}
              </Button>
            </div>

            {/* Favorite */}
            <button
              onClick={handleFavorite}
              className={`
                mt-3 w-full inline-flex items-center justify-center gap-2
                py-2.5 rounded-lg text-sm font-medium transition
                ${
                  isFavorite
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `.trim()}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite
                ? t('removeFromFavorites') || 'Remove from Favorites'
                : t('addToFavorites') || 'Add to Favorites'}
            </button>
          </Card>

          {/* ============================================
              Info Notice
              ============================================ */}
          <div className="bg-yellow-500/10 backdrop-blur-lg border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-yellow-200/90 space-y-1">
                <p className="font-semibold">
                  {t('importantInfo') || 'Important Information'}
                </p>
                <p>
                  • {t('info1') || 'Player ID অবশ্যই সঠিক দিতে হবে'}
                </p>
                <p>
                  • {t('info2') || 'ভুল তথ্যের জন্য দায়ী থাকবে না'}
                </p>
                <p>
                  • {t('info3') || 'পেমেন্ট সম্পন্ন হলে ৫-১০ মিনিটের মধ্যে টপ-আপ হবে'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;