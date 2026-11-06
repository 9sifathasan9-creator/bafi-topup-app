import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// ============================================
// 🔽 Reusable Dropdown Component
// ============================================
// সব ধরনের ড্রপডাউন মেনুর জন্য এক জায়গায় স্টাইল

const Dropdown = ({
  trigger,                    // Custom trigger (optional)
  items = [],                 // [{ id, label, icon, onClick, danger, disabled }]
  label,                      // Simple trigger label
  icon: TriggerIcon = null,   // Trigger icon
  position = 'left',          // left | right
  align = 'bottom',           // bottom | top
  width = 'w-56',             // Tailwind width class
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ============================================
  // 🎧 Close on Outside Click
  // ============================================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // ============================================
  // ⌨️ Close on ESC
  // ============================================
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // ============================================
  // 🖱️ Handle Item Click
  // ============================================
  const handleItemClick = (item) => {
    if (item.disabled) return;
    item.onClick?.();
    setIsOpen(false);
  };

  // ============================================
  // 🎨 Position Classes
  // ============================================
  const positionClass = position === 'right' ? 'right-0' : 'left-0';
  const alignClass = align === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* ============================================
          Trigger Button
          ============================================ */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-200"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {trigger ? (
          trigger
        ) : (
          <>
            {TriggerIcon && <TriggerIcon className="w-4 h-4" />}
            {label && <span className="text-sm font-medium">{label}</span>}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </button>

      {/* ============================================
          Dropdown Menu
          ============================================ */}
      {isOpen && (
        <div
          className={`
            absolute ${positionClass} ${alignClass} ${width}
            bg-white dark:bg-gray-800
            rounded-xl shadow-2xl
            border border-gray-200 dark:border-gray-700
            overflow-hidden z-50
            animate-slide-down
          `.trim()}
          role="menu"
        >
          {items.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              No items
            </div>
          ) : (
            <div className="py-1">
              {items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id || index}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm
                      transition disabled:opacity-50 disabled:cursor-not-allowed
                      ${item.danger
                        ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `.trim()}
                    role="menuitem"
                  >
                    {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;