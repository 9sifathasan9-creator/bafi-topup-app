import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../ui/Card';
import FAQItem from './FAQItem';

const FAQ = () => {
  const { t, language } = useLanguage();

  const faqs = [
    {
      q: language === 'bn' ? 'কিভাবে টপ-আপ করব?' : 'How do I top-up?',
      a: language === 'bn' ? 'গেম সিলেক্ট করুন, Player ID দিন, পেমেন্ট মেথড বেছে নিন এবং পেমেন্ট সম্পন্ন করুন।' : 'Select a game, enter your Player ID, choose payment method, and complete the payment.',
    },
    {
      q: language === 'bn' ? 'টপ-আপ কত সময় লাগে?' : 'How long does top-up take?',
      a: language === 'bn' ? 'সাধারণত ৫-১০ মিনিটের মধ্যে টপ-আপ সম্পন্ন হয়।' : 'Usually within 5-10 minutes after payment confirmation.',
    },
    {
      q: language === 'bn' ? 'পেমেন্ট মেথড কী কী?' : 'What payment methods are available?',
      a: language === 'bn' ? 'বিকাশ, নগদ, রকেট এবং ব্যাংক ট্রান্সফার সাপোর্ট করা হয়।' : 'We support bKash, Nagad, Rocket, and Bank Transfer.',
    },
    {
      q: language === 'bn' ? 'রিফান্ড পলিসি কী?' : 'What is the refund policy?',
      a: language === 'bn' ? 'ভুল তথ্যের কারণে টপ-আপ ব্যর্থ হলে ২৪ ঘন্টার মধ্যে রিফান্ড পাবেন।' : 'If top-up fails due to wrong info, refund within 24 hours.',
    },
    {
      q: language === 'bn' ? 'ভুল Player ID দিলে কী হবে?' : 'What if I enter wrong Player ID?',
      a: language === 'bn' ? 'ভুল Player ID দিলে আমরা দায়ী নই। সঠিক তথ্য দেওয়ার দায়িত্ব ইউজারের।' : 'We are not responsible for wrong Player ID. User must provide accurate info.',
    },
    {
      q: language === 'bn' ? 'সাপোর্ট কিভাবে পাব?' : 'How do I get support?',
      a: language === 'bn' ? 'Live Chat, Support Ticket, বা WhatsApp-এ আমাদের সাথে যোগাযোগ করুন।' : 'Contact us via Live Chat, Support Ticket, or WhatsApp.',
    },
  ];

  return (
    <Card variant="gaming" padding="md">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="text-base font-bold text-gray-800 dark:text-white">
          {t('faq') || 'Frequently Asked Questions'}
        </h3>
      </div>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.q} answer={faq.a} defaultOpen={index === 0} />
        ))}
      </div>
    </Card>
  );
};

export default FAQ;
