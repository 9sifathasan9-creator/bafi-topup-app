import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const OrderStatus = ({ status }) => {
  const { t } = useLanguage();
  let config = { label: t('pending') || 'Pending', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', dot: 'bg-yellow-500' };
  
  if (status?.toLowerCase() === 'completed' || status?.toLowerCase() === 'success') {
    config = { label: t('success') || 'Success', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', dot: 'bg-green-500' };
  } else if (status?.toLowerCase() === 'failed' || status?.toLowerCase() === 'cancelled') {
    config = { label: t('failed') || 'Failed', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' };
  }

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`}></span>
      {config.label}
    </div>
  );
};
export default OrderStatus;
