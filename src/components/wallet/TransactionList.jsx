import React, { useState } from 'react';
import { Receipt, Filter } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import EmptyState from '../common/EmptyState';
import SkeletonLoader from '../common/SkeletonLoader';
import TransactionItem from './TransactionItem';
import Button from '../ui/Button';

const TransactionList = ({ transactions = [], loading = false }) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(5);

  if (loading) return <SkeletonLoader variant="list" count={4} />;

  const filteredTx = transactions.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'deposit') return tx.type === 'deposit';
    if (filter === 'purchase') return tx.type === 'purchase';
    if (filter === 'withdrawal') return tx.type === 'withdrawal';
    return true;
  });
  const visibleTx = filteredTx.slice(0, visibleCount);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        {['all', 'deposit', 'purchase', 'withdrawal'].map(f => (
          <button key={f} onClick={() => { setFilter(f); setVisibleCount(5); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${filter === f ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
            {t(f) || f.toUpperCase()}
          </button>
        ))}
      </div>
      {filteredTx.length === 0 ? (
        <EmptyState icon={Receipt} title={t('noTransactions') || 'No transactions found'} description="Try changing the filter." />
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">{visibleTx.map((tx) => <TransactionItem key={tx.id} transaction={tx} />)}</div>
      )}
      {visibleCount < filteredTx.length && (
        <Button variant="secondary" size="sm" onClick={() => setVisibleCount(prev => prev + 5)} className="w-full mt-4">Load More</Button>
      )}
    </div>
  );
};
export default TransactionList;
