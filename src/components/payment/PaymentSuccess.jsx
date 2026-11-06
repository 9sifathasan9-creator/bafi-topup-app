import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Package } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT, formatOrderId } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import Card from '../ui/Card';
import Button from '../ui/Button';

const PaymentSuccess = ({ orderId, amount, onViewOrder }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Card variant="gaming" padding="lg" className="text-center">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5 animate-pulse">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        {t('paymentSuccess') || 'Payment Successful!'}
      </h2>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
        {t('paymentSuccessDesc') || 'Your order has been placed successfully'}
      </p>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 space-y-2">
        {orderId && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t('orderId') || 'Order ID'}:
            </span>
            <span className="font-bold text-gray-800 dark:text-white">
              {formatOrderId(orderId)}
            </span>
          </div>
        )}
        {amount && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t('amount') || 'Amount'}:
            </span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {formatBDT(amount)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          leftIcon={Package}
          onClick={() => onViewOrder ? onViewOrder() : navigate(ROUTES.ORDERS)}
          fullWidth
        >
          {t('viewOrder') || 'View Order'}
        </Button>
        <Button
          variant="secondary"
          leftIcon={Home}
          onClick={() => navigate(ROUTES.HOME)}
          fullWidth
        >
          {t('goHome') || 'Go Home'}
        </Button>
      </div>
    </Card>
  );
};

export default PaymentSuccess;
