import React, { useState } from 'react';
import { Phone, Hash } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT } from '../../utils/formatters';
import Input from '../ui/Input';
import Button from '../ui/Button';

const BkashPayment = ({ amount, onSubmit, loading }) => {
  const { t } = useLanguage();
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ method: 'bkash', senderNumber, transactionId, amount });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border-l-4 border-pink-500">
        <p className="text-sm font-bold text-pink-800 dark:text-pink-200 mb-1">
          💗 bKash Payment
        </p>
        <p className="text-xs text-pink-700 dark:text-pink-300">
          1. Send {formatBDT(amount)} to: <strong>01712345678</strong> (Personal)
        </p>
        <p className="text-xs text-pink-700 dark:text-pink-300 mt-1">
          2. Enter your info below
        </p>
      </div>

      <Input
        label={t('senderNumber') || 'Your bKash Number'}
        leftIcon={Phone}
        value={senderNumber}
        onChange={(e) => setSenderNumber(e.target.value)}
        placeholder="01XXXXXXXXX"
        required
      />

      <Input
        label={t('transactionId') || 'Transaction ID'}
        leftIcon={Hash}
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
        placeholder="e.g. 8N7A2B3C4D"
        required
      />

      <Button type="submit" variant="primary" loading={loading} fullWidth>
        {t('payNow') || 'Pay Now'} {formatBDT(amount)}
      </Button>
    </form>
  );
};

export default BkashPayment;
