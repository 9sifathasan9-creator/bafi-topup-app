import React from 'react';
import { Ticket } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import EmptyState from '../common/EmptyState';
import SkeletonLoader from '../common/SkeletonLoader';
import CouponCard from './CouponCard';

const CouponList = ({ coupons = [], loading = false, onApply, onCopy, limit }) => {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonLoader variant="card" count={2} />
      </div>
    );
  }

  const activeCoupons = coupons.filter((c) => c.active !== false);
  const displayCoupons = limit ? activeCoupons.slice(0, limit) : activeCoupons;

  if (displayCoupons.length === 0) {
    return (
      <EmptyState
        icon={Ticket}
        title={t('noCoupons') || 'No coupons available'}
        description={t('noCouponsDesc') || 'Check back later for new offers'}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {displayCoupons.map((coupon) => (
        <CouponCard
          key={coupon.id}
          coupon={coupon}
          onApply={onApply}
          onCopy={onCopy}
        />
      ))}
    </div>
  );
};

export default CouponList;
