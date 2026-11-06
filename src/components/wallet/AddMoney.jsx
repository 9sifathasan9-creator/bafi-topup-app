import React, { useState } from 'react';
import { Plus, DollarSign } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { MONEY } from '../../utils/constants';
import Input from '../ui/Input';
import Button from '../ui/Button';
import PaymentMethods from '../payment/PaymentMethods';

const AddMoney = ({ onAdd, loading = false }) => {
  const { t } = useLanguage();
  const { notifyError } = useNotifications();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bkash');

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num < MONEY.MIN_DEPOSIT) { notifyError(`Min: ৳${MONEY.MIN_DEPOSIT}`); return; }
    if (num > MONEY.MAX_DEPOSIT) { notifyError(`Max: ৳${MONEY.MAX_DEPOSIT}`); return; }
    onAdd({ amount: num, method });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input type="number" label="Amount" leftIcon={DollarSign} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" required min={MONEY.MIN_DEPOSIT} max={MONEY.MAX_DEPOSIT} />
      <PaymentMethods selected={method} onSelect={setMethod} />
      <Button type="submit" variant="primary" leftIcon={Plus} loading={loading} disabled={!amount || Number(amount) < MONEY.MIN_DEPOSIT} fullWidth>Add Money</Button>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400">Min: ৳{MONEY.MIN_DEPOSIT} • Max: ৳{MONEY.MAX_DEPOSIT}</p>
    </form>
  );
};
export default AddMoney;
