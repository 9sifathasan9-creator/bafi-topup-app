import React, { useState, useMemo, useEffect } from 'react';
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
  const { orders = [], loading, refresh } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(5);

  // ৫ সেকেন্ড পর পর অর্ডার আপডেট চেক করবে
  useEffect(() => {
    const interval = setInterval(() => {
      if (refresh) refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

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
        else if (activeFilter === 'pending') matchesStatus = (status === 'pending' || status === 'processing');
        else if (activeFilter === 'failed') matchesStatus = (status === 'failed' || status === 'cancelled');
      }
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        matchesSearch = (order.id?.toLowerCase().includes(q) || order.game_name?.toLowerCase().includes(q));
      }
      return matchesStatus && matchesSearch;
    });
  }, [orders, activeFilter, searchQuery]);

  const displayedOrders = filteredOrders.slice(0, visibleCount);

  return (
    <div className="min-h-screen px-4 py-6 bg-[#f3f4f6] dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <button onClick={() => navigate(ROUTES.USER_DASHBOARD)} className="text-slate-700 dark:text-white/80 hover:text-purple-600 text-sm inline-flex items-center gap-2 font-medium mb-2">
              <ArrowLeft className="w-4 h-4" /> {t('back') || 'Back'}
            </button>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white">{t('transactions') || 'Transactions'}</h1>
            <p className="text-sm text-slate-500">{orders.length} {t('transactions') || 'transactions'}</p>
          </div>
          <button onClick={() => refresh && refresh()} className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 transition">
             <Package className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="gaming-card p-4 rounded-2xl mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search order ID..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0 mr-1" />
            {filters.map((f) => (
              <button key={f.id} onClick={() => setActiveFilter(f.id)} className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition border ${activeFilter === f.id ? 'bg-purple-600 text-white border-purple-600' : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? <SkeletonLoader variant="list" count={4} /> : filteredOrders.length === 0 ? (
          <EmptyState icon={Package} title={t('noTransactions') || 'No transactions found'} />
        ) : (
          <div className="space-y-4">
            {displayedOrders.map((order) => <OrderCard key={order.id} order={order} />)}
            {visibleCount < filteredOrders.length && (
              <Button variant="secondary" onClick={() => setVisibleCount(prev => prev + 5)} className="w-full mt-2">Load More</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default OrderHistory;
