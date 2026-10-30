import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useWallet } from '../../hooks/useWallet';
import { useNotifications } from '../../hooks/useNotifications';
import { useOrders } from '../../hooks/useOrders';
import { formatBDT } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import VerifyPinModal from '../../components/common/VerifyPinModal';

const Checkout = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { balance, deductForPurchase, refresh: refreshWallet } = useWallet();
  const { createOrder } = useOrders();
  const { notifySuccess, notifyError } = useNotifications();
  const [processing, setProcessing] = useState(false);
  const [showPin, setShowPin] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card variant="gaming" padding="lg" className="text-center max-w-md w-full">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Cart is empty</h2>
          <Button variant="primary" onClick={() => navigate(ROUTES.GAMES)} fullWidth>Browse Games</Button>
        </Card>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    if (balance < total) { notifyError('Insufficient balance'); return; }
    setShowPin(true);
  };

  const executeOrder = async () => {
    setShowPin(false);
    setProcessing(true);
    try {
      for (const item of items) {
        const orderResult = await createOrder({ gameId: item.id, gameName: item.name, playerId: '123', amount: item.price * (item.quantity || 1), quantity: item.quantity || 1, paymentMethod: 'wallet' });
        if (orderResult.success) { await deductForPurchase(item.price * (item.quantity || 1), orderResult.order.id); }
      }
      await refreshWallet();
      clearCart();
      notifySuccess('Order placed!');
      navigate(ROUTES.ORDERS);
    } catch (err) { notifyError('Order failed'); } finally { setProcessing(false); }
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-slate-700 dark:text-white/80 text-sm inline-flex items-center gap-2 mb-5"><ArrowLeft className="w-4 h-4" /> Back</button>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-5">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <Card variant="gaming" padding="md">
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3">
                    <span className="text-3xl">{item.icon || '🎮'}</span>
                    <div className="flex-1"><p className="text-sm font-bold">{item.name}</p><p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p></div>
                    <p className="text-sm font-bold text-purple-600">{formatBDT((item.price || 0) * (item.quantity || 1))}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card variant="gaming" padding="md">
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-purple-500/30 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <input type="radio" checked readOnly className="w-5 h-5 accent-purple-600" />
                <div><p className="text-sm font-bold">Pay from Wallet</p><p className="text-xs text-purple-600">Available: {formatBDT(balance)}</p></div>
              </label>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card variant="gaming" padding="md">
              <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700 mb-4"><span className="font-bold">Total</span><span className="text-xl font-bold text-purple-600">{formatBDT(total)}</span></div>
              <Button variant="primary" size="lg" onClick={handlePlaceOrder} loading={processing} disabled={balance < total} fullWidth>Place Order</Button>
            </Card>
          </div>
        </div>
      </div>
      <VerifyPinModal isOpen={showPin} onClose={() => setShowPin(false)} onSuccess={executeOrder} actionText="place this order" />
    </div>
  );
};
export default Checkout;
