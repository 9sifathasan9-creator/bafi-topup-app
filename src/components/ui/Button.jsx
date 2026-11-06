import React from 'react';
import { Loader2 } from 'lucide-react';

// ============================================
// 🔘 Reusable Button Component
// ============================================
// সব ধরনের বাটনের জন্য এক জায়গায় স্টাইল

const Button = ({
  children,
  variant = 'primary',       // primary | secondary | outline | ghost | danger | success
  size = 'md',                // sm | md | lg | icon
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  // ============================================
  // 🎨 Variants
  // ============================================
  const variants = {
    primary:
      'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/30',
    secondary:
      'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
    outline:
      'bg-transparent text-purple-600 dark:text-purple-400 border-2 border-purple-600 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20',
    ghost:
      'bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
    danger:
      'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30',
    success:
      'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30',
  };

  // ============================================
  // 📏 Sizes
  // ============================================
  const sizes = {
    sm: 'px-3 py-1.5 text-sm font-medium rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm font-semibold rounded-lg gap-2',
    lg: 'px-6 py-3 text-base font-semibold rounded-xl gap-2',
    icon: 'p-2.5 rounded-lg',
  };

  // ============================================
  // 🔧 Combine Classes
  // ============================================
  const buttonClasses = `
    inline-flex items-center justify-center
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}

      {/* Left Icon (লোডিং না হলে) */}
      {!loading && LeftIcon && <LeftIcon className="w-4 h-4" />}

      {/* Children */}
      {children}

      {/* Right Icon (লোডিং না হলে) */}
      {!loading && RightIcon && <RightIcon className="w-4 h-4" />}
    </button>
  );
};

export default Button;