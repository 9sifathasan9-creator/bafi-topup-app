import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useOrders } from '../../hooks/useOrders';
import { useNotifications } from '../../hooks/useNotifications';
import OrderDetails from '../../components/orders/OrderDetails';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { orders, cancelOrder } = useOrders();
  const { notifySuccess, notifyError } = useNotifications();

  const order = orders.find((o) => o.id === id);

  const handleCancel = async (orderId) => {
    if (!window.confirm(t('confirmCancel') || 'Cancel this order?')) return;
    const result = await cancelOrder(orderId);
    if (result.success) {
      notifySuccess(t('orderCancelled') || 'Order cancelled');
    } else {
      notifyError(result.error);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="gaming-card p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">{t('orderNotFound') || 'Order not found'}</p>
          <button onClick={() => navigate(-1)} className="text-purple-600 hover:underline text-sm">
            {t('back') || 'Go Back'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <OrderDetails order={order} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default OrderDetailsPage;
