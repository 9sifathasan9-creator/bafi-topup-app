import React from 'react';
import { Monitor, Smartphone, LogOut, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import EmptyState from '../common/EmptyState';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const ActiveSessions = ({ sessions = [], onLogout }) => {
  const { t } = useLanguage();

  if (!sessions || sessions.length === 0) {
    return (
      <EmptyState
        icon={Monitor}
        title={t('noActiveSessions') || 'No active sessions'}
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
      {sessions.map((session) => {
        const DeviceIcon = getDeviceIcon(session.device);
        return (
          <Card key={session.id} variant="gaming" padding="md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <DeviceIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    {session.device || 'Unknown Device'}
                  </p>
                  {session.current && (
                    <Badge variant="success" size="sm" dot>
                      {t('current') || 'Current'}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {session.location || 'Unknown'}
                </p>
              </div>
              {!session.current && onLogout && (
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={LogOut}
                  onClick={() => onLogout(session.id)}
                >
                  {t('logout') || 'Logout'}
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ActiveSessions;
