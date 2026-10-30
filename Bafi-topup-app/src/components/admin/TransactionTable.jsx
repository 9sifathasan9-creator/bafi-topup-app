import React from 'react';
import { Plus, Minus, RotateCcw, Gift } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT, formatDate } from '../../utils/formatters';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const TransactionTable = ({ transactions = [] }) => {
  const { t } = useLanguage();

  const getTypeConfig = (type) => {
    const map = {
      deposit: { icon: Plus, color: 'text-green-600' },
      withdrawal: { icon: Minus, color: 'text-red-600' },
      purchase: { icon: Minus, color: 'text-blue-600' },
      refund: { icon: RotateCcw, color: 'text-orange-600' },
      bonus: { icon: Gift, color: 'text-purple-600' },
    };
    return map[type] || map.deposit;
  };

  const getStatusVariant = (status) => {
    const map = { completed: 'success', pending: 'warning', failed: 'danger' };
    return map[status] || 'default';
  };

  return (
    <Card variant="gaming" padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('user') || 'User'}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('type') || 'Type'}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('amount') || 'Amount'}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('status') || 'Status'}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('date') || 'Date'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {transactions.map((tx) => {
              const config = getTypeConfig(tx.type);
              const Icon = config.icon;
              return (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 truncate max-w-[180px]">{tx.user_email || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${config.color}`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{tx.type}</span>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm font-bold ${Number(tx.amount) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Number(tx.amount) > 0 ? '+' : ''}{formatBDT(tx.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getStatusVariant(tx.status)} size="sm">{tx.status || 'pending'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{formatDate(tx.created_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
            {t('noTransactions') || 'No transactions found'}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TransactionTable;
