import React from 'react';
import { Gamepad2, Users, Zap, Shield, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../../components/ui/Card';

const About = () => {
  const { t } = useLanguage();
  const features = [
    { icon: Zap, title: t('fastDelivery') || 'Fast Delivery', desc: t('aboutFast') || 'Instant top-up within minutes' },
    { icon: Shield, title: t('secure') || 'Secure', desc: t('aboutSecure') || 'Safe and encrypted transactions' },
    { icon: Users, title: t('support24x7') || '24/7 Support', desc: t('aboutSupport') || 'Always here to help you' },
    { icon: Heart, title: t('trusted') || 'Trusted', desc: t('aboutTrusted') || 'Thousands of happy customers' },
  ];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">{t('aboutUs') || 'About Us'}</h1>
          <p className="text-white/80 max-w-2xl mx-auto">{t('aboutDesc') || 'BAFI Gaming is your trusted gaming top-up platform, providing fast and secure services for all popular games.'}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card key={i} variant="gaming" padding="md">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white mb-1">{f.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default About;
