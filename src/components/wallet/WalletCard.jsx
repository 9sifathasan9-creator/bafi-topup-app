import React from 'react';
import { Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { formatBDT } from '../../utils/formatters';
import Card from '../ui/Card';

const WalletCard = ({ balance = 0, ordersCount = 0, totalSpent = 0, onRecharge }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Player';

  return (
    <div className="space-y-4">
      <Card variant="gaming" padding="none" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/90 to-slate-900/90 dark:from-purple-900/40 dark:to-gray-900 border border-purple-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="p-5 relative z-10">
          <p className="text-xs font-bold text-purple-300 dark:text-purple-400 uppercase tracking-widest mb-1">{t('availableBalance') || 'Available Balance'}</p>
          <div className="flex items-baseline gap-2 mb-6">
            <h2 className="text-5xl font-black text-white tracking-tight">{balance.toFixed(2)}</h2>
            <span className="text-sm font-bold text-purple-400">BDT</span>
          </div>
          <div className="flex items-center justify-between mt-8">
            <div>
              <p className="text-sm font-bold text-white mb-1">{userName}</p>
              <p className="text-[10px] text-gray-400">ID: {user?.id?.slice(0, 8)}</p>
            </div>
            <button onClick={onRecharge} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold rounded-xl hover:shadow-lg shadow-purple-500/30 transition active:scale-95">
              <img src="/icon-192.png" alt="Logo" className="w-5 h-5 rounded-md object-cover" />
              <Plus className="w-4 h-4 -ml-1" />
              {t('rechargeNow') || 'Recharge Now'}
            </button>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-3 gap-3">
        <Card variant="gaming" padding="sm" className="flex flex-col items-center justify-center text-center py-4 bg-white dark:bg-gray-800/80 border-gray-100 dark:border-gray-700">
          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2"><ArrowDownLeft className="w-4 h-4 text-green-600 dark:text-green-400" /></div>
          <p className="text-lg font-black text-gray-800 dark:text-white leading-none mb-1">0</p>
          <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{t('recharge') || 'Recharge'}</p>
        </Card>
        <Card variant="gaming" padding="sm" className="flex flex-col items-center justify-center text-center py-4 bg-white dark:bg-gray-800/80 border-gray-100 dark:border-gray-700">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2"><ArrowUpRight className="w-4 h-4 text-blue-600 dark:text-blue-400" /></div>
          <p className="text-lg font-black text-gray-800 dark:text-white leading-none mb-1">{ordersCount}</p>
          <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{t('orders') || 'Orders'}</p>
        </Card>
        <Card variant="gaming" padding="sm" className="flex flex-col items-center justify-center text-center py-4 bg-white dark:bg-gray-800/80 border-gray-100 dark:border-gray-700">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2"><ArrowUpRight className="w-4 h-4 text-purple-600 dark:text-purple-400" /></div>
          <p className="text-lg font-black text-gray-800 dark:text-white leading-none mb-1">{totalSpent}</p>
          <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{t('totalSpent') || 'Total Spent'}</p>
        </Card>
      </div>
    </div>
  );
};
export default WalletCard;
