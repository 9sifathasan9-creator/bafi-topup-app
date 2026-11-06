import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Gamepad2, User, Calendar, CreditCard, Hash } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT, formatDateTime, formatOrderId } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import Card from '../ui/Card';
import Button from '../ui/Button';
import OrderStatus from './OrderStatus';

const OrderDetails = ({ order, onCancel }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  if (!order) return null;

  const canCancel = order.status === 'pending';

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-white break-words">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <button onClick={() => navigate(ROUTES.ORDERS)} className="inline-flex items-center gap-2 text-white/80 hover:text-white transition text-sm">
        <ArrowLeft className="w-4 h-4" />
        {t('back') || 'Back'}
      </button>

      <Card variant="gaming" padding="lg">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Gamepad2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">{order.game_name || 'Game Order'}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                <Hash className="w-3 h-3" />
                {formatOrderId(order.id)}
              </p>
            </div>
          </div>
          <OrderStatus status={order.status} size="md" />
        </div>

        <div className="space-y-1">
          <InfoRow icon={Hash} label={t('orderId') || 'Order ID'} value={formatOrderId(order.id)} />
          <InfoRow icon={User} label={t('playerId') || 'Player ID'} value={order.player_id} />
          {order.server_id && <InfoRow icon={Hash} label={t('serverId') || 'Server ID'} value={order.server_id} />}
          <InfoRow icon={Calendar} label={t('orderDate') || 'Order Date'} value={formatDateTime(order.created_at)} />
          <InfoRow icon={CreditCard} label={t('paymentMethod') || 'Payment Method'} value={order.payment_method} />
          <InfoRow icon={Package} label={t('quantity') || 'Quantity'} value={order.quantity || 1} />
        </div>

        <div className="mt-5 pt-5 border-t-2 border-dashed border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('total') || 'Total'}</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {formatBDT(order.amount)}
            </p>
          </div>
        </div>

        {order.notes && (
          <div className="mt-5 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-lg">
            <p className="text-xs text-yellow-700 dark:text-yellow-200">{order.notes}</p>
          </div>
        )}

        {canCancel && onCancel && (
          <div className="mt-5">
            <Button variant="danger" onClick={() => onCancel(order.id)} fullWidth>
              {t('cancelOrder') || 'Cancel Order'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OrderDetails;
