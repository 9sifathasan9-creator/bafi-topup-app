import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const AnnouncementBar = ({ message, onClose }) => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(true);

  if (!visible || !message) return null;

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 pr-8">
        <Megaphone className="w-4 h-4 flex-shrink-0 animate-pulse" />
        <p className="text-xs sm:text-sm font-medium text-center">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
