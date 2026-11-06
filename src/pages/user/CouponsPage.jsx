import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../utils/constants';
import CouponList from '../../components/coupons/CouponList';

const CouponsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { notifySuccess } = useNotifications();

  const sampleCoupons = [
    { id: '1', code: 'WELCOME10', title: 'Welcome Bonus', description: 'Get 10% off on your first order', discount_type: 'percentage', discount_value: 10, active: true, min_purchase: 100 },
    { id: '2', code: 'SAVE50', title: 'Save ৳50', description: 'Flat ৳50 discount on orders above ৳500', discount_type: 'fixed', discount_value: 50, active: true, min_purchase: 500 },
    { id: '3', code: 'GAMER20', title: 'Gamer Special', description: 'Get 20% off on gaming top-ups', discount_type: 'percentage', discount_value: 20, active: true },
  ];

  const handleApply = (coupon) => {
    notifySuccess(`${coupon.code} ${t('applied') || 'applied!'}`);
    navigate(ROUTES.GAMES);
  };

  const handleCopy = () => {
    notifySuccess(t('couponCopied') || 'Coupon copied!');
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-5">
        <button onClick={() => navigate(ROUTES.USER_DASHBOARD)} className="text-white/80 hover:text-white text-sm inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> {t('back') || 'Back'}
        </button>

        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Ticket className="w-6 h-6" /> {t('coupons') || 'Coupons'}
        </h1>

        <CouponList coupons={sampleCoupons} onApply={handleApply} onCopy={handleCopy} />
      </div>
    </div>
  );
};

export default CouponsPage;
