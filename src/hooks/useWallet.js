import { useState, useEffect, useCallback } from 'react';
import { getWallet, updateWallet, getTransactions, addTransaction } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export const useWallet = () => {
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWallet = useCallback(async () => {
    if (!user?.id) return;
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
      console.error('Wallet fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchWallet();
    } else {
      setBalance(0);
      setTransactions([]);
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, fetchWallet]);

  const addMoney = async (amount, method) => {
    if (!user?.id) return { success: false, error: 'Not logged in' };
    try {
      const numAmount = Number(amount);
      const newBalance = balance + numAmount;
      
      // ১. ব্যালেন্স আপডেট
      await updateWallet(user.id, newBalance);
      
      // ২. ট্রানজেকশন রেকর্ড
      await addTransaction({
        user_id: user.id,
        type: 'deposit',
        amount: numAmount,
        method,
        status: 'completed',
        balance_after: newBalance
      });
      
      setBalance(newBalance);
      await fetchWallet(); // রিফ্রেশ
      return { success: true };
    } catch (err) {
      console.error('Add money error:', err);
      return { success: false, error: err.message };
    }
  };

  const deductForPurchase = async (amount, orderId) => {
    if (!user?.id) return { success: false, error: 'Not logged in' };
    try {
      const numAmount = Number(amount);
      if (balance < numAmount) return { success: false, error: 'Insufficient balance' };
      
      const newBalance = balance - numAmount;
      await updateWallet(user.id, newBalance);
      await addTransaction({
        user_id: user.id,
        type: 'purchase',
        amount: -numAmount,
        reference: orderId,
        status: 'completed',
        balance_after: newBalance
      });
      setBalance(newBalance);
      await fetchWallet();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    balance, transactions, loading, error,
    addMoney, deductForPurchase, refresh: fetchWallet,
    totalDeposited: transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + Number(t.amount), 0),
    totalSpent: transactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0),
    formattedBalance: `৳${balance.toLocaleString('en-BD')}`,
  };
};

export default useWallet;
