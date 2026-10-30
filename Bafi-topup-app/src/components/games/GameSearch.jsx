import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { debounce } from '../../utils/helpers';

// ============================================
// 🔍 Game Search Component
// ============================================
// Debounced সার্চ বার

const GameSearch = ({
  value = '',
  onChange,
  onSearch,
  placeholder,
  loading = false,
  autoFocus = false,
  debounceDelay = 300,
  className = '',
}) => {
  const { t } = useLanguage();
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef(null);

  // ============================================
  // 🔄 Sync External Value
  // ============================================
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // ============================================
  // 🎯 Auto Focus
  // ============================================
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // ============================================
  // ⏱️ Debounced Handler
  // ============================================
  const debouncedSearch = useRef(
    debounce((query) => {
      onChange?.(query);
      onSearch?.(query);
    }, debounceDelay)
  ).current;

  // ============================================
  // 📝 Handle Input Change
  // ============================================
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedSearch(newValue);
  };

  // ============================================
  // 🧹 Clear Search
  // ============================================
  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
    onSearch?.('');
    inputRef.current?.focus();
  };

  // ============================================
  // ⌨️ Enter Key Submit
  // ============================================
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onChange?.(localValue);
      onSearch?.(localValue);
    }
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
        ) : (
          <Search className="w-5 h-5" />
        )}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || t('searchGames') || 'Search games...'}
        className="
          w-full pl-12 pr-12 py-3
          bg-white/95 dark:bg-gray-800/95
          backdrop-blur-lg
          border border-white/20 dark:border-gray-700
          rounded-xl
          text-gray-800 dark:text-white
          placeholder:text-gray-400
          focus:ring-2 focus:ring-purple-500 focus:border-transparent
          outline-none transition
          shadow-lg
        "
        aria-label="Search games"
      />

      {/* Clear Button */}
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          aria-label="Clear search"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default GameSearch;