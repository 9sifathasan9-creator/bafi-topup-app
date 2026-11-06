import React from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useLanguage } from '../../context/LanguageContext';

// ============================================
// 📋 Notification List (Full Page/Modal এ ব্যবহার)
// ============================================
// বেল ড্রপডাউনের বাইরে আলাদা লিস্ট হিসেবে

const NotificationList = ({ showHeader = true, maxHeight = 'auto' }) => {
  const {
    notifications,
    unreadCount,
    markAllRead,
    markAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();
  const { t } = useLanguage();

  // ============================================
  // 🎨 Type Color
  // ============================================
  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return { border: 'border-l-green-500', bg: 'bg-green-50 dark:bg-green-900/20', dot: 'bg-green-500' };
      case 'error':
        return { border: 'border-l-red-500', bg: 'bg-red-50 dark:bg-red-900/20', dot: 'bg-red-500' };
      case 'warning':
        return { border: 'border-l-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', dot: 'bg-yellow-500' };
      default:
        return { border: 'border-l-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', dot: 'bg-blue-500' };
    }
  };

  // ============================================
  // 🕐 Format Time
  // ============================================
  const formatTime = (time) => {
    const date = new Date(time);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  // ============================================
  // Empty State
  // ============================================
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <Bell className="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {t('noNotifications')}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ============================================
          Header
          ============================================ */}
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-white text-base">
            {t('notifications')} {unreadCount > 0 && `(${unreadCount})`}
          </h3>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                title={t('markAllRead')}
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={clearAll}
              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
              title={t('clearAll')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================
          List
          ============================================ */}
      <div
        className="overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700"
        style={{ maxHeight }}
      >
        {notifications.map((notif) => {
          const styles = getTypeStyles(notif.type);
          return (
            <div
              key={notif.id}
              onClick={() => !notif.read && markAsRead(notif.id)}
              className={`relative px-4 py-3 border-l-4 cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-700/50 ${styles.border} ${
                !notif.read ? styles.bg : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Dot */}
                <span
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${styles.dot} ${
                    notif.read ? 'opacity-30' : ''
                  }`}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm break-words ${
                      notif.read
                        ? 'text-gray-600 dark:text-gray-400'
                        : 'text-gray-800 dark:text-white font-medium'
                    }`}
                  >
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatTime(notif.time)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notif.id);
                  }}
                  className="text-gray-400 hover:text-red-500 transition flex-shrink-0 p-1"
                  aria-label="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationList;