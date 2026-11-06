import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT, formatDateTime } from '../../utils/formatters';
import Badge from '../ui/Badge';

const TransactionItem = ({ transaction }) => {
  const { t } = useLanguage();
  const isPositive = Number(transaction.amount) > 0;
  const title = transaction.game_name || transaction.reference || (isPositive ? 'Deposit' : 'Purchase');
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
          <img src="/icon-192.png" alt="Logo" className="w-6 h-6 rounded-md object-cover" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800 dark:text-white line-clamp-1">{title}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{formatDateTime(transaction.created_at)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {isPositive ? '+' : ''}{formatBDT(transaction.amount)}
        </p>
        <Badge variant={transaction.status === 'completed' ? 'success' : transaction.status === 'pending' ? 'warning' : 'danger'} size="sm" className="mt-1">
          {t(transaction.status) || transaction.status}
        </Badge>
      </div>
    </div>
  );
};
export default TransactionItem;
