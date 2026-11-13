import { useEffect, useCallback } from 'react';
import { useNotification as useNotificationContext } from '../context/NotificationContext';
import { supabase } from '../supabaseClient';

export const useNotifications = () => {
  const notification = useNotificationContext();

  useEffect(() => {
    // খেয়াল করুন: .on() কলগুলো .subscribe() এর আগে করতে হবে
    const gamesChannel = supabase
      .channel('notif-games')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'games' },
        (payload) => {
          notification.showSuccess(`🎮 New game added: ${payload.new?.name || 'Unknown'}`);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'games' },
        (payload) => {
          notification.showInfo(`✏️ Game updated: ${payload.new?.name || 'Unknown'}`);
        }
      )
      .subscribe();

    const noticesChannel = supabase
      .channel('notif-notices')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notices' },
        (payload) => {
          notification.showInfo(`📢 ${payload.new?.title || 'New notice'}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gamesChannel);
      supabase.removeChannel(noticesChannel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ... বাকি হেল্পার ফাংশনগুলো আগের মতোই থাকবে ...
  return {
    ...notification,
    notifyGameAdded: (name) => notification.showSuccess(`🎮 Game added: ${name}`),
    notifyGameUpdated: (name) => notification.showInfo(`✏️ Game updated: ${name}`),
    notifyGameDeleted: () => notification.showInfo('🗑️ Game deleted'),
    notifyNoticeAdded: (title) => notification.showInfo(`📢 ${title}`),
    notifySettingsSaved: () => notification.showSuccess('⚙️ Settings saved'),
    notifyOrderPlaced: (orderId) => notification.showSuccess(`📦 Order placed #${orderId?.slice(-6) || ''}`),
    notifyOrderCompleted: () => notification.showSuccess('✅ Order completed!'),
    notifyPaymentReceived: (amount) => notification.showSuccess(`💰 Payment received: ৳${amount}`),
    notifyError: (message) => notification.showError(`❌ ${message}`),
    notifySuccess: (message) => notification.showSuccess(`✅ ${message}`),
    notifyWarning: (message) => notification.showWarning(`⚠️ ${message}`),
    notifyInfo: (message) => notification.showInfo(`ℹ️ ${message}`),
  };
};

export default useNotifications;
