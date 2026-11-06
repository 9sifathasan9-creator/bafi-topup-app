// ============================================
// 💰 useWallet Hook
// ============================================
// ইউজারের ওয়ালেট ম্যানেজ করে:
// ব্যালেন্স, ট্রানজেকশন, টাকা যোগ/উত্তোলন

import { useState, useEffect, useCallback } from 'react';
import {
  getWallet,
  updateWallet,
  getTransactions,
  addTransaction,
} from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

// ============================================
// 🎣 Main Hook
// ============================================
export const useWallet = () => {
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================
  // 📥 Fetch Wallet Data
  // ============================================
  const fetchWallet = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [walletData, txData] = await Promise.all([
        getWallet(user.id),
        getTransactions(user.id),
      ]);

      setBalance(walletData?.balance || 0);
      setTransactions(txData || []);
    } catch (err) {
      console.error('Fetch wallet error:', err);
      setError(err.message || 'Failed to load wallet');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // ============================================
  // 🔄 Auto Fetch on Mount
  // ============================================
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchWallet();
    } else {
      setBalance(0);
      setTransactions([]);
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, fetchWallet]);

  // ============================================
  // ➕ Add Money (Deposit)
  // ============================================
  const addMoney = useCallback(
    async (amount, method = 'bkash', reference = '') => {
      if (!user?.id) {
        return { success: false, error: 'User not logged in' };
      }

      const numAmount = Number(amount);
      if (!numAmount || numAmount <= 0) {
        return { success: false, error: 'Invalid amount' };
      }

      try {
        // ১. Wallet আপডেট
        const newBalance = balance + numAmount;
        await updateWallet(user.id, newBalance);

        // ২. Transaction রেকর্ড
        await addTransaction({
          user_id: user.id,
          type: 'deposit',
          amount: numAmount,
          method,
          reference,
          status: 'completed',
          balance_after: newBalance,
        });

        // ৩. State আপডেট
        setBalance(newBalance);
        await fetchWallet();

        return { success: true, newBalance };
      } catch (err) {
        console.error('Add money error:', err);
        return { success: false, error: err.message };
      }
    },
    [user?.id, balance, fetchWallet]
  );

  // ============================================
  // ➖ Withdraw Money
  // ============================================
  const withdrawMoney = useCallback(
    async (amount, method = 'bkash', accountNumber = '') => {
      if (!user?.id) {
        return { success: false, error: 'User not logged in' };
      }

      const numAmount = Number(amount);
      if (!numAmount || numAmount <= 0) {
        return { success: false, error: 'Invalid amount' };
      }

      if (numAmount > balance) {
        return { success: false, error: 'Insufficient balance' };
      }

      try {
        const newBalance = balance - numAmount;
        await updateWallet(user.id, newBalance);

        await addTransaction({
          user_id: user.id,
          type: 'withdrawal',
          amount: numAmount,
          method,
          reference: accountNumber,
          status: 'pending',
          balance_after: newBalance,
        });

        setBalance(newBalance);
        await fetchWallet();

        return { success: true, newBalance };
      } catch (err) {
        console.error('Withdraw error:', err);
        return { success: false, error: err.message };
      }
    },
    [user?.id, balance, fetchWallet]
  );

  // ============================================
  // 🛒 Deduct for Purchase
  // ============================================
  const deductForPurchase = useCallback(
    async (amount, orderId = '') => {
      if (!user?.id) {
        return { success: false, error: 'User not logged in' };
      }

      const numAmount = Number(amount);
      if (!numAmount || numAmount <= 0) {
        return { success: false, error: 'Invalid amount' };
      }

      if (numAmount > balance) {
        return { success: false, error: 'Insufficient balance' };
      }

      try {
        const newBalance = balance - numAmount;
        await updateWallet(user.id, newBalance);

        await addTransaction({
          user_id: user.id,
          type: 'purchase',
          amount: -numAmount,
          reference: orderId,
          status: 'completed',
          balance_after: newBalance,
        });

        setBalance(newBalance);
        await fetchWallet();

        return { success: true, newBalance };
      } catch (err) {
        console.error('Purchase error:', err);
        return { success: false, error: err.message };
      }
    },
    [user?.id, balance, fetchWallet]
  );

  // ============================================
  // 🎁 Add Bonus
  // ============================================
  const addBonus = useCallback(
    async (amount, reason = 'bonus') => {
      if (!user?.id) return { success: false, error: 'User not logged in' };

      const numAmount = Number(amount);
      if (!numAmount || numAmount <= 0) {
        return { success: false, error: 'Invalid amount' };
      }

      try {
        const newBalance = balance + numAmount;
        await updateWallet(user.id, newBalance);

        await addTransaction({
          user_id: user.id,
          type: 'bonus',
          amount: numAmount,
          reference: reason,
          status: 'completed',
          balance_after: newBalance,
        });

        setBalance(newBalance);
        await fetchWallet();

        return { success: true, newBalance };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [user?.id, balance, fetchWallet]
  );

  // ============================================
  // 📊 Computed
  // ============================================
  const totalDeposited = transactions
    .filter((t) => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalSpent = transactions
    .filter((t) => t.type === 'purchase')
    .reduce((sum, t) => sum + Math.abs(Number(t.amount || 0)), 0);

  const totalBonus = transactions
    .filter((t) => t.type === 'bonus')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  // ============================================
  // 🎁 Return
  // ============================================
  return {
    // State
    balance,
    transactions,
    loading,
    error,

    // Actions
    addMoney,
    withdrawMoney,
    deductForPurchase,
    addBonus,
    refresh: fetchWallet,

    // Computed
    totalDeposited,
    totalSpent,
    totalBonus,
    hasBalance: balance > 0,
    formattedBalance: `৳${balance.toLocaleString('en-BD')}`,
  };
};

export default useWallet;