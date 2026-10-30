import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import ReferralCard from '../../components/referral/ReferralCard';
import ReferralLink from '../../components/referral/ReferralLink';
import ReferralStats from '../../components/referral/ReferralStats';
import ReferralList from '../../components/referral/ReferralList';

const ReferralPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const referralCode = user?.id ? user.id.slice(0, 8).toUpperCase() : '';

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-5">
        <button onClick={() => navigate(ROUTES.USER_DASHBOARD)} className="text-white/80 hover:text-white text-sm inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> {t('back') || 'Back'}
        </button>

        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6" /> {t('referEarn') || 'Refer & Earn'}
        </h1>

        <ReferralCard
          referralCode={referralCode}
          totalEarnings={0}
          totalReferrals={0}
        />

        <ReferralLink referralCode={referralCode} />

        <ReferralStats />

        <ReferralList referrals={[]} loading={false} />
      </div>
    </div>
  );
};

export default ReferralPage;
