import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Trophy, ArrowRight, Megaphone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useGames } from '../../hooks/useGames';
import { supabase } from '../../supabaseClient';
import { ROUTES } from '../../utils/constants';
import Card from '../../components/ui/Card';
import GameGrid from '../../components/games/GameGrid';

const Home = () => {
  const { t } = useLanguage();
  const { filteredGames, loading } = useGames();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false }).limit(1).single();
      if (data) setNotice(data);
    };
    fetchNotice();

    const channel = supabase.channel('public:notices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => fetchNotice())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <section className="px-4 pt-8 pb-4 flex-1">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
          
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="glow-effect p-1 bg-gradient-to-br from-purple-500 to-blue-500 rounded-[1.5rem] mb-4">
              <img src="/icon-192.png" alt="BAFI Topup" className="w-20 h-20 rounded-2xl object-cover" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white leading-none">
              BAFI <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400">Topup</span>
            </h1>
          </div>
          
          <p className="text-xs md:text-sm text-slate-600 dark:text-white/70 max-w-sm mx-auto mb-8">
            {t('welcomeSubtitle') || 'Your ultimate gaming top-up platform. Secure, fast, and reliable.'}
          </p>

          {notice && (
            <Card variant="gaming" padding="md" className="w-full max-w-md mx-auto border-l-4 border-purple-500 text-left relative overflow-hidden mb-8 shadow-lg shadow-purple-500/10 dark:shadow-purple-500/20">
              <div className="absolute -right-4 -top-4 text-purple-500/10">
                <Megaphone className="w-20 h-20" />
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <Megaphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Notice Board</span>
                <span className="flex items-center gap-1 bg-red-500/20 text-red-500 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> LIVE
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">{notice.title}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 whitespace-pre-wrap">{notice.content}</p>
            </Card>
          )}

          <div className="flex flex-col gap-2 w-full max-w-xs mx-auto mb-12 mt-4">
            <div className="grid grid-cols-2 gap-2">
              <Card variant="gaming" padding="sm" className="flex flex-row items-center justify-center gap-1.5 py-1.5 rounded-full bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm">
                <Zap className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />
                <p className="text-[10px] font-bold text-slate-700 dark:text-gray-200 truncate">{t('instantTopup') || 'Instant Top-up'}</p>
              </Card>
              <Card variant="gaming" padding="sm" className="flex flex-row items-center justify-center gap-1.5 py-1.5 rounded-full bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm">
                <Trophy className="w-3 h-3 text-yellow-500 dark:text-yellow-400 shrink-0" />
                <p className="text-[10px] font-bold text-slate-700 dark:text-gray-200 truncate">{t('bestPrices') || 'Best Price'}</p>
              </Card>
            </div>
            <Card variant="gaming" padding="sm" className="flex flex-row items-center justify-center gap-1.5 py-1.5 rounded-full bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm">
              <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
              <p className="text-[10px] font-bold text-slate-700 dark:text-gray-200 truncate">{t('securePayment') || '100% Secure Payment'}</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 mt-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">{t('popularGames') || 'Popular Games'}</h2>
            <Link to={ROUTES.GAMES} className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center gap-1 font-bold">
              {t('viewAll') || 'View All'} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <GameGrid games={filteredGames.slice(0, 8)} loading={loading} columns="auto" />
        </div>
      </section>
    </div>
  );
};

export default Home;
