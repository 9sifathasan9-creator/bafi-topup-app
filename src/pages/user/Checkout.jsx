import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useWallet } from '../../hooks/useWallet';
import { useNotifications } from '../../hooks/useNotifications';
import { useOrders } from '../../hooks/useOrders';
import { supabase } from '../../supabaseClient';
import { formatBDT } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import VerifyPinModal from '../../components/common/VerifyPinModal';
import StepIndicator from '../../components/common/StepIndicator';

const Checkout = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { balance, deductForPurchase, refresh: refreshWallet } = useWallet();
  const { notifySuccess, notifyError } = useNotifications();
  
  const [processing, setProcessing] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [playerId, setPlayerId] = useState('');

  const { gameId, packageData } = location.state || {};

  useEffect(() => {
    if (!gameId || !packageData) {
      navigate('/games');
    }
  }, [gameId, packageData, navigate]);

  const handlePlaceOrder = () => {
    if (!playerId.trim()) { notifyError('Please enter your Player ID'); return; }
    if (balance < packageData.price) { notifyError('Insufficient wallet balance'); return; }
    setShowPin(true);
  };

  const executeOrder = async () => {
    setShowPin(false);
    setProcessing(true);
    
    await new Promise(r => setTimeout(r, 1500));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // সরাসরি Supabase-এ অর্ডার তৈরি (এরর ট্র্যাকিং সহ)
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          game_id: gameId,
          game_name: packageData.name,
          player_id: playerId.trim(),
          amount: packageData.price,
          quantity: 1,
          payment_method: 'wallet',
          status: 'pending',
          notes: packageData.name
        })
        .select()
        .single();

      if (orderError) {
        throw new Error(`Order Error: ${orderError.message}`);
      }

      // ব্যালেন্স কাটা
      const deductResult = await deductForPurchase(packageData.price, orderData.id);
      if (!deductResult.success) {
        throw new Error(`Balance Error: ${deductResult.error}`);
      }

      await refreshWallet();
      notifySuccess('Order placed successfully! Pending admin approval.');
      navigate(ROUTES.ORDERS);

    } catch (err) {
      console.error('Checkout Error:', err);
      notifyError(err.message || 'Failed to create order');
    } finally {
      setProcessing(false);
    }
  };

  if (!packageData) return null;

  return (
    <div className="min-h-screen px-4 py-6 bg-[#f3f4f6] dark:bg-gray-900">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => navigate(-1)} className="text-slate-700 dark:text-white/80 hover:text-purple-600 text-sm inline-flex items-center gap-2 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <StepIndicator currentStep={4} />
        </div>

        <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-5">Payment</h1>

        <Card variant="gaming" padding="md" className="mb-4">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Player ID / UID</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={playerId} onChange={(e) => setPlayerId(e.target.value)} placeholder="Enter your game ID" className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm text-gray-800 dark:text-white" />
          </div>
        </Card>

        <Card variant="gaming" padding="md" className="mb-4">
          <h3 className="text-sm font-bold mb-3">Order Summary</h3>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">{packageData.name}</span>
            <span className="font-bold text-purple-600">{formatBDT(packageData.price)}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="font-bold">Total</span>
            <span className="text-xl font-black text-purple-600">{formatBDT(packageData.price)}</span>
          </div>
        </Card>

        <Card variant="gaming" padding="md" className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer p-3 border border-purple-500/30 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm font-bold">Pay from Wallet</p>
              <p className="text-xs text-purple-600">Available: {formatBDT(balance)}</p>
            </div>
          </label>
        </Card>

        <Button variant="primary" size="lg" onClick={handlePlaceOrder} loading={processing} disabled={balance < packageData.price || !playerId} fullWidth>
          {processing ? 'Processing...' : 'Continue to Pay'}
        </Button>
      </div>

      <VerifyPinModal isOpen={showPin} onClose={() => setShowPin(false)} onSuccess={executeOrder} actionText="complete payment" />
    </div>
  );
};
export default Checkout;
