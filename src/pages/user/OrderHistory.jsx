import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Package } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useOrders } from '../../hooks/useOrders';
import { ROUTES } from '../../utils/constants';
import OrderCard from '../../components/orders/OrderCard';
import EmptyState from '../../components/common/EmptyState';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import Button from '../../components/ui/Button';

const OrderHistory = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { orders = [], loading } = useOrders();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(5); // পেজিনেশনের জন্য

  const filters = [
    { id: 'all', label: t('all') || 'All' },
    { id: 'completed', label: t('success') || 'Success' },
    { id: 'pending', label: t('pending') || 'Pending' },
    { id: 'failed', label: t('failed') || 'Failed' },
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      let matchesStatus = true;
      if (activeFilter !== 'all') {
        const status = order.status?.toLowerCase();
        if (activeFilter === 'completed') matchesStatus = (status === 'completed' || status === 'success');
        else if (activeFilter === 'pending') matchesStatus = (status === 'pending');
        else if (activeFilter === 'failed') matchesStatus = (status === 'failed' || status === 'cancelled');
      }

      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const orderId = order.id?.toLowerCase() || '';
        const gameName = order.game_name?.toLowerCase() || '';
        matchesSearch = orderId.includes(q) || gameName.includes(q);
      }

      return matchesStatus && matchesSearch;
    });
  }, [orders, activeFilter, searchQuery]);

  // রিসেট পেজিনেশন যখন ফিল্টার বা সার্চ পরিবর্তন হবে
  React.useEffect(() => {
    setVisibleCount(5);
  }, [activeFilter, searchQuery]);

  const displayedOrders = filteredOrders.slice(0, visibleCount);

  return (
    <div className="min-h-screen px-4 py-6 bg-[#f3f4f6] dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-6">
          <button onClick={() => navigate(ROUTES.USER_DASHBOARD)} className="text-slate-700 dark:text-white/80 hover:text-purple-600 dark:hover:text-white text-sm inline-flex items-center gap-2 font-medium mb-4">
            <ArrowLeft className="w-4 h-4" /> {t('back') || 'Back'}
          </button>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-1">{t('transactions') || 'Transactions'}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{orders.length} {t('transactions') || 'transactions'}</p>
        </div>

        {/* Search & Filter Box */}
        <div className="gaming-card p-4 rounded-2xl mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchOrder') || 'Search order ID, game...'}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0 mr-1" />
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition border ${
                  activeFilter === f.id
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                    : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Order List */}
        {loading ? (
          <SkeletonLoader variant="list" count={4} />
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            icon={Package}
            title={t('noTransactions') || 'No transactions found'}
            description={t('noTransactionsDesc') || 'Try changing your search or filter.'}
          />
        ) : (
          <div className="space-y-4">
            {displayedOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}

            {/* Load More Button */}
            {visibleCount < filteredOrders.length && (
              <div className="pt-2 text-center">
                <Button variant="secondary" onClick={() => setVisibleCount(prev => prev + 5)} className="w-full">
                  Load More Transactions
                </Button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
export default OrderHistory;
