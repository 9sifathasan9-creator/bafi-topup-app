import React from 'react';
import { Activity, User, Gamepad2, ShoppingCart, CreditCard, Settings } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatRelativeTime } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';
import Card from '../ui/Card';

const ActivityLog = ({ activities = [] }) => {
  const { t } = useLanguage();

  if (!activities || activities.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title={t('noActivity') || 'No activity yet'}
        description={t('noActivityDesc') || 'Activity log will appear here'}
      />
    );
  }

  const getActivityIcon = (type) => {
    const map = {
      user: User,
      game: Gamepad2,
      order: ShoppingCart,
      transaction: CreditCard,
      settings: Settings,
    };
    return map[type] || Activity;
  };

  const getActivityColor = (type) => {
    const map = {
      user: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      game: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      order: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      transaction: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      settings: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    };
    return map[type] || map.settings;
  };

  return (
    <Card variant="gaming" padding="md">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <h3 className="text-sm font-bold text-gray-800 dark:text-white">
          {t('activityLog') || 'Activity Log'}
        </h3>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 dark:text-white">
                  {activity.message || 'Activity'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {formatRelativeTime(activity.created_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ActivityLog;
