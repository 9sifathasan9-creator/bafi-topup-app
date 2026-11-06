import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { formatBDT } from '../../utils/formatters';

const CouponValidator = ({ coupon, subtotal, isValid, reason }) => {
  const { t } = useLanguage();

  if (!coupon) return null;

  if (!isValid) {
    return (
      <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-red-700 dark:text-red-200">
            {t('invalidCoupon') || 'Invalid coupon'}
          </p>
          {reason && (
            <p className="text-xs text-red-600 dark:text-red-300 mt-0.5">
              {reason}
            </p>
          )}
        </div>
      </div>
    );
  }

  const isPercentage = coupon.discount_type === 'percentage';
  const discount = isPercentage
    ? (subtotal * coupon.discount_value) / 100
    : Math.min(coupon.discount_value, subtotal);

  const meetsMin = !coupon.min_purchase || subtotal >= coupon.min_purchase;

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg">
        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-green-700 dark:text-green-200">
            {t('couponApplied') || 'Coupon Applied'}
          </p>
          <p className="font-mono text-xs text-green-600 dark:text-green-300 mt-0.5">
            {coupon.code}
          </p>
        </div>
        <p className="text-sm font-bold text-green-700 dark:text-green-200 flex-shrink-0">
          -{formatBDT(discount)}
        </p>
      </div>

      {!meetsMin && coupon.min_purchase && (
        <div className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-700 dark:text-yellow-200">
            {t('minPurchaseRequired') || 'Minimum purchase required'}: {formatBDT(coupon.min_purchase)}
          </p>
        </div>
      )}
    </div>
  );
};

export default CouponValidator;
