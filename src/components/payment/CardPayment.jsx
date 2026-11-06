import React, { useState } from 'react';
import { CreditCard, Lock, User, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT } from '../../utils/formatters';
import Input from '../ui/Input';
import Button from '../ui/Button';

const CardPayment = ({ amount, onSubmit, loading }) => {
  const { t } = useLanguage();
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ method: 'card', cardNumber, cardName, expiry, cvv, amount });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
        <p className="text-sm font-bold text-blue-800 dark:text-blue-200 mb-1">
          💳 Card Payment
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Secure payment via Visa/Mastercard
        </p>
      </div>

      <Input
        label={t('cardNumber') || 'Card Number'}
        leftIcon={CreditCard}
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
        placeholder="1234 5678 9012 3456"
        required
      />

      <Input
        label={t('cardName') || 'Cardholder Name'}
        leftIcon={User}
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        placeholder="JOHN DOE"
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label={t('expiry') || 'Expiry'}
          leftIcon={Calendar}
          value={expiry}
          onChange={(e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
            setExpiry(v);
          }}
          placeholder="MM/YY"
          maxLength={5}
          required
        />
        <Input
          label="CVV"
          type="password"
          leftIcon={Lock}
          value={cvv}
          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="123"
          maxLength={4}
          required
        />
      </div>

      <Button type="submit" variant="primary" loading={loading} fullWidth>
        {t('payNow') || 'Pay'} {formatBDT(amount)}
      </Button>
    </form>
  );
};

export default CardPayment;
