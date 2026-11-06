import React, { useState } from 'react';
import { Send, AlertCircle, Tag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';
import { addTicket } from '../../supabaseClient';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const SupportTicket = ({ onSuccess }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { notifySuccess, notifyError } = useNotifications();

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'general', label: t('general') || 'General' },
    { id: 'payment', label: t('payment') || 'Payment' },
    { id: 'order', label: t('order') || 'Order' },
    { id: 'account', label: t('account') || 'Account' },
    { id: 'other', label: t('other') || 'Other' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (subject.trim().length < 5) {
      notifyError(t('subjectTooShort') || 'Subject too short');
      return;
    }
    if (message.trim().length < 10) {
      notifyError(t('messageTooShort') || 'Message too short');
      return;
    }

    setLoading(true);
    try {
      const result = await addTicket({
        user_id: user?.id,
        user_email: user?.email,
        subject: subject.trim(),
        category,
        message: message.trim(),
        status: 'open',
      });

      if (!result) throw new Error('Failed');

      notifySuccess(t('ticketCreated') || 'Ticket created!');
      setSubject('');
      setCategory('general');
      setMessage('');
      onSuccess?.(result);
    } catch (err) {
      notifyError(t('ticketFailed') || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="gaming" padding="md">
      <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">
        {t('createTicket') || 'Create Ticket'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('ticketSubject') || 'Subject'}
          leftIcon={AlertCircle}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={t('subjectPlaceholder') || 'Brief description of the issue'}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('category') || 'Category'}
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  category === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('ticketMessage') || 'Message'}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('messagePlaceholder') || 'Describe your issue in detail...'}
            rows={5}
            maxLength={1000}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
            {message.length}/1000
          </p>
        </div>

        <Button type="submit" variant="primary" leftIcon={Send} loading={loading} fullWidth>
          {t('submit') || 'Submit Ticket'}
        </Button>
      </form>
    </Card>
  );
};

export default SupportTicket;
