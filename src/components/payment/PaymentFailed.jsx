import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, Home } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ROUTES } from '../../utils/constants';
import Card from '../ui/Card';
import Button from '../ui/Button';

const PaymentFailed = ({ reason, onRetry }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Card variant="gaming" padding="lg" className="text-center">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
        <XCircle className="w-10 h-10 text-red-500" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        {t('paymentFailed') || 'Payment Failed'}
      </h2>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
        {reason || t('paymentFailedDesc') || 'Something went wrong. Please try again.'}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          leftIcon={RefreshCw}
          onClick={() => onRetry ? onRetry() : navigate(-1)}
          fullWidth
        >
          {t('tryAgain') || 'Try Again'}
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

export default PaymentFailed;
