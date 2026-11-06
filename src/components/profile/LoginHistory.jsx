import React from 'react';
import { Monitor, Smartphone, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatRelativeTime } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const LoginHistory = ({ history = [] }) => {
  const { t } = useLanguage();

  if (!history || history.length === 0) {
    return (
      <EmptyState
        icon={Monitor}
        title={t('noLoginHistory') || 'No login history'}
        description={t('noLoginHistoryDesc') || 'Your login activity will appear here'}
      />
    );
  }

  const getDeviceIcon = (device) => {
    const d = (device || '').toLowerCase();
    if (d.includes('mobile') || d.includes('android') || d.includes('ios')) return Smartphone;
    return Monitor;
  };

  return (
    <div className="space-y-3">
      {history.map((item) => {
        const DeviceIcon = getDeviceIcon(item.device);
        return (
          <Card key={item.id} variant="gaming" padding="md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <DeviceIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {item.device || 'Unknown Device'}
                  </p>
                  {item.current && (
                    <Badge variant="success" size="sm" dot>
                      {t('current') || 'Current'}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.location || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(item.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default LoginHistory;
