import React, { useState, useEffect } from 'react';
import { Send, DollarSign, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { MONEY } from '../../utils/constants';
import { supabase } from '../../supabaseClient';
import Input from '../ui/Input';
import Button from '../ui/Button';
import PaymentMethods from '../payment/PaymentMethods';
import VerifyPinModal from '../common/VerifyPinModal';

const WithdrawMoney = ({ balance = 0, onWithdrawRequest, loading = false }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { notifyError } = useNotifications();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bkash');
  const [accountNumber, setAccountNumber] = useState('');
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    const loadSaved = async () => {
      const { data } = await supabase.from('profiles').select('saved_bkash, saved_nagad').eq('id', user?.id).single();
      if (data) setAccountNumber(method === 'bkash' ? data.saved_bkash : data.saved_nagad || '');
    };
    loadSaved();
  }, [method, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num < MONEY.MIN_WITHDRAWAL) { notifyError(`Min: ৳${MONEY.MIN_WITHDRAWAL}`); return; }
    if (num > balance) { notifyError(t('insufficientBalance') || 'Insufficient balance'); return; }
    if (!accountNumber.trim()) { notifyError(t('accountNumberRequired') || 'Account number required'); return; }
    setShowPin(true);
  };

  const executeWithdraw = async () => {
    setShowPin(false);
    const updateData = method === 'bkash' ? { saved_bkash: accountNumber } : { saved_nagad: accountNumber };
    await supabase.from('profiles').update(updateData).eq('id', user?.id);
    onWithdrawRequest({ amount: Number(amount), method, accountNumber: accountNumber.trim() });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"><p className="text-xs text-purple-700 dark:text-purple-300">Available: <strong>৳{balance.toLocaleString()}</strong></p></div>
        <Input type="number" label="Amount" leftIcon={DollarSign} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" required min={MONEY.MIN_WITHDRAWAL} max={balance} />
        <PaymentMethods selected={method} onSelect={setMethod} />
        <Input label="Account Number" leftIcon={Phone} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="01XXXXXXXXX" required />
        <Button type="submit" variant="primary" leftIcon={Send} loading={loading} disabled={!amount || Number(amount) > balance} fullWidth>{t('withdraw') || 'Request Withdrawal'}</Button>
        <p className="text-xs text-center text-gray-500">Note: Withdrawals require Admin approval.</p>
      </form>
      <VerifyPinModal isOpen={showPin} onClose={() => setShowPin(false)} onSuccess={executeWithdraw} actionText="request withdrawal" />
    </>
  );
};
export default WithdrawMoney;
