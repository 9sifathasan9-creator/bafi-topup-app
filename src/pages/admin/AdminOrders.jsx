import React, { useEffect, useState } from 'react';
import { Eye, CheckCircle, XCircle, Clock, Copy, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { supabase } from '../../supabaseClient';
import { formatBDT, formatOrderId } from '../../utils/formatters';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import TransactionDetails from '../../components/admin/TransactionDetails';

const AdminOrders = () => {
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [copiedId, setCopiedId] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) console.error(error);
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      notifySuccess(`Order status updated to ${newStatus}`);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      notifyError('Failed to update order status');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'completed' || status === 'success') return <Badge variant="success" size="sm">Success</Badge>;
    if (status === 'processing') return <Badge variant="info" size="sm">Processing</Badge>;
    if (status === 'cancelled' || status === 'failed') return <Badge variant="danger" size="sm">Failed</Badge>;
    return <Badge variant="warning" size="sm">Pending</Badge>;
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Manage Orders</h1>
        <button onClick={fetchOrders} className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition">Refresh</button>
      </div>

      {loading ? <div className="text-white text-center py-10">Loading...</div> : orders.length === 0 ? (
        <Card variant="gaming" padding="lg" className="text-center text-gray-400">No orders found.</Card>
      ) : (
        <div className="gaming-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Game</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300">{formatOrderId(order.id)}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-white truncate max-w-[120px]">{order.game_name || 'Topup'}</td>
                    <td className="px-4 py-3 text-sm font-bold text-purple-600 dark:text-purple-400">{formatBDT(order.amount)}</td>
                    <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelectedOrder(order)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Eye className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Order Details" size="md">
        {selectedOrder && (
          <div className="space-y-4">
            <TransactionDetails tx={selectedOrder} type="order" />
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-bold mb-3">Update Status:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm" leftIcon={Clock} onClick={() => handleUpdateStatus(selectedOrder.id, 'pending')}>Pending</Button>
                <Button variant="primary" size="sm" leftIcon={Clock} onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}>Processing</Button>
                <Button variant="success" size="sm" leftIcon={CheckCircle} onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}>Complete</Button>
                <Button variant="danger" size="sm" leftIcon={XCircle} onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}>Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default AdminOrders;
