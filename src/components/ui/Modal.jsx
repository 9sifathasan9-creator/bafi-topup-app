import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// ============================================
// 🪟 Reusable Modal Component
// ============================================
// সব মোডালের জন্য এক জায়গায় স্টাইল
// Esc, outside click, body scroll lock সব আছে

const Modal = ({
  isOpen,
  onClose,
  title = '',
  children,
  footer = null,
  size = 'md',              // sm | md | lg | xl | full
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = '',
}) => {
  const modalRef = useRef(null);

  // ============================================
  // 🔒 Body Scroll Lock
  // ============================================
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // ============================================
  // ⌨️ ESC Key to Close
  // ============================================
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // ============================================
  // 🖱️ Overlay Click
  // ============================================
  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  // ============================================
  // 📏 Size Classes
  // ============================================
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Modal Box */}
      <div
        ref={modalRef}
        className={`
          relative w-full ${sizeClasses[size] || sizeClasses.md}
          bg-white dark:bg-gray-800
          rounded-2xl shadow-2xl
          border border-gray-200 dark:border-gray-700
          max-h-[90vh] flex flex-col
          animate-slide-up
          ${className}
        `.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================
            Header
            ============================================ */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-bold text-gray-800 dark:text-white"
              >
                {title}
              </h2>
            )}
            {!title && <div />}

            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* ============================================
            Body (Scrollable)
            ============================================ */}
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>

        {/* ============================================
            Footer
            ============================================ */}
        {footer && (
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;