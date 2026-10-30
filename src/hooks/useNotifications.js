// ============================================
// 🔔 useNotifications Hook
// ============================================
// NotificationContext-এর উপরে বাড়তি সুবিধা:
// Supabase real-time + helper methods

import { useEffect, useCallback } from 'react';
import { useNotification as useNotificationContext } from '../context/NotificationContext';
import { supabase } from '../supabaseClient';

// ============================================
// 🎣 Main Hook
// ============================================
export const useNotifications = () => {
  const notification = useNotificationContext();

  // ============================================
  // 🔔 Subscribe to Supabase Realtime
  // ============================================
  useEffect(() => {
    // games টেবিলের পরিবর্তন শুনি
    const gamesChannel = supabase
      .channel('notif-games')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'games' },
        (payload) => {
          const game = payload.new;
          notification.showSuccess(`🎮 New game added: ${game?.name || 'Unknown'}`);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'games' },
        (payload) => {
          const game = payload.new;
          notification.showInfo(`✏️ Game updated: ${game?.name || 'Unknown'}`);
        }
      )
      .subscribe();

    // notices টেবিলের পরিবর্তন শুনি
    const noticesChannel = supabase
      .channel('notif-notices')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notices' },
        (payload) => {
          const notice = payload.new;
          notification.showInfo(`📢 ${notice?.title || 'New notice'}`);
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(gamesChannel);
      supabase.removeChannel(noticesChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // 🎯 Helper Methods
  // ============================================
  const notifyGameAdded = useCallback(
    (name) => notification.showSuccess(`🎮 Game added: ${name}`),
    [notification]
  );

  const notifyGameUpdated = useCallback(
    (name) => notification.showInfo(`✏️ Game updated: ${name}`),
    [notification]
  );

  const notifyGameDeleted = useCallback(
    () => notification.showInfo('🗑️ Game deleted'),
    [notification]
  );

  const notifyNoticeAdded = useCallback(
    (title) => notification.showInfo(`📢 ${title}`),
    [notification]
  );

  const notifySettingsSaved = useCallback(
    () => notification.showSuccess('⚙️ Settings saved'),
    [notification]
  );

  const notifyOrderPlaced = useCallback(
    (orderId) =>
      notification.showSuccess(`📦 Order placed #${orderId?.slice(-6) || ''}`),
    [notification]
  );

  const notifyOrderCompleted = useCallback(
    () => notification.showSuccess('✅ Order completed!'),
    [notification]
  );

  const notifyPaymentReceived = useCallback(
    (amount) => notification.showSuccess(`💰 Payment received: ৳${amount}`),
    [notification]
  );

  const notifyError = useCallback(
    (message) => notification.showError(`❌ ${message}`),
    [notification]
  );

  const notifySuccess = useCallback(
    (message) => notification.showSuccess(`✅ ${message}`),
    [notification]
  );

  const notifyWarning = useCallback(
    (message) => notification.showWarning(`⚠️ ${message}`),
    [notification]
  );

  const notifyInfo = useCallback(
    (message) => notification.showInfo(`ℹ️ ${message}`),
    [notification]
  );

  // ============================================
  // 🎁 Return
  // ============================================
  return {
    // Context থেকে সব
    ...notification,

    // Helper methods
    notifyGameAdded,
    notifyGameUpdated,
    notifyGameDeleted,
    notifyNoticeAdded,
    notifySettingsSaved,
    notifyOrderPlaced,
    notifyOrderCompleted,
    notifyPaymentReceived,
    notifyError,
    notifySuccess,
    notifyWarning,
    notifyInfo,
  };
};

export default useNotifications;