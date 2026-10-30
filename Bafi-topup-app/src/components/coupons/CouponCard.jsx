import React from 'react';
import { Ticket, Copy, Check, Percent, DollarSign, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { formatBDT, formatDate } from '../../utils/formatters';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const CouponCard = ({ coupon, onApply, onCopy }) => {
  const { t } = useLanguage();
  const { notifySuccess } = useNotifications();
  const [copied, setCopied] = React.useState(false);

  if (!coupon) return null;

  const isPercentage = coupon.discount_type === 'percentage';
  const isActive = coupon.active !== false;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      notifySuccess(t('couponCopied') || 'Coupon code copied!');
      onCopy?.(coupon);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card variant="gaming" padding="none" className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-32 bg-gradient-to-br from-purple-600 to-blue-600 p-4 flex flex-col items-center justify-center text-white">
          <div className="mb-1">
            {isPercentage ? (
              <Percent className="w-8 h-8" />
            ) : (
              <DollarSign className="w-8 h-8" />
            )}
          </div>
          <p className="text-2xl font-bold">
            {isPercentage ? `${coupon.discount_value}%` : formatBDT(coupon.discount_value)}
          </p>
          <p className="text-xs opacity-90">{t('off') || 'OFF'}</p>
        </div>

        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-800 dark:text-white text-base truncate">
                {coupon.title || 'Special Offer'}
              </h3>
              {coupon.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {coupon.description}
                </p>
              )}
            </div>
            <Badge variant={isActive ? 'success' : 'gray'} size="sm" dot>
              {isActive ? t('active') || 'Active' : t('expired') || 'Expired'}
            </Badge>
          </div>

          {coupon.min_purchase && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {t('minPurchase') || 'Min purchase'}: {formatBDT(coupon.min_purchase)}
            </p>
          )}

          {coupon.expires_at && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {t('validUntil') || 'Valid until'}: {formatDate(coupon.expires_at)}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex-1 min-w-[120px] flex items-center gap-2 px-3 py-2 bg-dashed border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg">
              <Ticket className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <span className="font-mono font-bold text-sm text-purple-700 dark:text-purple-300 truncate">
                {coupon.code}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition"
              aria-label="Copy"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {onApply && isActive && (
            <button
              onClick={() => onApply(coupon)}
              className="w-full mt-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition"
            >
              {t('applyCoupon') || 'Apply Coupon'}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CouponCard;
