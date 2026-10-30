import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'md', text = '', fullScreen = false, variant = 'default', className = '' }) => {
  const sizeClasses = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };
  const variantClasses = { default: 'text-purple-600 dark:text-purple-400', white: 'text-white', gray: 'text-gray-500' };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin`} />
      {text && <p className={`text-sm font-medium ${variantClasses[variant]}`}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="gaming-card p-8">{spinner}</div>
      </div>
    );
  }
  return spinner;
};

export default Loader;
