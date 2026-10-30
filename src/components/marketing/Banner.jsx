import React from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Banner = ({ title, subtitle, ctaText, onCta, onClose, variant = 'primary', icon: Icon = Sparkles }) => {
  const { t } = useLanguage();
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  const variants = {
    primary: 'from-purple-600 to-blue-600',
    success: 'from-green-500 to-teal-500',
    warning: 'from-yellow-500 to-orange-500',
    danger: 'from-red-500 to-pink-500',
  };

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <div className={`relative bg-gradient-to-r ${variants[variant] || variants.primary} rounded-2xl p-5 shadow-lg overflow-hidden`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />

      <div className="relative flex items-start gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
          {subtitle && <p className="text-sm text-white/90 mb-3">{subtitle}</p>}
          {ctaText && onCta && (
            <button
              onClick={onCta}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-800 text-sm font-semibold rounded-lg hover:bg-white/90 transition"
            >
              {ctaText}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {onClose && (
          <button
            onClick={handleClose}
            className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Banner;
