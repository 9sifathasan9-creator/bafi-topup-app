import React, { useState } from 'react';
import { Lock, Save, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { isValidPassword, getPasswordStrength } from '../../utils/validators';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ChangePassword = ({ onChangePassword, loading = false }) => {
  const { t } = useLanguage();
  const { notifyError } = useNotifications();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const strength = getPasswordStrength(newPassword);

  const strengthColor = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
  }[strength.color] || 'bg-gray-300';

  const strengthWidth = {
    0: '0%', 1: '15%', 2: '30%', 3: '45%',
    4: '60%', 5: '75%', 6: '90%', 7: '100%',
  }[strength.score] || '0%';

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentPassword) {
      notifyError(t('currentPasswordRequired') || 'Current password required');
      return;
    }
    if (!isValidPassword(newPassword)) {
      notifyError(t('weakPassword') || 'Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      notifyError(t('passwordMismatch') || 'Passwords do not match');
      return;
    }

    onChangePassword?.({ currentPassword, newPassword });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t('currentPassword') || 'Current Password'}
        type="password"
        leftIcon={Lock}
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Enter current password"
        showPasswordToggle
        required
      />

      <div>
        <Input
          label={t('newPassword') || 'New Password'}
          type="password"
          leftIcon={Lock}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="At least 6 characters"
          showPasswordToggle
          required
        />
        {newPassword && (
          <div className="mt-2">
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strengthColor}`}
                style={{ width: strengthWidth }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
              {t('strength') || 'Strength'}: {strength.label}
            </p>
          </div>
        )}
      </div>

      <Input
        label={t('confirmPassword') || 'Confirm Password'}
        type="password"
        leftIcon={Lock}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Re-enter password"
        showPasswordToggle
        required
      />

      <Button type="submit" variant="primary" leftIcon={Save} loading={loading} fullWidth>
        {t('changePassword') || 'Change Password'}
      </Button>
    </form>
  );
};

export default ChangePassword;
