import React, { useState, useRef, useEffect } from 'react';

// ============================================
// 💬 Reusable Tooltip Component
// ============================================
// হোভার বা ক্লিকে ছোট টেক্সট দেখায়

const Tooltip = ({
  children,
  content,
  position = 'top',         // top | bottom | left | right
  delay = 200,
  disabled = false,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);
  const wrapperRef = useRef(null);

  // ============================================
  // 🎯 Show Tooltip
  // ============================================
  const showTooltip = () => {
    if (disabled) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  // ============================================
  // ❌ Hide Tooltip
  // ============================================
  const hideTooltip = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  // ============================================
  // 🧹 Cleanup
  // ============================================
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // ============================================
  // 🎨 Position Classes
  // ============================================
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  // ============================================
  // ➡️ Arrow Classes
  // ============================================
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800 dark:border-t-gray-700 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 dark:border-b-gray-700 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800 dark:border-l-gray-700 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800 dark:border-r-gray-700 border-y-transparent border-l-transparent',
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {isVisible && content && (
        <div
          role="tooltip"
          className={`
            absolute z-50 px-3 py-1.5 text-xs font-medium text-white
            bg-gray-800 dark:bg-gray-700 rounded-lg shadow-lg
            whitespace-nowrap pointer-events-none
            animate-fade-in
            ${positionClasses[position] || positionClasses.top}
          `.trim()}
        >
          {content}
          {/* Arrow */}
          <span
            className={`
              absolute w-0 h-0 border-4
              ${arrowClasses[position] || arrowClasses.top}
            `.trim()}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;