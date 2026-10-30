import React, { useState } from 'react';
import { Phone, Hash } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT } from '../../utils/formatters';
import Input from '../ui/Input';
import Button from '../ui/Button';

const NagadPayment = ({ amount, onSubmit, loading }) => {
  const { t } = useLanguage();
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ method: 'nagad', senderNumber, transactionId, amount });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
        <p className="text-sm font-bold text-orange-800 dark:text-orange-200 mb-1">
          🟠 Nagad Payment
        </p>
        <p className="text-xs text-orange-700 dark:text-orange-300">
          Send {formatBDT(amount)} to: <strong>01712345678</strong>
        </p>
      </div>

      <Input
        label={t('senderNumber') || 'Your Nagad Number'}
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

export default NagadPayment;
