import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Trophy, ArrowRight, Megaphone, X } from 'lucide-react';
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
  const [selectedNotice, setSelectedNotice] = useState(null); // ফুল স্ক্রিন নোটিশের জন্য
  const [isInteracting, setIsInteracting] = useState(false); // ইউজার টাচ করলে স্লাইড বন্ধ রাখার জন্য

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

  // স্লাইডার অটো প্লে (৩ সেকেন্ড পর পর, যদি ইউজার ইন্টার‌্যাক্ট না করে)
  useEffect(() => {
    if (notices.length <= 1 || isInteracting) return;
    const interval = setInterval(() => {
      setCurrentNotice((prev) => (prev + 1) % notices.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [notices, isInteracting]);

  return (
    <div className="min-h-screen flex flex-col">
      <section className="px-3 pt-4 pb-2 flex-1">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
          
          {/* Logo & Title */}
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

          {/* 🔥 নতুন বড় স্লাইডিং নোটিশ বোর্ড */}
          {notices.length > 0 && (
            <div 
              className="w-full max-w-md mx-auto mb-4 mt-2 relative"
              onMouseEnter={() => setIsInteracting(true)}
              onMouseLeave={() => setIsInteracting(false)}
              onTouchStart={() => setIsInteracting(true)}
              onTouchEnd={() => setTimeout(() => setIsInteracting(false), 5000)} // টাচ করার ৫ সেকেন্ড পর আবার চালু হবে
            >
              <div className="overflow-hidden rounded-xl border border-purple-500/30 bg-gray-900/60 backdrop-blur-md shadow-lg">
                <div 
                  className="flex transition-transform duration-500 ease-in-out" 
                  style={{ transform: `translateX(-${currentNotice * 100}%)` }}
                >
                  {notices.map((notice) => (
                    <div 
                      key={notice.id} 
                      onClick={() => setSelectedNotice(notice)}
                      className="w-full flex-shrink-0 p-4 text-left flex gap-3 items-start cursor-pointer hover:bg-white/5 transition"
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Megaphone className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <h3 className="text-sm font-bold text-white line-clamp-1">{notice.title}</h3>
                          <span className="flex items-center gap-0.5 bg-red-500/20 text-red-400 text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                            <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></span> LIVE
                          </span>
                        </div>
                        {/* লেখা এখন ২ লাইন পর্যন্ত দেখা যাবে */}
                        <p className="text-xs text-gray-300 line-clamp-2">{notice.content}</p>
                      </div>
                      {notice.image_url && (
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border border-white/10">
                          <img src={notice.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* ডট ইন্ডিকেটর (ম্যানুয়াল ক্লিক করে স্ক্রল করা যাবে) */}
              {notices.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-3">
                  {notices.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => { setCurrentNotice(idx); setIsInteracting(true); }} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${currentNotice === idx ? 'bg-purple-500 w-5' : 'bg-gray-600 w-1.5 hover:bg-gray-400'}`} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Feature Badges */}
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

      {/* 🔥 ফুল-স্ক্রিন নোটিশ মডাল (ক্লিক করলে পুরোটা পড়া যাবে) */}
      {selectedNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedNotice(null)}>
          <div 
            className="bg-gray-900 border border-gray-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-scale-in max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* মডাল হেডার */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-purple-400" /> Notice Details
              </h2>
              <button onClick={() => setSelectedNotice(null)} className="p-1.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* মডাল বডি (স্ক্রলযোগ্য) */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
              {selectedNotice.image_url && (
                <div className="w-full mb-4 rounded-xl overflow-hidden border border-gray-700 bg-black/20">
                  <img src={selectedNotice.image_url} alt="Notice" className="w-full h-auto object-contain max-h-64" />
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2">{selectedNotice.title}</h3>
              <p className="text-[10px] text-purple-400 font-semibold mb-3">
                {new Date(selectedNotice.created_at).toLocaleString()}
              </p>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {selectedNotice.content}
              </p>
            </div>
            
            {/* মডাল ফুটার */}
            <div className="p-4 border-t border-gray-800 bg-gray-900/50">
              <button onClick={() => setSelectedNotice(null)} className="w-full py-2.5 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition">
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
