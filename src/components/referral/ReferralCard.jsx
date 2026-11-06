import React from 'react';
import { Gift, Users, TrendingUp, Copy, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { formatBDT } from '../../utils/formatters';
import { REFERRAL } from '../../utils/constants';
import Card from '../ui/Card';

const ReferralCard = ({ referralCode, totalEarnings = 0, totalReferrals = 0 }) => {
  const { t } = useLanguage();
  const { notifySuccess } = useNotifications();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!referralCode) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      notifySuccess(t('referralCodeCopied') || 'Referral code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card variant="gaming" padding="lg">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            {t('referEarn') || 'Refer & Earn'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('referDesc') || `Get ৳${REFERRAL.BONUS_AMOUNT} per referral`}
          </p>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl mb-5">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          {t('yourReferralCode') || 'Your Referral Code'}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-pink-300 dark:border-pink-700">
            <p className="font-mono text-xl font-bold text-pink-600 dark:text-pink-400 text-center tracking-wider">
              {referralCode || '--------'}
            </p>
          </div>
          <button
            onClick={handleCopy}
            disabled={!referralCode}
            className="p-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50"
            aria-label="Copy"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            <p className="text-xs font-medium text-green-700 dark:text-green-300">
              {t('totalEarnings') || 'Total Earnings'}
            </p>
          </div>
          <p className="text-xl font-bold text-green-800 dark:text-green-200">
            {formatBDT(totalEarnings)}
          </p>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
              {t('invitedFriends') || 'Invited Friends'}
            </p>
          </div>
          <p className="text-xl font-bold text-blue-800 dark:text-blue-200">
            {totalReferrals}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ReferralCard;
