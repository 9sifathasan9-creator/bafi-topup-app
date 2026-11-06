import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT } from '../../utils/formatters';
import Card from '../ui/Card';

const BalanceHistory = ({ transactions = [] }) => {
  const { t } = useLanguage();

  const stats = useMemo(() => {
    if (!transactions.length) {
      return { totalIn: 0, totalOut: 0, netChange: 0, count: 0 };
    }

    let totalIn = 0;
    let totalOut = 0;

    transactions.forEach((tx) => {
      const amt = Math.abs(Number(tx.amount || 0));
      if (Number(tx.amount) > 0) totalIn += amt;
      else totalOut += amt;
    });

    return {
      totalIn,
      totalOut,
      netChange: totalIn - totalOut,
      count: transactions.length,
    };
  }, [transactions]);

  const StatCard = ({ icon: Icon, label, value, color, bg }) => (
    <div className={`p-4 rounded-xl ${bg}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <p className={`text-xs font-medium ${color}`}>{label}</p>
      </div>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <Card variant="gaming" padding="md">
      <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        {t('balanceHistory') || 'Balance History'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          icon={TrendingUp}
          label={t('totalIn') || 'Total In'}
          value={formatBDT(stats.totalIn)}
          color="text-green-700 dark:text-green-300"
          bg="bg-green-50 dark:bg-green-900/20"
        />
        <StatCard
          icon={TrendingDown}
          label={t('totalOut') || 'Total Out'}
          value={formatBDT(stats.totalOut)}
          color="text-red-700 dark:text-red-300"
          bg="bg-red-50 dark:bg-red-900/20"
        />
        <StatCard
          icon={Activity}
          label={t('netChange') || 'Net Change'}
          value={formatBDT(stats.netChange)}
          color={stats.netChange >= 0 ? 'text-purple-700 dark:text-purple-300' : 'text-orange-700 dark:text-orange-300'}
          bg="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
        {t('basedOn') || 'Based on'} {stats.count} {t('transactions') || 'transactions'}
      </p>
    </Card>
  );
};

export default BalanceHistory;
