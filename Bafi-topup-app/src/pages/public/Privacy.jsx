import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../../components/ui/Card';

const Privacy = () => {
  const { t } = useLanguage();
  const sections = [
    { title: '1. Information We Collect', body: 'We collect your email, phone number, and transaction data to provide our services.' },
    { title: '2. How We Use Your Information', body: 'Your data is used to process orders, provide support, and improve our services.' },
    { title: '3. Information Sharing', body: 'We do not sell or share your personal information with third parties except as required by law.' },
    { title: '4. Data Security', body: 'We use industry-standard security measures to protect your data.' },
    { title: '5. Cookies', body: 'We use cookies to improve your experience on our platform.' },
    { title: '6. Your Rights', body: 'You have the right to access, modify, or delete your personal information.' },
    { title: '7. Contact Us', body: 'For privacy concerns, contact us at admin@bafi.gd' },
  ];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">{t('privacyPolicy') || 'Privacy Policy'}</h1>
        <p className="text-white/70 text-sm mb-8">{t('lastUpdated') || 'Last updated'}: January 2025</p>

        <Card variant="gaming" padding="lg" className="space-y-5">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-base font-bold text-gray-800 dark:text-white mb-2">{s.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
