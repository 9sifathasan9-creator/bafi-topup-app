import React from 'react';
import { CreditCard } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT, formatDateTime } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const PaymentHistory = ({ payments = [] }) => {
  const { t } = useLanguage();

  if (!payments || payments.length === 0) {
    return (
      <EmptyState
        icon={CreditCard}
        title={t('noPaymentHistory') || 'No payment history'}
        description={t('noPaymentHistoryDesc') || 'Your payments will appear here'}
      />
    );
  }

  const getStatusVariant = (status) => {
    const map = {
      completed: 'success',
      pending: 'warning',
      failed: 'danger',
    };
    return map[status] || 'default';
  };

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <Card key={payment.id} variant="gaming" padding="md">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 dark:text-white capitalize">
                  {payment.method || 'Payment'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {formatDateTime(payment.created_at)}
                </p>
                {payment.transaction_id && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                    TXN: {payment.transaction_id}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-base font-bold text-purple-600 dark:text-purple-400">
                {formatBDT(payment.amount)}
              </p>
              <Badge variant={getStatusVariant(payment.status)} size="sm" dot>
                {t(payment.status) || payment.status}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PaymentHistory;
