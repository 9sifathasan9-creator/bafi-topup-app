import React, { useEffect, useState } from 'react';
import { X, Gift, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const PromoPopup = ({ title, description, code, delay = 3000, storageKey = 'bafi-promo-seen' }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(storageKey);
      if (seen) return;
    } catch {}

    const timer = setTimeout(() => setIsOpen(true), delay);
    return () => clearTimeout(timer);
  }, [delay, storageKey]);

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(storageKey, 'true');
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md gaming-card p-8 text-center animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
          <Gift className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          {title || t('specialOffer') || 'Special Offer!'}
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
          {description || t('promoDesc') || 'Get exclusive discount on your first top-up!'}
        </p>

        {code && (
          <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl mb-5">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {t('useCode') || 'Use code'}
            </p>
            <p className="font-mono text-2xl font-bold text-pink-600 dark:text-pink-400 tracking-wider">
              {code}
            </p>
          </div>
        )}

        <button
          onClick={handleClose}
          className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
        >
          {t('gotIt') || 'Got it!'}
        </button>
      </div>
    </div>
  );
};

export default PromoPopup;
