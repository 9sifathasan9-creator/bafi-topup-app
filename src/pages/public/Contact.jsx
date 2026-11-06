import React from 'react';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { DEFAULT_CONTACT } from '../../utils/constants';
import Card from '../../components/ui/Card';
import ContactForm from '../../components/support/ContactForm';

const Contact = () => {
  const { t } = useLanguage();
  const info = [
    { icon: Mail, label: t('email') || 'Email', value: DEFAULT_CONTACT.EMAIL, href: `mailto:${DEFAULT_CONTACT.EMAIL}` },
    { icon: Phone, label: t('phone') || 'Phone', value: DEFAULT_CONTACT.PHONE, href: `tel:${DEFAULT_CONTACT.PHONE}` },
    { icon: MapPin, label: t('address') || 'Address', value: DEFAULT_CONTACT.ADDRESS },
    { icon: MessageCircle, label: 'WhatsApp', value: DEFAULT_CONTACT.WHATSAPP, href: `https://wa.me/${DEFAULT_CONTACT.WHATSAPP?.replace(/\D/g, '')}` },
  ];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">{t('contactUs') || 'Contact Us'}</h1>
          <p className="text-white/80">{t('contactDesc') || 'Get in touch with us'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {info.map((item, i) => {
              const Icon = item.icon;
              const content = (
                <Card variant="gaming" padding="md" hover clickable={!!item.href}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{item.value}</p>
                    </div>
                  </div>
                </Card>
              );
              return item.href ? (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer">{content}</a>
              ) : (
                <div key={i}>{content}</div>
              );
            })}
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Contact;
