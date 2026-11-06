import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useLanguage } from '../../context/LanguageContext';

// ============================================
// 🔔 Notification Bell Button
// ============================================
// Navbar-এ বেল আইকন + ড্রপডাউন

const NotificationBell = () => {
  const { 
    notifications, 
    unreadCount, 
    markAllRead, 
    removeNotification, 
    clearAll 
  } = useNotifications();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ============================================
  // 🎧 Outside Click Close
  // ============================================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // ============================================
  // 🎨 Type Colors
  // ============================================
  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-white dark:bg-white/10 shadow-sm border border-gray-200 dark:border-none backdrop-blur-lg rounded-lg text-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 transition"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700 animate-slide-down">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h3 className="font-bold text-gray-800 dark:text-white text-sm">
              {t('notifications')} {unreadCount > 0 && `(${unreadCount})`}
            </h3>
            {notifications.length > 0 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={markAllRead}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                  title={t('markAllRead')}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={clearAll}
                  className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                  title={t('clearAll')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('noNotifications')}
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`relative px-4 py-3 border-b border-gray-100 dark:border-gray-700 border-l-4 transition hover:bg-gray-50 dark:hover:bg-gray-700/50 ${getTypeColor(notif.type)} dark:bg-gray-800`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 dark:text-white break-words">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(notif.time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => removeNotification(notif.id)}
                      className="text-gray-400 hover:text-red-500 transition flex-shrink-0"
                      aria-label="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {!notif.read && (
                    <span className="absolute top-3 right-9 w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;