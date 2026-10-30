import React, { useState } from 'react';
import { Database, Download, Upload, Loader2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { exportToJSON } from '../../utils/helpers';
import Card from '../ui/Card';
import Button from '../ui/Button';

const BackupRestore = ({ data = {}, onRestore }) => {
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handleBackup = () => {
    setLoading(true);
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      exportToJSON(
        { ...data, exported_at: new Date().toISOString() },
        `bafi-backup-${timestamp}.json`
      );
      notifySuccess(t('backupCreated') || 'Backup created!');
    } catch (err) {
      notifyError(t('backupFailed') || 'Backup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoring(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      await onRestore?.(json);
      notifySuccess(t('restoreSuccess') || 'Data restored!');
    } catch (err) {
      notifyError(t('restoreFailed') || 'Restore failed');
    } finally {
      setRestoring(false);
      e.target.value = '';
    }
  };

  return (
    <Card variant="gaming" padding="md">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="text-base font-bold text-gray-800 dark:text-white">
          {t('backupRestore') || 'Backup & Restore'}
        </h3>
      </div>

      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-lg mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-700 dark:text-yellow-200">
            {t('backupWarning') || 'Always backup your data before making major changes.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="primary"
          leftIcon={loading ? Loader2 : Download}
          loading={loading}
          onClick={handleBackup}
          fullWidth
        >
          {t('createBackup') || 'Create Backup'}
        </Button>

        <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer">
          {restoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {t('restoreData') || 'Restore Data'}
          <input
            type="file"
            accept=".json"
            onChange={handleRestore}
            className="hidden"
            disabled={restoring}
          />
        </label>
      </div>
    </Card>
  );
};

export default BackupRestore;
