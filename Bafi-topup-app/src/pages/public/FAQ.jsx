import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import FAQ from '../../components/support/FAQ';

const FAQPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">{t('faq') || 'FAQ'}</h1>
          <p className="text-white/80">{t('faqDesc') || 'Frequently Asked Questions'}</p>
        </div>
        <FAQ />
      </div>
    </div>
  );
};

export default FAQPage;
