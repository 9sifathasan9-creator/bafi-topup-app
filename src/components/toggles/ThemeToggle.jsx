import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// ============================================
// 🌙 Theme Toggle Button
// ============================================
// Light ↔ Dark থিম পরিবর্তনের বাটন

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-white dark:bg-white/10 shadow-sm border border-gray-200 dark:border-none backdrop-blur-lg rounded-lg text-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 transition"
      title={isDark ? 'Switch to Light' : 'Switch to Dark'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;