import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../translations/en';
import bn from '../translations/bn';

// ============================================
// 🌐 Language Context
// ============================================
// এই কনটেক্সট পুরো অ্যাপে ভাষা (English/Bangla)
// পরিবর্তনের সুবিধা দেয়

const LanguageContext = createContext();

// ============================================
// 🪝 Custom Hook
// ============================================
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// ============================================
// 📦 Provider Component
// ============================================
export const LanguageProvider = ({ children }) => {
  // localStorage থেকে আগের ভাষা নিন, না থাকলে 'en'
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('bafi-language') || 'en';
    } catch {
      return 'en';
    }
  });

  // ভাষা পরিবর্তন হলে localStorage ও HTML lang আপডেট
  useEffect(() => {
    try {
      localStorage.setItem('bafi-language', language);
      document.documentElement.lang = language;

      // বাংলা হলে body তে bangla class যোগ
      if (language === 'bn') {
        document.body.classList.add('bangla-mode');
      } else {
        document.body.classList.remove('bangla-mode');
      }
    } catch (err) {
      console.error('Language update error:', err);
    }
  }, [language]);

  // ভাষা টগল (EN ↔ BN)
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  // ভাষা পরিবর্তন (নির্দিষ্ট ভাষা সেট)
  const changeLanguage = (lang) => {
    if (lang === 'en' || lang === 'bn') {
      setLanguage(lang);
    }
  };

  // Translation function
  // ব্যবহার: t('login') → 'Login' বা 'লগইন'
  const t = (key, fallback = '') => {
    const translations = language === 'en' ? en : bn;
    return translations[key] || fallback || key;
  };

  // বর্তমান ভাষার সব translation
  const translations = language === 'en' ? en : bn;

  const value = {
    language,           // 'en' বা 'bn'
    setLanguage,        // সরাসরি সেট
    toggleLanguage,     // EN ↔ BN টগল
    changeLanguage,     // নির্দিষ্ট ভাষা
    t,                  // translate function
    translations,       // সব translation object
    isEnglish: language === 'en',
    isBangla: language === 'bn',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;