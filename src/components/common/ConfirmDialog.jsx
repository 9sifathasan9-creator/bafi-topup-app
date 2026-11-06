import React from 'react';
import { AlertTriangle, Trash2, CheckCircle, Info } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Are you sure?', message = 'This action cannot be undone.', confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger', loading = false }) => {
  const variants = {
    danger: { icon: Trash2, iconBg: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-500', buttonVariant: 'danger' },
    warning: { icon: AlertTriangle, iconBg: 'bg-yellow-100 dark:bg-yellow-900/30', iconColor: 'text-yellow-500', buttonVariant: 'primary' },
    success: { icon: CheckCircle, iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-500', buttonVariant: 'success' },
    info: { icon: Info, iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-500', buttonVariant: 'primary' },
  };
  const config = variants[variant] || variants.danger;
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center py-2">
        <div className={`w-16 h-16 ${config.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading} fullWidth>{cancelText}</Button>
          <Button variant={config.buttonVariant} onClick={onConfirm} loading={loading} fullWidth>{confirmText}</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
