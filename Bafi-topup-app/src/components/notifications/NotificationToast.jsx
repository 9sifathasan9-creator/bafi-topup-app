import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

// ============================================
// 🍞 Notification Toast
// ============================================
// স্ক্রিনের উপরে/নিচে ভাসমান নোটিফিকেশন দেখায়
// সব পেজে App.jsx এ একবার যোগ করলেই হবে

const NotificationToast = ({ position = 'top-right' }) => {
  const { notifications, removeNotification } = useNotifications();

  // ============================================
  // 📊 Filter শুধু Toast-যোগ্য
  // ============================================
  // শেষ ৫টি নোটিফিকেশন দেখাব
  const recentNotifications = notifications.slice(0, 5);

  // ============================================
  // 🎨 Position Class
  // ============================================
  const getPositionClass = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'top-right':
      default:
        return 'top-4 right-4';
    }
  };

  // ============================================
  // 🎨 Type Styles
  // ============================================
  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bg: 'bg-green-50 dark:bg-green-900/30',
          border: 'border-green-500',
          iconColor: 'text-green-500',
          textColor: 'text-green-800 dark:text-green-200',
        };
      case 'error':
        return {
          icon: XCircle,
          bg: 'bg-red-50 dark:bg-red-900/30',
          border: 'border-red-500',
          iconColor: 'text-red-500',
          textColor: 'text-red-800 dark:text-red-200',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bg: 'bg-yellow-50 dark:bg-yellow-900/30',
          border: 'border-yellow-500',
          iconColor: 'text-yellow-500',
          textColor: 'text-yellow-800 dark:text-yellow-200',
        };
      case 'info':
      default:
        return {
          icon: Info,
          bg: 'bg-blue-50 dark:bg-blue-900/30',
          border: 'border-blue-500',
          iconColor: 'text-blue-500',
          textColor: 'text-blue-800 dark:text-blue-200',
        };
    }
  };

  if (recentNotifications.length === 0) return null;

  return (
    <div
      className={`fixed z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] sm:w-96 ${getPositionClass()}`}
    >
      {recentNotifications.map((notif) => (
        <ToastItem
          key={notif.id}
          notification={notif}
          onClose={() => removeNotification(notif.id)}
          getTypeStyles={getTypeStyles}
        />
      ))}
    </div>
  );
};

// ============================================
// 🎯 Individual Toast Item
// ============================================
const ToastItem = ({ notification, onClose, getTypeStyles }) => {
  const styles = getTypeStyles(notification.type);
  const Icon = styles.icon;

  // Auto dismiss (যদিও Context এ handle হয়, তবুও নিরাপত্তার জন্য)
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  return (
    <div
      className={`relative flex items-start gap-3 p-4 rounded-xl shadow-lg border-l-4 backdrop-blur-lg animate-slide-down ${styles.bg} ${styles.border}`}
    >
      {/* Icon */}
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${styles.iconColor}`} />

      {/* Message */}
      <p className={`flex-1 text-sm font-medium break-words ${styles.textColor}`}>
        {notification.message}
      </p>

      {/* Close */}
      <button
        onClick={onClose}
        className={`flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition ${styles.textColor}`}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default NotificationToast;