import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PAYMENT_METHODS } from '../../utils/constants';
import Card from '../ui/Card';

const PaymentMethods = ({ selected, onSelect }) => {
  const { t, language } = useLanguage();

  return (
    <Card variant="gaming" padding="md">
      <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4">
        {t('selectPayment') || 'Select Payment Method'}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PAYMENT_METHODS.filter((m) => m.enabled).map((method) => (
          <button
            key={method.id}
            onClick={() => onSelect?.(method.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition ${
              selected === method.id
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
            }`}
          >
            <span className="text-3xl">{method.icon}</span>
            <span className="text-xs font-semibold text-gray-800 dark:text-white">
              {language === 'bn' ? method.nameBn : method.name}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default PaymentMethods;
