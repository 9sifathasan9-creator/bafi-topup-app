import React from 'react';
import { Users, TrendingUp, Award, Target } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT } from '../../utils/formatters';
import { REFERRAL } from '../../utils/constants';
import Card from '../ui/Card';

const ReferralStats = ({ totalReferrals = 0, totalEarnings = 0, pendingEarnings = 0 }) => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Users,
      label: t('totalReferrals') || 'Total Referrals',
      value: totalReferrals,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: TrendingUp,
      label: t('totalEarnings') || 'Total Earnings',
      value: formatBDT(totalEarnings),
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: Award,
      label: t('pending') || 'Pending',
      value: formatBDT(pendingEarnings),
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      icon: Target,
      label: t('perReferral') || 'Per Referral',
      value: formatBDT(REFERRAL.BONUS_AMOUNT),
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <Card variant="gaming" padding="md">
      <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4">
        {t('referralStats') || 'Referral Stats'}
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`p-3 rounded-xl ${stat.bg}`}>
              <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className={`text-xs font-medium ${stat.color} mb-1`}>{stat.label}</p>
              <p className={`text-base font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ReferralStats;
