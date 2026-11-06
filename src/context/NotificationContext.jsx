import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';

// ============================================
// 🔔 Notification Context
// ============================================
// এই কনটেক্সট অ্যাপে নোটিফিকেশন দেখানোর সুবিধা দেয়
// Toast, Bell, Alert সব এখান থেকে ম্যানেজ হয়

const NotificationContext = createContext();

// ============================================
// 🪝 Custom Hook
// ============================================
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

// ============================================
// 📦 Provider Component
// ============================================
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const timersRef = useRef({});

  // ক্লিনআপ - কম্পোনেন্ট unmount হলে টাইমার ক্লিয়ার
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((timer) => clearTimeout(timer));
      timersRef.current = {};
    };
  }, []);

  // ============================================
  // ➕ Add Notification
  // ============================================
  const addNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newNotification = {
      id,
      message,
      type,       // 'success' | 'error' | 'warning' | 'info'
      read: false,
      time: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Auto-remove (নির্দিষ্ট সময় পর)
    if (duration > 0) {
      timersRef.current[id] = setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        delete timersRef.current[id];
      }, duration);
    }

    return id;
  }, []);

  // ============================================
  // 🗑️ Remove Notification
  // ============================================
  const removeNotification = useCallback((id) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // ============================================
  // ✅ Shortcut Methods
  // ============================================
  const showSuccess = useCallback(
    (message, duration) => addNotification(message, 'success', duration),
    [addNotification]
  );

  const showError = useCallback(
    (message, duration) => addNotification(message, 'error', duration || 5000),
    [addNotification]
  );

  const showWarning = useCallback(
    (message, duration) => addNotification(message, 'warning', duration),
    [addNotification]
  );

  const showInfo = useCallback(
    (message, duration) => addNotification(message, 'info', duration),
    [addNotification]
  );

  // ============================================
  // ✅ Mark as Read
  // ============================================
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // ============================================
  // ✅ Mark All as Read
  // ============================================
  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // ============================================
  // 🗑️ Clear All
  // ============================================
  const clearAll = useCallback(() => {
    Object.values(timersRef.current).forEach((timer) => clearTimeout(timer));
    timersRef.current = {};
    setNotifications([]);
  }, []);

  // ============================================
  // 📊 Computed Values
  // ============================================
  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalCount = notifications.length;
  const hasUnread = unreadCount > 0;

  // ============================================
  // 🎁 Context Value
  // ============================================
  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    markAsRead,
    markAllRead,
    clearAll,
    unreadCount,
    totalCount,
    hasUnread,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;