import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { getSettings, updateSettings } from '../../supabaseClient';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

const AdminSettings = () => {
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    site_name: '',
    site_logo: '',
    contact_email: '',
    contact_phone: '',
    welcome_message: '',
  });

  useEffect(() => {
    const load = async () => {
      const data = await getSettings();
      setForm({
        site_name: data.site_name || '',
        site_logo: data.site_logo || '',
        contact_email: data.contact_email || '',
        contact_phone: data.contact_phone || '',
        welcome_message: data.welcome_message || '',
      });
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateSettings(form);
      if (result) {
        notifySuccess(t('settingsSaved') || 'Settings saved!');
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      notifyError(t('saveFailed') || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="gaming-card p-8 text-center text-gray-500">{t('loading') || 'Loading...'}</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">{t('siteSettings') || 'Site Settings'}</h1>
        <p className="text-white/70 text-sm">{t('manageSettingsDesc') || 'Manage your site configuration'}</p>
      </div>

      <Card variant="gaming" padding="md">
        <div className="space-y-4">
          <Input label={t('siteName') || 'Site Name'} value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} />
          <Input label={t('siteLogo') || 'Site Logo URL'} value={form.site_logo} onChange={(e) => setForm({ ...form, site_logo: e.target.value })} />
          <Input label={t('welcomeMessage') || 'Welcome Message'} value={form.welcome_message} onChange={(e) => setForm({ ...form, welcome_message: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('contactEmail') || 'Contact Email'} type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
            <Input label={t('contactPhone') || 'Contact Phone'} value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
          </div>
          <Button variant="primary" leftIcon={Save} onClick={handleSave} loading={saving} fullWidth>
            {t('saveSettings') || 'Save Settings'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettings;
