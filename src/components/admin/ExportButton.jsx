import React from 'react';
import { Download } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { exportToCSV, exportToJSON } from '../../utils/helpers';
import Button from '../ui/Button';

const ExportButton = ({ data = [], filename = 'export', format = 'csv' }) => {
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();

  const handleExport = () => {
    if (!data || data.length === 0) {
      notifyError(t('noDataToExport') || 'No data to export');
      return;
    }

    try {
      const fullName = `${filename}-${new Date().toISOString().split('T')[0]}`;
      if (format === 'json') {
        exportToJSON(data, `${fullName}.json`);
      } else {
        exportToCSV(data, `${fullName}.csv`);
      }
      notifySuccess(t('exported') || 'Exported successfully!');
    } catch (err) {
      notifyError(t('exportFailed') || 'Export failed');
    }
  };

  return (
    <Button variant="secondary" size="sm" leftIcon={Download} onClick={handleExport}>
      {t('export') || 'Export'}
    </Button>
  );
};

export default ExportButton;
