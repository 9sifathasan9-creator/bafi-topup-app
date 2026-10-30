import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// ============================================
// 🌐 Language Toggle Button
// ============================================
// EN ↔ বাং ভাষা পরিবর্তনের বাটন

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-2.5 py-2 bg-white dark:bg-white/10 shadow-sm border border-gray-200 dark:border-none backdrop-blur-lg rounded-lg text-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 transition"
      title={language === 'en' ? 'বাংলায় দেখুন' : 'Switch to English'}
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-semibold">
        {language === 'en' ? 'EN' : 'বাং'}
      </span>
    </button>
  );
};

export default LanguageToggle;