import React, { useState } from 'react';
import { Save, User, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { isValidName, isValidPhone } from '../../utils/validators';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ProfileEdit = ({ user, onSave, loading = false }) => {
  const { t } = useLanguage();
  const { notifyError } = useNotifications();

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!isValidName(fullName)) {
      newErrors.fullName = t('invalidName') || 'Name must be 2-100 characters';
    }
    if (phone && !isValidPhone(phone)) {
      newErrors.phone = t('invalidPhone') || 'Invalid phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave?.({ full_name: fullName.trim(), phone: phone.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t('fullName') || 'Full Name'}
        leftIcon={User}
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="John Doe"
        error={errors.fullName}
        required
      />

      <Input
        label={t('phoneNumber') || 'Phone Number'}
        leftIcon={Phone}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="01XXXXXXXXX"
        error={errors.phone}
      />

      <Button type="submit" variant="primary" leftIcon={Save} loading={loading} fullWidth>
        {t('saveChanges') || 'Save Changes'}
      </Button>
    </form>
  );
};

export default ProfileEdit;
