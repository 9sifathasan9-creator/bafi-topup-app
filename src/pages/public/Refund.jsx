import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../../components/ui/Card';

const Refund = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">{t('refundPolicy') || 'Refund Policy'}</h1>
        <p className="text-white/70 text-sm mb-8">Last updated: January 2026</p>

        <Card variant="gaming" padding="lg" className="space-y-6 text-gray-700 dark:text-gray-300">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">1. General Policy</h2>
            <p className="text-sm leading-relaxed">
              At <strong>BAFI Topup</strong>, we strive to provide the best gaming top-up experience. 
              Since our products are digital and delivered instantly, all sales are generally considered final.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">2. Eligible Refunds</h2>
            <p className="text-sm leading-relaxed mb-2">
              You may be eligible for a refund ONLY under the following circumstances:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>The payment was successful but the top-up failed to deliver within 24 hours.</li>
              <li>You accidentally paid twice for the same order.</li>
              <li>Our system encountered a technical error during the transaction.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">3. Non-Refundable Cases</h2>
            <p className="text-sm leading-relaxed mb-2">
              We cannot issue refunds for the following:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Incorrect Player ID or Server ID provided by the user.</li>
              <li>Top-up successfully delivered to the provided Player ID.</li>
              <li>Change of mind after the order is processed.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">4. How to Request a Refund</h2>
            <p className="text-sm leading-relaxed">
              To request a refund, please contact our support team within 48 hours of the transaction at 
              <a href="mailto:9sifathasan9@gmail.com" className="text-purple-600 dark:text-purple-400 font-semibold ml-1">9sifathasan9@gmail.com</a>. 
              Please include your Order ID and a screenshot of the payment.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Refund;
