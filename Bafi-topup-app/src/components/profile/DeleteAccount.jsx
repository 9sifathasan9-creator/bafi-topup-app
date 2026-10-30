import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const DeleteAccount = ({ onDelete, loading = false }) => {
  const { t } = useLanguage();
  const { notifyError } = useNotifications();
  const [confirmText, setConfirmText] = useState('');

  const REQUIRED_TEXT = 'DELETE';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirmText !== REQUIRED_TEXT) {
      notifyError(`${t('typeToConfirm') || 'Type'} "${REQUIRED_TEXT}" ${t('toConfirm') || 'to confirm'}`);
      return;
    }
    onDelete?.();
  };

  return (
    <Card variant="gaming" padding="md" className="border-2 border-red-200 dark:border-red-900/50">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h3 className="text-base font-bold text-red-600 dark:text-red-400">
            {t('dangerZone') || 'Danger Zone'}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {t('deleteAccountWarning') || 'This action cannot be undone. All your data will be permanently deleted.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label={`${t('typeToConfirm') || 'Type'} "${REQUIRED_TEXT}" ${t('toConfirm') || 'to confirm'}`}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
          placeholder={REQUIRED_TEXT}
        />

        <Button
          type="submit"
          variant="danger"
          leftIcon={Trash2}
          loading={loading}
          disabled={confirmText !== REQUIRED_TEXT}
          fullWidth
        >
          {t('deleteAccount') || 'Delete Account'}
        </Button>
      </form>
    </Card>
  );
};

export default DeleteAccount;
