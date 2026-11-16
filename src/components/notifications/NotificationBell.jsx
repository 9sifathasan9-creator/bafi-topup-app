import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useLanguage } from '../../context/LanguageContext';

const NotificationBell = () => {
  const { notifications, unreadCount, markAllRead, removeNotification, clearAll } = useNotifications();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'error': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-1.5 sm:p-2 bg-white/10 backdrop-blur-lg rounded-lg text-white hover:bg-white/20 transition" aria-label="Notifications">
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          {/* মোবাইলের জন্য ফিক্সড পজিশন, ডেস্কটপের জন্য অ্যাবসোলিউট */}
          <div className="fixed top-16 left-1/2 -translate-x-1/2 w-[90vw] max-w-sm sm:absolute sm:top-full sm:right-0 sm:left-auto sm:translate-x-0 sm:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700 animate-slide-down">
            
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <h3 className="font-bold text-gray-800 dark:text-white text-sm">
                {t('notifications')} {unreadCount > 0 && `(${unreadCount})`}
              </h3>
              {notifications.length > 0 && (
                <div className="flex items-center gap-1">
                  <button onClick={markAllRead} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition" title="Mark all read"><Check className="w-4 h-4" /></button>
                  <button onClick={clearAll} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition" title="Clear all"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('noNotifications')}</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className={`relative px-4 py-3 border-b border-gray-100 dark:border-gray-700 border-l-4 transition hover:bg-gray-50 dark:hover:bg-gray-700/50 ${getTypeColor(notif.type)}`}>
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 dark:text-white break-words">{notif.message}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{new Date(notif.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <button onClick={() => removeNotification(notif.id)} className="text-gray-400 hover:text-red-500 transition flex-shrink-0"><X className="w-4 h-4" /></button>
                    </div>
                    {!notif.read && <span className="absolute top-3 right-9 w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
