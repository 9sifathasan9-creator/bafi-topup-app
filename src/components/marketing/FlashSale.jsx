import React, { useState, useEffect } from 'react';
import { Zap, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../ui/Card';

const FlashSale = ({ title, description, endTime, onCta, discount }) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!endTime) return;

    const updateTimer = () => {
      const end = new Date(endTime).getTime();
      const now = Date.now();
      const diff = Math.max(0, end - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
        <span className="text-lg font-bold text-white">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="text-[10px] text-white/70 mt-1 uppercase">{label}</span>
    </div>
  );

  return (
    <Card variant="gaming" padding="lg" className="relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center animate-pulse">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              {title || t('flashSale') || 'Flash Sale!'}
            </h3>
            {discount && (
              <span className="text-xs font-bold text-red-600 dark:text-red-400">
                {t('upTo') || 'Up to'} {discount}% {t('off') || 'OFF'}
              </span>
            )}
          </div>
        </div>

        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        )}

        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {t('endsIn') || 'Ends in'}:
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <TimeUnit value={timeLeft.days} label={t('days') || 'Days'} />
          <span className="text-white font-bold">:</span>
          <TimeUnit value={timeLeft.hours} label={t('hours') || 'Hours'} />
          <span className="text-white font-bold">:</span>
          <TimeUnit value={timeLeft.minutes} label={t('mins') || 'Mins'} />
          <span className="text-white font-bold">:</span>
          <TimeUnit value={timeLeft.seconds} label={t('secs') || 'Secs'} />
        </div>

        {onCta && (
          <button
            onClick={onCta}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            {t('shopNow') || 'Shop Now'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </Card>
  );
};

export default FlashSale;
