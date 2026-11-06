import React, { useState } from 'react';
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { isValidEmail } from '../../utils/validators';
import Card from '../ui/Card';

const Newsletter = ({ onSubscribe }) => {
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      notifyError(t('invalidEmail') || 'Invalid email');
      return;
    }

    setLoading(true);
    try {
      await onSubscribe?.(email.trim().toLowerCase());
      setSubscribed(true);
      notifySuccess(t('subscribed') || 'Subscribed!');
      setEmail('');
    } catch (err) {
      notifyError(t('subscribeFailed') || 'Subscribe failed');
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <Card variant="gaming" padding="lg" className="text-center">
        <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
          {t('subscribed') || 'Subscribed!'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('subscribedDesc') || 'You will receive our latest offers'}
        </p>
      </Card>
    );
  }

  return (
    <Card variant="gaming" padding="lg">
      <div className="text-center mb-5">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <Mail className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
          {t('newsletter') || 'Newsletter'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('newsletterDesc') || 'Get exclusive offers in your inbox'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('enterEmail') || 'you@example.com'}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2 font-medium"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span className="hidden sm:inline">{t('subscribe') || 'Subscribe'}</span>
        </button>
      </form>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
        {t('noSpam') || 'We promise no spam'}
      </p>
    </Card>
  );
};

export default Newsletter;
