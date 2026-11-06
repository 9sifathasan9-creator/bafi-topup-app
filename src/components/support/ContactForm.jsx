import React, { useState } from 'react';
import { Send, User, Mail, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { isValidEmail } from '../../utils/validators';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ContactForm = ({ onSubmit }) => {
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      notifyError(t('invalidName') || 'Invalid name');
      return;
    }
    if (!isValidEmail(email)) {
      notifyError(t('invalidEmail') || 'Invalid email');
      return;
    }
    if (message.trim().length < 10) {
      notifyError(t('messageTooShort') || 'Message too short');
      return;
    }

    setLoading(true);
    try {
      await onSubmit?.({ name: name.trim(), email: email.trim(), message: message.trim() });
      notifySuccess(t('messageSent') || 'Message sent!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      notifyError(t('sendFailed') || 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="gaming" padding="md">
      <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">
        {t('contactUs') || 'Contact Us'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('yourName') || 'Your Name'}
          leftIcon={User}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />

        <Input
          label={t('yourEmail') || 'Your Email'}
          type="email"
          leftIcon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('yourMessage') || 'Your Message'}
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('messagePlaceholder') || 'Write your message...'}
              rows={5}
              maxLength={500}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
              required
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
            {message.length}/500
          </p>
        </div>

        <Button type="submit" variant="primary" leftIcon={Send} loading={loading} fullWidth>
          {t('sendMessage') || 'Send Message'}
        </Button>
      </form>
    </Card>
  );
};

export default ContactForm;
