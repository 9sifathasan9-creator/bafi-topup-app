import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Trophy, ArrowRight, Megaphone, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useGames } from '../../hooks/useGames';
import { supabase } from '../../supabaseClient';
import { ROUTES } from '../../utils/constants';
import GameGrid from '../../components/games/GameGrid';

const Home = () => {
  const { t } = useLanguage();
  const { filteredGames, loading } = useGames();
  const [notices, setNotices] = useState([]);
  const [noticeError, setNoticeError] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const fetchNotices = async () => {
    const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false }).limit(5);
    if (error) {
      console.error('Notice Fetch Error:', error);
      setNoticeError(error.message);
    } else {
      setNotices(data || []);
      setNoticeError(null);
    }
  };

  useEffect(() => {
    fetchNotices();
    const interval = setInterval(fetchNotices, 5000); // প্রতি ৫ সেকেন্ডে চেক
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔍 ডিবাগ বক্স (নোটিশের জন্য) */}
      <div style={{backgroundColor: "#ef4444", color: "white", padding: "4px", fontSize: "10px", textAlign: "center", zIndex: 9999}}>
        <strong>Notice Debug:</strong> Count = {notices.length} | Error = {noticeError ? noticeError : "None"}
      </div>

      <section className="px-3 pt-4 pb-2 flex-1">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
          
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

          {notices.length > 0 ? (
            <div className="w-full max-w-md mx-auto mb-4 mt-2 relative">
              <div className="overflow-hidden rounded-xl border border-purple-500/30 bg-gray-900/60 backdrop-blur-md shadow-lg">
                <div className="flex">
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
                        <h3 className="text-sm font-bold text-white line-clamp-1">{notice.title}</h3>
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
            </div>
          ) : (
            <p className="text-white text-xs mb-4">No notices found in database.</p>
          )}

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

      {selectedNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedNotice(null)}>
          <div className="bg-gray-900 border border-gray-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: '85vh' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50 flex-shrink-0">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Megaphone className="w-5 h-5 text-purple-400" /> Notice</h2>
              <button onClick={() => setSelectedNotice(null)} className="p-1.5 text-gray-400 hover:text-white bg-gray-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              {selectedNotice.image_url && (
                <div className="w-full mb-4 rounded-xl overflow-hidden border border-gray-700">
                  <img src={selectedNotice.image_url} alt="Notice" className="w-full h-auto object-contain" />
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2">{selectedNotice.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedNotice.content}</p>
            </div>
            <div className="p-4 border-t border-gray-800 bg-gray-900/50">
              <button onClick={() => setSelectedNotice(null)} className="w-full py-2.5 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
