import React from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SORT_OPTIONS } from '../../utils/constants';

// ============================================
// 🔀 Game Sort Component
// ============================================
// গেম সাজানোর জন্য আলাদা ড্রপডাউন
// (GameFilter এর বাইরে স্ট্যান্ডঅ্যালোন ব্যবহারের জন্য)

const GameSort = ({
  sortBy = 'newest',
  onSortChange,
  variant = 'dropdown',    // dropdown | buttons | pills
  size = 'md',              // sm | md | lg
  className = '',
}) => {
  const { t, language } = useLanguage();

  // ============================================
  // 📏 Size Classes
  // ============================================
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  // ============================================
  // 🎯 Get Label
  // ============================================
  const getLabel = (option) => {
    return language === 'bn' ? option.nameBn : option.name;
  };

  // ============================================
  // 🔽 Dropdown Variant
  // ============================================
  if (variant === 'dropdown') {
    return (
      <div className={`relative inline-block ${className}`}>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <ArrowUpDown className="w-4 h-4" />
        </div>
        <select
          value={sortBy}
          onChange={(e) => onSortChange?.(e.target.value)}
          className={`
            appearance-none
            pl-10 pr-10
            ${sizeClasses[size]}
            bg-white/10 backdrop-blur-lg
            border border-white/20
            text-white
            rounded-lg
            focus:ring-2 focus:ring-purple-500 focus:border-transparent
            outline-none cursor-pointer transition
          `.trim()}
          aria-label={t('sortBy') || 'Sort by'}
        >
          {SORT_OPTIONS.map((option) => (
            <option
              key={option.id}
              value={option.id}
              className="text-gray-800 bg-white"
            >
              {getLabel(option)}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
      </div>
    );
  }

  // ============================================
  // 🔘 Buttons Variant
  // ============================================
  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onSortChange?.(option.id)}
            className={`
              ${sizeClasses[size]}
              rounded-lg font-medium transition
              ${
                sortBy === option.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white/10 backdrop-blur-lg text-white/80 hover:bg-white/20 hover:text-white border border-white/20'
              }
            `.trim()}
          >
            {getLabel(option)}
          </button>
        ))}
      </div>
    );
  }

  // ============================================
  // 💊 Pills Variant
  // ============================================
  if (variant === 'pills') {
    return (
      <div className={`inline-flex items-center gap-1 p-1 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-x-auto ${className}`}>
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onSortChange?.(option.id)}
            className={`
              ${sizeClasses[size]}
              rounded-lg font-medium transition whitespace-nowrap
              ${
                sortBy === option.id
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            `.trim()}
          >
            {getLabel(option)}
          </button>
        ))}
      </div>
    );
  }

  return null;
};

export default GameSort;