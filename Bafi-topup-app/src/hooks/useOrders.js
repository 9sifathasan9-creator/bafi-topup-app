// ============================================
// 📦 useOrders Hook
// ============================================
// ইউজারের অর্ডার ম্যানেজ করে:
// অর্ডার তৈরি, লিস্ট, আপডেট, ক্যান্সেল

import { useState, useEffect, useCallback } from 'react';
import {
  getOrders,
  addOrder,
  updateOrder,
} from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

// ============================================
// 🎣 Main Hook
// ============================================
export const useOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================
  // 📥 Fetch Orders
  // ============================================
  const fetchOrders = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getOrders(user.id);
      setOrders(data || []);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // ============================================
  // 🔄 Auto Fetch on Mount
  // ============================================
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, fetchOrders]);

  // ============================================
  // ➕ Create Order
  // ============================================
  const createOrder = useCallback(
    async (orderData) => {
      if (!user?.id) {
        return { success: false, error: 'User not logged in' };
      }

      try {
        const newOrder = {
          user_id: user.id,
          game_id: orderData.gameId,
          game_name: orderData.gameName,
          player_id: orderData.playerId,
          server_id: orderData.serverId || '',
          amount: orderData.amount,
          quantity: orderData.quantity || 1,
          payment_method: orderData.paymentMethod || 'bkash',
          status: 'pending',
          notes: orderData.notes || '',
        };

        const result = await addOrder(newOrder);
        if (!result) {
          throw new Error('Failed to create order');
        }

        // রিফ্রেশ
        await fetchOrders();
        return { success: true, order: result };
      } catch (err) {
        console.error('Create order error:', err);
        return { success: false, error: err.message };
      }
    },
    [user?.id, fetchOrders]
  );

  // ============================================
  // 🔄 Update Order Status
  // ============================================
  const updateOrderStatus = useCallback(
    async (orderId, status) => {
      try {
        const result = await updateOrder(orderId, { status });
        if (!result) throw new Error('Failed to update order');

        await fetchOrders();
        return { success: true, order: result };
      } catch (err) {
        console.error('Update order error:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchOrders]
  );

  // ============================================
  // ❌ Cancel Order
  // ============================================
  const cancelOrder = useCallback(
    async (orderId) => {
      try {
        const result = await updateOrder(orderId, { status: 'cancelled' });
        if (!result) throw new Error('Failed to cancel order');

        await fetchOrders();
        return { success: true, order: result };
      } catch (err) {
        console.error('Cancel order error:', err);
        return { success: false, error: err.message };
      }
    },
    [fetchOrders]
  );

  // ============================================
  // 📊 Computed
  // ============================================
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  ).length;

  const completedOrders = orders.filter(
    (o) => o.status === 'completed'
  ).length;

  const cancelledOrders = orders.filter(
    (o) => o.status === 'cancelled' || o.status === 'failed'
  ).length;

  const totalSpent = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + Number(o.amount || 0), 0);

  // ============================================
  // 🎁 Return
  // ============================================
  return {
    // State
    orders,
    loading,
    error,

    // Actions
    createOrder,
    updateOrderStatus,
    cancelOrder,
    refresh: fetchOrders,

    // Computed
    totalOrders,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    totalSpent,
    hasOrders: orders.length > 0,
  };
};

export default useOrders;