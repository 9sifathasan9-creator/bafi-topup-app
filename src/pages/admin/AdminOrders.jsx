import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { getAllOrders, updateOrder } from '../../supabaseClient';
import OrderTable from '../../components/admin/OrderTable';
import ExportButton from '../../components/admin/ExportButton';
import Modal from '../../components/ui/Modal';
import OrderDetails from '../../components/orders/OrderDetails';

const AdminOrders = () => {
  const { t } = useLanguage();
  const { notifySuccess } = useNotifications();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleView = (order) => setSelected(order);

  const handleUpdateStatus = async (id, status) => {
    const result = await updateOrder(id, { status });
    if (result) {
      notifySuccess(t('orderUpdated') || 'Order updated');
      fetchOrders();
      setSelected(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('manageOrders') || 'Manage Orders'}</h1>
          <p className="text-white/70 text-sm">{orders.length} {t('orders') || 'orders'}</p>
        </div>
        <ExportButton data={orders} filename="orders" />
      </div>

      {loading ? (
        <div className="gaming-card p-8 text-center text-gray-500">{t('loading') || 'Loading...'}</div>
      ) : (
        <OrderTable orders={orders} onView={handleView} />
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={t('orderDetails') || 'Order Details'} size="lg">
        {selected && (
          <div className="space-y-4">
            <OrderDetails order={selected} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              {['pending', 'processing', 'completed', 'cancelled'].map((s) => (
                <button
                  key={s}
                  onClick={() => handleUpdateStatus(selected.id, s)}
                  className="py-2 px-3 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition capitalize"
                >
                  {t(s) || s}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;
