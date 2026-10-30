import React from 'react';

// ============================================
// 🏷️ Reusable Badge Component
// ============================================
// Status, Label, Count দেখানোর জন্য

const Badge = ({
  children,
  variant = 'default',      // default | primary | success | warning | danger | info | purple | gray
  size = 'md',               // sm | md | lg
  rounded = 'full',          // full | md | sm | none
  dot = false,               // বাম দিকে ডট দেখাবে
  icon: Icon = null,         // আইকন
  className = '',
  ...props
}) => {
  // ============================================
  // 🎨 Variants
  // ============================================
  const variants = {
    default:
      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
    primary:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    success:
      'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    warning:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    danger:
      'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    info:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    purple:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    gray:
      'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    // Solid badges
    solid:
      'bg-gradient-to-r from-purple-600 to-blue-600 text-white',
  };

  // ============================================
  // 📏 Sizes
  // ============================================
  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-1.5',
  };

  // ============================================
  // 🔘 Rounded
  // ============================================
  const roundedClasses = {
    full: 'rounded-full',
    md: 'rounded-md',
    sm: 'rounded',
    none: 'rounded-none',
  };

  // ============================================
  // 🔵 Dot Color
  // ============================================
  const dotColors = {
    default: 'bg-gray-500',
    primary: 'bg-purple-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-400',
    solid: 'bg-white',
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center whitespace-nowrap
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.md}
        ${roundedClasses[rounded] || roundedClasses.full}
        ${className}
      `.trim()}
      {...props}
    >
      {/* Dot */}
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}`}
        />
      )}

      {/* Icon */}
      {Icon && <Icon className="w-3 h-3" />}

      {/* Content */}
      {children}
    </span>
  );
};

// ============================================
// 🎯 Status Badge (Auto Color)
// ============================================
export const StatusBadge = ({ status, className = '' }) => {
  const statusMap = {
    pending: { variant: 'warning', label: 'Pending' },
    processing: { variant: 'info', label: 'Processing' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
    failed: { variant: 'danger', label: 'Failed' },
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'gray', label: 'Inactive' },
    online: { variant: 'success', label: 'Online' },
    offline: { variant: 'gray', label: 'Offline' },
    open: { variant: 'info', label: 'Open' },
    closed: { variant: 'gray', label: 'Closed' },
  };

  const config = statusMap[status?.toLowerCase()] || {
    variant: 'default',
    label: status || 'Unknown',
  };

  return (
    <Badge variant={config.variant} dot className={className}>
      {config.label}
    </Badge>
  );
};

export default Badge;