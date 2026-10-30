import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

// ============================================
// 📝 Reusable Input Component
// ============================================
// সব ধরনের ইনপুট ফিল্ডের জন্য এক জায়গায় স্টাইল

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  success = '',
  hint = '',
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  required = false,
  disabled = false,
  fullWidth = true,
  showPasswordToggle = false,
  className = '',
  inputClassName = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  // পাসওয়ার্ড টগল
  const inputType = showPasswordToggle
    ? showPassword
      ? 'text'
      : 'password'
    : type;

  // ============================================
  // 🎨 Border Color Based on State
  // ============================================
  const getBorderClass = () => {
    if (error) {
      return 'border-red-500 focus:ring-red-500 focus:border-red-500';
    }
    if (success) {
      return 'border-green-500 focus:ring-green-500 focus:border-green-500';
    }
    return 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500';
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* ============================================
          Label
          ============================================ */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* ============================================
          Input Wrapper
          ============================================ */}
      <div className="relative">
        {/* Left Icon */}
        {LeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <LeftIcon className="w-5 h-5" />
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full
            ${LeftIcon ? 'pl-10' : 'pl-4'}
            ${RightIcon || showPasswordToggle ? 'pr-12' : 'pr-4'}
            py-3
            bg-white dark:bg-gray-800
            border-2 rounded-lg
            outline-none transition
            text-gray-800 dark:text-white
            placeholder:text-gray-400
            disabled:opacity-50 disabled:cursor-not-allowed
            ${getBorderClass()}
            ${inputClassName}
          `.trim()}
          {...props}
        />

        {/* Password Toggle Button */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}

        {/* Right Icon (যদি password toggle না থাকে) */}
        {RightIcon && !showPasswordToggle && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <RightIcon className="w-5 h-5" />
          </div>
        )}

        {/* Success Icon */}
        {success && !error && !showPasswordToggle && !RightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none">
            <CheckCircle className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* ============================================
          Error Message
          ============================================ */}
      {error && (
        <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {/* ============================================
          Success Message
          ============================================ */}
      {success && !error && (
        <p className="flex items-center gap-1 mt-1.5 text-xs text-green-500">
          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{success}</span>
        </p>
      )}

      {/* ============================================
          Hint Text
          ============================================ */}
      {hint && !error && !success && (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;