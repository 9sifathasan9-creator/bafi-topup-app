import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

const Toast = () => {
  const { notifications, removeNotification } = useNotifications();

  const getToastStyles = (type) => {
    switch (type) {
      case 'success': return { icon: CheckCircle, bg: 'bg-green-50 dark:bg-green-900/30', border: 'border-l-green-500', iconColor: 'text-green-500', textColor: 'text-green-800 dark:text-green-200' };
      case 'error': return { icon: XCircle, bg: 'bg-red-50 dark:bg-red-900/30', border: 'border-l-red-500', iconColor: 'text-red-500', textColor: 'text-red-800 dark:text-red-200' };
      case 'warning': return { icon: AlertTriangle, bg: 'bg-yellow-50 dark:bg-yellow-900/30', border: 'border-l-yellow-500', iconColor: 'text-yellow-500', textColor: 'text-yellow-800 dark:text-yellow-200' };
      default: return { icon: Info, bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-l-blue-500', iconColor: 'text-blue-500', textColor: 'text-blue-800 dark:text-blue-200' };
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] sm:w-96">
      {notifications.slice(0, 5).map((notif) => {
        const styles = getToastStyles(notif.type);
        const Icon = styles.icon;
        return (
          <div key={notif.id} className={`flex items-start gap-3 p-4 rounded-xl shadow-lg backdrop-blur-lg border-l-4 ${styles.bg} ${styles.border} animate-slide-down`}>
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${styles.iconColor}`} />
            <p className={`flex-1 text-sm font-medium break-words ${styles.textColor}`}>{notif.message}</p>
            <button onClick={() => removeNotification(notif.id)} className={`flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition ${styles.textColor}`}>
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
