import React, { createContext, useContext, useState, useEffect } from 'react';

// ============================================
// 🌙 Theme Context (Dark/Light Mode)
// ============================================
// এই কনটেক্সট পুরো অ্যাপে থিম পরিবর্তনের সুবিধা দেয়
// ইউজারের পছন্দ localStorage-এ সেভ থাকে

const ThemeContext = createContext();

// ============================================
// 🪝 Custom Hook
// ============================================
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// ============================================
// 📦 Provider Component
// ============================================
export const ThemeProvider = ({ children }) => {
  // localStorage থেকে থিম নিন, না থাকলে সিস্টেম প্রেফারেন্স
  const [theme, setTheme] = useState(() => {
    try {
      // ১. আগে localStorage চেক
      const saved = localStorage.getItem('bafi-theme');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
      // ২. না থাকলে সিস্টেম প্রেফারেন্স চেক
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      // ৩. ডিফল্ট light
      return 'light';
    } catch {
      return 'light';
    }
  });

  // থিম পরিবর্তন হলে DOM ও localStorage আপডেট
  useEffect(() => {
    try {
      localStorage.setItem('bafi-theme', theme);

      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark-mode');
      }

      // মোবাইল ব্রাউজারের status bar color
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute(
          'content',
          theme === 'dark' ? '#1a1a2e' : '#667eea'
        );
      }
    } catch (err) {
      console.error('Theme update error:', err);
    }
  }, [theme]);

  // ============================================
  // 🎛️ Actions
  // ============================================

  // টগল (Light ↔ Dark)
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // নির্দিষ্ট থিম সেট
  const changeTheme = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
    }
  };

  // ============================================
  // 🎁 Context Value
  // ============================================
  const value = {
    theme,              // 'light' বা 'dark'
    setTheme,           // সরাসরি সেট
    toggleTheme,        // টগল
    changeTheme,        // নির্দিষ্ট থিম
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;