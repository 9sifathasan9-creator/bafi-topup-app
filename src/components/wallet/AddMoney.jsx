import React, { useState } from 'react';
import { Send, DollarSign, Phone, Hash } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { MONEY } from '../../utils/constants';
import Input from '../ui/Input';
import Button from '../ui/Button';
import PaymentMethods from '../payment/PaymentMethods';

// ⚠️ এখানে আপনার আসল বিকাশ/নগদ/রকেট নাম্বার বসাবেন
const ADMIN_PAYMENT_NUMBERS = {
  bkash: '017XXXXXXXX', // আপনার বিকাশ পার্সোনাল নাম্বার
  nagad: '017XXXXXXXX', // আপনার নগদ নাম্বার
  rocket: '017XXXXXXXX1', // আপনার রকেট নাম্বার
};

const AddMoney = ({ onSubmitRequest, loading = false }) => {
  const { t } = useLanguage();
  const { notifyError } = useNotifications();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num < MONEY.MIN_DEPOSIT) { notifyError(`Min: ৳${MONEY.MIN_DEPOSIT}`); return; }
    if (!senderNumber.trim() || !trxId.trim()) { notifyError('Sender number and TrxID are required'); return; }
    onSubmitRequest({ amount: num, method, senderNumber: senderNumber.trim(), trxId: trxId.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
        <p className="text-xs text-purple-700 dark:text-purple-300 font-bold mb-1">Send Money To:</p>
        <p className="text-xl font-black text-purple-800 dark:text-white font-mono tracking-wider">{ADMIN_PAYMENT_NUMBERS[method]}</p>
        <p className="text-[10px] text-purple-600 dark:text-purple-400 mt-1">(bKash/Nagad/Rocket Personal)</p>
      </div>

      <Input type="number" label="Amount (BDT)" leftIcon={DollarSign} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 500" required min={MONEY.MIN_DEPOSIT} />
      
      <PaymentMethods selected={method} onSelect={setMethod} />
      
      <Input label="Sender Number" leftIcon={Phone} value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)} placeholder="01XXXXXXXXX" required />
      
      <Input label="Transaction ID (TrxID)" leftIcon={Hash} value={trxId} onChange={(e) => setTrxId(e.target.value.toUpperCase())} placeholder="e.g. 8N7A2B3C4D" required />

      <Button type="submit" variant="primary" leftIcon={Send} loading={loading} fullWidth>Submit Request</Button>
      <p className="text-xs text-center text-gray-500">Your balance will be updated after admin verification.</p>
    </form>
  );
};

export default AddMoney;
