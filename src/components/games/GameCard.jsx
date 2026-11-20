import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../utils/constants';

const GameCard = ({ game, isFavorite = false, onToggleFavorite }) => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { notifyInfo } = useNotifications();

  if (!game) return null;

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { notifyInfo(t('loginRequired') || 'Please login first'); return; }
    onToggleFavorite?.(game.id);
  };

  return (
    <Link to={`${ROUTES.GAMES}/${game.id}`} className="block group">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-gray-900">
        
        {/* গেমের ছবি বা ব্যাকগ্রাউন্ড */}
        {game.image_url ? (
          <img 
            src={game.image_url} 
            alt={game.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 to-gray-900 flex items-center justify-center">
            <span className="text-6xl opacity-50">{game.icon || '🎮'}</span>
          </div>
        )}

        {/* গ্রেডিয়েন্ট ওভারলে (লেখা পরিষ্কার দেখানোর জন্য) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f17] via-[#0f0f17]/40 to-transparent"></div>

        {/* উপরে ডানদিকে ফেভারিট বাটন */}
        <button 
          onClick={handleFavorite} 
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition z-10"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* উপরে বাম দিকে ক্যাটাগরি */}
        <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-md text-[10px] font-bold text-white rounded-md uppercase tracking-wider z-10">
          {game.category || 'Game'}
        </span>

        {/* নিচে বাম দিকে লেখা */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          {/* কারেন্সির নাম এবং ছোট আইকন প্লেসহোল্ডার */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-3 h-3 rounded-full bg-purple-500/30 border border-purple-400/50 flex items-center justify-center">
               {/* এখানে ভবিষ্যতে কারেন্সি ছবি বসানো যাবে */}
            </span>
            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
              {/* গেমের নাম দেখে অটো ডায়মন্ড বা কয়েন সেট হবে, অথবা ডিফল্ট */}
              {game.name.toLowerCase().includes('pubg') ? 'UC' : game.name.toLowerCase().includes('free fire') ? 'DIAMONDS' : 'COINS'}
            </p>
          </div>
          {/* গেমের নাম */}
          <h3 className="text-lg font-bold text-white leading-tight truncate">
            {game.name}
          </h3>
        </div>

      </div>
    </Link>
  );
};

export default GameCard;
