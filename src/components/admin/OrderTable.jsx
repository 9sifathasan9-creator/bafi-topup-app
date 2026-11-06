import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT, formatDate, formatOrderId } from '../../utils/formatters';
import OrderStatus from '../orders/OrderStatus';
import Card from '../ui/Card';

const OrderTable = ({ orders = [], onView, onDelete }) => {
  const { t } = useLanguage();

  return (
    <Card variant="gaming" padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('orderId') || 'Order ID'}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('game') || 'Game'}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('amount') || 'Amount'}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('status') || 'Status'}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('date') || 'Date'}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{t('actions') || 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <td className="px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300">{formatOrderId(order.id)}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-white truncate max-w-[150px]">{order.game_name || '—'}</td>
                <td className="px-4 py-3 text-sm font-bold text-purple-600 dark:text-purple-400">{formatBDT(order.amount)}</td>
                <td className="px-4 py-3"><OrderStatus status={order.status} size="sm" showIcon={false} /></td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{formatDate(order.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {onView && (
                      <button onClick={() => onView(order)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(order.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
            {t('noOrders') || 'No orders found'}
          </div>
        )}
      </div>
    </Card>
  );
};

export default OrderTable;
