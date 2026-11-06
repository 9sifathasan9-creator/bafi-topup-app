import React, { useState } from 'react';
import { Building2, Hash, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT } from '../../utils/formatters';
import Input from '../ui/Input';
import Button from '../ui/Button';

const BankTransfer = ({ amount, onSubmit, loading }) => {
  const { t } = useLanguage();
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [reference, setReference] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ method: 'bank', accountName, accountNumber, reference, amount });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
        <p className="text-sm font-bold text-green-800 dark:text-green-200 mb-2">
          🏦 Bank Transfer
        </p>
        <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
          <p><strong>Bank:</strong> Dutch Bangla Bank</p>
          <p><strong>Account Name:</strong> BAFI Gaming Ltd</p>
          <p><strong>Account No:</strong> 1234567890123</p>
          <p><strong>Branch:</strong> Dhaka Main</p>
          <p className="mt-2">Send <strong>{formatBDT(amount)}</strong> then fill below</p>
        </div>
      </div>

      <Input
        label={t('accountName') || 'Your Account Name'}
        leftIcon={User}
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
        placeholder="JOHN DOE"
        required
      />

      <Input
        label={t('accountNumber') || 'Your Account Number'}
        leftIcon={Building2}
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        placeholder="1234567890"
        required
      />

      <Input
        label={t('reference') || 'Reference/Note'}
        leftIcon={Hash}
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        placeholder="e.g. Payment for order"
        required
      />

      <Button type="submit" variant="primary" loading={loading} fullWidth>
        {t('submit') || 'Submit'} {formatBDT(amount)}
      </Button>
    </form>
  );
};

export default BankTransfer;
