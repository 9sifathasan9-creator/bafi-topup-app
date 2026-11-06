import React from 'react';
import { Activity, Clock } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../ui/Card';
import OrderStatus from '../orders/OrderStatus';

const LiveOrderTracker = () => {
  const { orders = [] } = useOrders();
  const { t } = useLanguage();
  
  // সবচেয়ে রিসেন্ট পেন্ডিং বা প্রসেসিং অর্ডার খুঁজে বের করা
  const activeOrder = orders.find(o => o.status === 'pending' || o.status === 'processing');

  return (
    <Card variant="gaming" padding="md" className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
          <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
        </div>
        <h3 className="text-sm font-bold text-gray-800 dark:text-white">Live Order Status Tracker</h3>
      </div>
      
      {activeOrder ? (
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-800 dark:text-white">{activeOrder.game_name || 'Top-up Order'}</p>
            <p className="text-[10px] text-gray-500 font-mono mt-0.5">{activeOrder.id.split('-')[0].toUpperCase()}</p>
          </div>
          <OrderStatus status={activeOrder.status} />
        </div>
      ) : (
        <div className="text-center py-6">
          <Clock className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400">No active order right now</p>
        </div>
      )}
    </Card>
  );
};
export default LiveOrderTracker;
