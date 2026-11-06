import React from 'react';
import { CheckCircle, Clock, Package, Truck, Home } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../ui/Card';

const OrderTracking = ({ status }) => {
  const { t } = useLanguage();

  const steps = [
    { id: 'pending', label: t('orderPlaced') || 'Order Placed', icon: CheckCircle },
    { id: 'processing', label: t('processing') || 'Processing', icon: Clock },
    { id: 'packaged', label: t('packaged') || 'Ready', icon: Package },
    { id: 'completed', label: t('completed') || 'Completed', icon: Home },
  ];

  const statusOrder = { pending: 0, processing: 1, packaged: 2, completed: 3 };
  const currentIndex = statusOrder[status?.toLowerCase()] ?? 0;

  return (
    <Card variant="gaming" padding="md">
      <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4">
        {t('orderTracking') || 'Order Tracking'}
      </h3>
      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.id} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition ${
                isCompleted ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
              } ${isCurrent ? 'ring-4 ring-purple-500/20' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${isCompleted ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                  {step.label}
                </p>
              </div>
              {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default OrderTracking;
