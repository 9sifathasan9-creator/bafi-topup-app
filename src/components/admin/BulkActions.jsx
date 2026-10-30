import React from 'react';
import { Trash2, Check, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../ui/Button';

const BulkActions = ({ selectedCount = 0, onDelete, onApprove, onReject, onClear }) => {
  const { t } = useLanguage();

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="gaming-card px-4 py-3 flex items-center gap-3 shadow-2xl">
        <span className="text-sm font-semibold text-gray-800 dark:text-white whitespace-nowrap">
          {selectedCount} {t('selected') || 'selected'}
        </span>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

        <div className="flex items-center gap-2">
          {onApprove && (
            <Button variant="success" size="sm" leftIcon={Check} onClick={onApprove}>
              {t('approve') || 'Approve'}
            </Button>
          )}
          {onReject && (
            <Button variant="secondary" size="sm" leftIcon={X} onClick={onReject}>
              {t('reject') || 'Reject'}
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" size="sm" leftIcon={Trash2} onClick={onDelete}>
              {t('delete') || 'Delete'}
            </Button>
          )}
          <button
            onClick={onClear}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg transition"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;
