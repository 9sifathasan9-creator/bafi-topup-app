import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../../components/ui/Card';

const Terms = () => {
  const { t } = useLanguage();
  const sections = [
    { title: '1. Acceptance of Terms', body: 'By accessing and using BAFI Gaming, you accept and agree to be bound by these terms.' },
    { title: '2. Service Description', body: 'BAFI Gaming provides gaming top-up services. All transactions are final once processed.' },
    { title: '3. User Responsibilities', body: 'You must provide accurate Player ID and payment information. We are not responsible for wrong information provided.' },
    { title: '4. Payment Terms', body: 'All payments must be completed before top-up processing. Refunds are subject to our refund policy.' },
    { title: '5. Account Security', body: 'You are responsible for maintaining the security of your account credentials.' },
    { title: '6. Prohibited Activities', body: 'Fraudulent activities, chargebacks, and misuse of the platform are strictly prohibited.' },
    { title: '7. Limitation of Liability', body: 'BAFI Gaming is not liable for any indirect or consequential damages.' },
    { title: '8. Changes to Terms', body: 'We reserve the right to modify these terms at any time without prior notice.' },
  ];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">{t('termsOfService') || 'Terms of Service'}</h1>
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

export default Terms;
