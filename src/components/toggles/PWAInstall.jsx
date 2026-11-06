import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// ============================================
// 📱 PWA Install Prompt
// ============================================
// ব্রাউজার থেকে "Add to Home Screen" এর ব্যানার

const PWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const { t } = useLanguage();

  // ============================================
  // 🎧 Listen for install prompt
  // ============================================
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // ৭ দিনের মধ্যে dismiss করা থাকলে দেখাব না
      try {
        const dismissedUntil = localStorage.getItem('bafi-pwa-dismissed');
        if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
          return;
        }
      } catch {}

      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Install হলে hide করি
    const installedHandler = () => {
      setShowInstall(false);
      setDeferredPrompt(null);
      console.log('✅ PWA installed');
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  // ============================================
  // 🎯 Handle install click
  // ============================================
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('✅ User accepted install');
    } else {
      console.log('❌ User dismissed install');
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  // ============================================
  // ❌ Dismiss (৭ দিন পর আবার দেখাবে)
  // ============================================
  const handleDismiss = () => {
    try {
      const sevenDaysLater = Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem('bafi-pwa-dismissed', String(sevenDaysLater));
    } catch {}
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-slide-up">
      <div className="gaming-card p-4 flex items-start space-x-3">
        {/* Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Download className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            {t('installPWA') || 'Install BAFI Gaming'}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
            {t('installPWA_desc') || 'Add to home screen for better experience'}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg transition"
            >
              {t('install') || 'Install'}
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              {t('notNow') || 'Not Now'}
            </button>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PWAInstall;