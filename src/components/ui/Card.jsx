import React from 'react';

// ============================================
// 🎴 Reusable Card Component
// ============================================
// সব ধরনের কার্ডের জন্য এক জায়গায় স্টাইল

const Card = ({
  children,
  variant = 'default',    // default | gaming | glass | outlined | flat
  padding = 'md',          // none | sm | md | lg
  hover = false,
  clickable = false,
  className = '',
  onClick,
  ...props
}) => {
  // ============================================
  // 🎨 Variants
  // ============================================
  const variants = {
    default:
      'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm',
    gaming:
      'bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-white/20 dark:border-gray-700 shadow-2xl',
    glass:
      'bg-white/10 backdrop-blur-lg border border-white/20',
    outlined:
      'bg-transparent border-2 border-gray-300 dark:border-gray-600',
    flat:
      'bg-gray-50 dark:bg-gray-800/50 border-0',
  };

  // ============================================
  // 📏 Padding Sizes
  // ============================================
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  // ============================================
  // 🔧 Combine Classes
  // ============================================
  const cardClasses = `
    rounded-2xl transition-all duration-200
    ${variants[variant] || variants.default}
    ${paddings[padding] || paddings.md}
    ${hover ? 'hover:shadow-lg hover:-translate-y-0.5' : ''}
    ${clickable ? 'cursor-pointer hover:shadow-lg active:scale-[0.99]' : ''}
    ${className}
  `.trim();

  const Component = clickable || onClick ? 'button' : 'div';

  return (
    <Component
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

// ============================================
// 📋 Card Sub-Components
// ============================================

// Card Header
export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

// Card Title
export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-bold text-gray-800 dark:text-white ${className}`}>
    {children}
  </h3>
);

// Card Description
export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${className}`}>
    {children}
  </p>
);

// Card Content
export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

// Card Footer
export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

export default Card;