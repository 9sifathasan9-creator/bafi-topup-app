import React from 'react';
import { Users, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT, formatRelativeTime, formatInitials } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';
import SkeletonLoader from '../common/SkeletonLoader';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const ReferralList = ({ referrals = [], loading = false }) => {
  const { t } = useLanguage();

  if (loading) {
    return (
      <Card variant="gaming" padding="md">
        <SkeletonLoader variant="list" count={3} />
      </Card>
    );
  }

  if (!referrals || referrals.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={t('noReferrals') || 'No referrals yet'}
        description={t('noReferralsDesc') || 'Share your code to start earning'}
      />
    );
  }

  const getStatusConfig = (status) => {
    const map = {
      completed: { variant: 'success', icon: CheckCircle, label: t('completed') || 'Completed' },
      pending: { variant: 'warning', icon: Clock, label: t('pending') || 'Pending' },
    };
    return map[status] || map.pending;
  };

  return (
    <Card variant="gaming" padding="md">
      <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4">
        {t('invitedFriends') || 'Invited Friends'} ({referrals.length})
      </h3>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {referrals.map((ref) => {
          const statusConfig = getStatusConfig(ref.status);
          const StatusIcon = statusConfig.icon;
          const name = ref.referred_user_name || ref.referred_email?.split('@')[0] || 'User';

          return (
            <div key={ref.id} className="flex items-center gap-3 py-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {formatInitials(name) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                  {name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatRelativeTime(ref.created_at)}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                  +{formatBDT(ref.bonus_amount || 50)}
                </p>
                <Badge variant={statusConfig.variant} size="sm">
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ReferralList;
