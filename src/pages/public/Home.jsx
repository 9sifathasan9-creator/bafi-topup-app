import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Trophy, ArrowRight, Megaphone, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useGames } from '../../hooks/useGames';
import { supabase } from '../../supabaseClient';
import { ROUTES } from '../../utils/constants';
import Card from '../../components/ui/Card';
import GameGrid from '../../components/games/GameGrid';

const Home = () => {
  const { t } = useLanguage();
  const { filteredGames, loading } = useGames();
  const [notices, setNotices] = useState([]);
  const [currentNotice, setCurrentNotice] = useState(0);

  // নোটিশ লোড করা
  useEffect(() => {
    const fetchNotices = async () => {
      const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false }).limit(5);
      if (data && data.length > 0) setNotices(data);
    };
    fetchNotices();

    const uniqueId = Math.random().toString(36).substring(2, 9);
    const channel = supabase.channel(`public:notices-${uniqueId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => fetchNotices())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  // স্লাইডার অটো প্লে (৩ সেকেন্ড পর পর)
  useEffect(() => {
    if (notices.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentNotice((prev) => (prev + 1) % notices.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [notices]);

  return (
    <div className="min-h-screen flex flex-col">
      <section className="px-3 pt-4 pb-2 flex-1">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
          
          {/* Logo & Title (Size Reduced) */}
          <div className="flex flex-col items-center justify-center mb-3">
            <div className="glow-effect p-0.5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-2">
              <img src="/icon-192.png" alt="BAFI Topup" className="w-14 h-14 rounded-xl object-cover" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-none">
              BAFI <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">Topup</span>
            </h1>
            <p className="text-[10px] md:text-xs text-slate-600 dark:text-white/70 max-w-xs mx-auto mt-1">
              {t('welcomeSubtitle') || 'Your ultimate gaming top-up platform.'}
            </p>
          </div>

          {/* স্লাইডিং নোটিশ বোর্ড */}
          {notices.length > 0 && (
            <div className="w-full max-w-sm mx-auto mb-4 mt-2 relative">
              <div className="overflow-hidden rounded-xl border border-purple-500/30 bg-gray-900/50 backdrop-blur-sm">
                <div 
                  className="flex transition-transform duration-500 ease-in-out" 
                  style={{ transform: `translateX(-${currentNotice * 100}%)` }}
                >
                  {notices.map((notice) => (
                    <div key={notice.id} className="w-full flex-shrink-0 p-3 text-left flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Megaphone className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h3 className="text-xs font-bold text-white truncate">{notice.title}</h3>
                          <span className="flex items-center gap-0.5 bg-red-500/20 text-red-400 text-[8px] font-bold px-1 py-0.5 rounded-full">
                            <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></span> LIVE
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 truncate">{notice.content}</p>
                      </div>
                      {notice.image_url && (
                        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                          <img src={notice.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* ডট ইন্ডিকেটর */}
              {notices.length > 1 && (
                <div className="flex justify-center gap-1 mt-2">
                  {notices.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentNotice(idx)} className={`w-1.5 h-1.5 rounded-full transition ${currentNotice === idx ? 'bg-purple-500 w-3' : 'bg-gray-600'}`} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Feature Badges (Size Reduced) */}
          <div className="flex flex-wrap justify-center gap-1.5 w-full max-w-xs mx-auto mb-4">
            <span className="px-2 py-1 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[9px] font-bold text-slate-700 dark:text-gray-300 flex items-center gap-1 shadow-sm">
              <Zap className="w-2.5 h-2.5 text-purple-500" /> Instant
            </span>
            <span className="px-2 py-1 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[9px] font-bold text-slate-700 dark:text-gray-300 flex items-center gap-1 shadow-sm">
              <Trophy className="w-2.5 h-2.5 text-yellow-500" /> Best Price
            </span>
            <span className="px-2 py-1 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[9px] font-bold text-slate-700 dark:text-gray-300 flex items-center gap-1 shadow-sm">
              <Shield className="w-2.5 h-2.5 text-blue-500" /> Secure
            </span>
          </div>
        </div>
      </section>

      <section className="px-3 pb-12 mt-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm md:text-base font-bold text-slate-800 dark:text-white">{t('popularGames') || 'Popular Games'}</h2>
            <Link to={ROUTES.GAMES} className="text-[10px] text-purple-600 dark:text-purple-400 font-bold flex items-center gap-0.5">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <GameGrid games={filteredGames.slice(0, 8)} loading={loading} columns="auto" />
        </div>
      </section>
    </div>
  );
};

export default Home;
