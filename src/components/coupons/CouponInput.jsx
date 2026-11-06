import React, { useState } from 'react';
import { Ticket, Check, X, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { validateCoupon } from '../../supabaseClient';
import Button from '../ui/Button';

const CouponInput = ({ onApply, onRemove, appliedCoupon }) => {
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      notifyError(t('enterCouponCode') || 'Enter coupon code');
      return;
    }

    setLoading(true);
    try {
      const coupon = await validateCoupon(cleanCode);
      if (!coupon) {
        notifyError(t('invalidCoupon') || 'Invalid coupon code');
        return;
      }
      notifySuccess(t('couponApplied') || 'Coupon applied!');
      onApply?.(coupon);
      setCode('');
    } catch (err) {
      notifyError(t('invalidCoupon') || 'Invalid coupon');
    } finally {
      setLoading(false);
    }
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-green-800 dark:text-green-200">
            {t('couponApplied') || 'Coupon Applied!'}
          </p>
          <p className="font-mono text-xs text-green-700 dark:text-green-300 truncate">
            {appliedCoupon.code}
          </p>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-2 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition"
            aria-label="Remove"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          placeholder={t('enterCouponCode') || 'Enter coupon code'}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition uppercase"
          disabled={loading}
        />
      </div>
      <Button
        variant="primary"
        onClick={handleApply}
        loading={loading}
        disabled={!code.trim() || loading}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('apply') || 'Apply'}
      </Button>
    </div>
  );
};

export default CouponInput;
