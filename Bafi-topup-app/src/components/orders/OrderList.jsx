import React from 'react';
import { Package } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import EmptyState from '../common/EmptyState';
import SkeletonLoader from '../common/SkeletonLoader';
import OrderCard from './OrderCard';

const OrderList = ({ orders = [], loading = false, emptyMessage, onOrderClick }) => {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="space-y-3">
        <SkeletonLoader variant="list" count={3} />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title={emptyMessage || t('noOrders') || 'No orders yet'}
        description={t('noOrdersDesc') || 'Your order history will appear here'}
      />
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onClick={onOrderClick ? () => onOrderClick(order) : undefined} />
      ))}
    </div>
  );
};

export default OrderList;
