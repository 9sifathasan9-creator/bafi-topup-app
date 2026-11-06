import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, LogIn, TrendingUp, Zap, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { useWallet } from '../../hooks/useWallet';
import { formatBDT, formatDateTime } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SavedUidsManager from '../../components/profile/SavedUidsManager';
import LiveOrderTracker from '../../components/profile/LiveOrderTracker';
import OrderStatus from '../../components/orders/OrderStatus';

const UserProfile = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { orders = [] } = useOrders();
  const { totalSpent, transactions = [] } = useWallet();

  const userName = isAuthenticated 
    ? (user?.user_metadata?.full_name || user?.email?.split('@')[0]) 
    : 'Guest Player';
    
  const avatarUrl = user?.user_metadata?.avatar_url;
  
  // Member Since ফরম্যাট (যেমন: Oct 2026)
  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Oct 2026';

  // রিসেন্ট ৩টি ট্রানজেকশন নেওয়া
  const recentTransactions = transactions.slice(0, 3);
  const orderCount = orders.length;

  return (
    <div className="min-h-screen px-4 py-6 bg-[#f3f4f6] dark:bg-gray-900">
      <div className="max-w-3xl mx-auto space-y-4">
        
        <button onClick={() => navigate(ROUTES.USER_DASHBOARD)} className="text-slate-700 dark:text-white/80 hover:text-purple-600 text-sm inline-flex items-center gap-2 font-medium mb-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-4">Account</h1>

        {/* ১. Profile Card */}
        <Card variant="gaming" padding="lg" className="text-center relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="relative w-24 h-24 mx-auto mb-3">
            <div className="w-full h-full rounded-full border-4 border-purple-100 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <img src="/icon-192.png" alt="Default" className="w-12 h-12 opacity-50" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-md">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <h2 className="text-xl font-black text-gray-800 dark:text-white">{userName}</h2>
          
          {isAuthenticated ? (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold">
              <Shield className="w-3 h-3" /> Member since {memberSince}
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-3">Sign in to sync your profile</p>
              <Button variant="primary" size="sm" leftIcon={LogIn} onClick={() => navigate(ROUTES.LOGIN)}>Sign In Now</Button>
            </div>
          )}
        </Card>

        {/* ২. Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card variant="gaming" padding="md" className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-xl font-black text-gray-800 dark:text-white">{formatBDT(totalSpent)}</p>
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-1">Total Spent</p>
          </Card>
          
          <Card variant="gaming" padding="md" className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xl font-black text-gray-800 dark:text-white">{orderCount}</p>
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-1">Orders</p>
          </Card>
        </div>

        {/* ৩. Live Tracker */}
        <LiveOrderTracker />

        {/* ৪. Saved UIDs */}
        <SavedUidsManager />

        {/* ৫. Recent Transactions */}
        <Card variant="gaming" padding="md" className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-white">Transactions</h3>
            </div>
            <button onClick={() => navigate(ROUTES.ORDERS)} className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">View All</button>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-xs text-center text-gray-500 py-4">No recent transactions.</p>
            ) : (
              recentTransactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between pb-3 border-b border-gray-50 dark:border-gray-800 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <img src="/icon-192.png" alt="Logo" className="w-8 h-8 rounded-md object-cover" />
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-white font-mono">{tx.id.split('-')[0].toUpperCase()}</p>
                      <p className="text-[10px] text-gray-500">{formatDateTime(tx.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-800 dark:text-white">{formatBDT(tx.amount)}</p>
                    <OrderStatus status={tx.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

      </div>
    </div>
  );
};
export default UserProfile;
