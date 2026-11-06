import React from 'react';
import { Package } from 'lucide-react';
import Button from '../ui/Button';

const EmptyState = ({ icon: Icon = Package, title = 'No data found', description = '', actionLabel = '', onAction, variant = 'default', className = '' }) => {
  const isWhite = variant === 'white';
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isWhite ? 'bg-white/10 backdrop-blur-lg' : 'bg-gray-100 dark:bg-gray-800'}`}>
        <Icon className={`w-10 h-10 ${isWhite ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}`} />
      </div>
      <h3 className={`text-xl font-bold mb-2 ${isWhite ? 'text-white' : 'text-gray-800 dark:text-white'}`}>{title}</h3>
      {description && <p className={`text-sm max-w-md mb-6 ${isWhite ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>{description}</p>}
      {actionLabel && onAction && <Button variant="primary" onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
};

export default EmptyState;
