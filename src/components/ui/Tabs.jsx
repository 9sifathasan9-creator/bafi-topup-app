import React, { useState, useEffect } from 'react';

// ============================================
// 📑 Reusable Tabs Component
// ============================================
// Tab Navigation + Content এএকসাথে

const Tabs = ({
  tabs = [],                    // [{ id, label, icon, badge, disabled }]
  activeTab,                    // Controlled (optional)
  defaultTab,                   // Uncontrolled initial tab
  onChange,                     // onChange callback
  variant = 'pills',            // pills | underline | solid | gaming
  size = 'md',                  // sm | md | lg
  fullWidth = false,
  className = '',
  children,                     // Optional custom content
}) => {
  const [internalTab, setInternalTab] = useState(
    defaultTab || tabs[0]?.id || ''
  );

  const currentTab = activeTab !== undefined ? activeTab : internalTab;

  // Sync with activeTab changes
  useEffect(() => {
    if (activeTab !== undefined) {
      setInternalTab(activeTab);
    }
  }, [activeTab]);

  // ============================================
  // 🎯 Handle Tab Change
  // ============================================
  const handleTabChange = (tabId) => {
    if (activeTab === undefined) {
      setInternalTab(tabId);
    }
    onChange?.(tabId);
  };

  // ============================================
  // 🎨 Variant Classes
  // ============================================
  const containerVariants = {
    pills: 'inline-flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl',
    underline: 'inline-flex items-center gap-1 border-b border-gray-200 dark:border-gray-700',
    solid: 'inline-flex items-center gap-1 p-1 bg-gray-900 dark:bg-black rounded-xl',
    gaming: 'inline-flex items-center gap-1 p-1 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20',
  };

  const getTabClasses = (tab, isActive) => {
    const base = `
      inline-flex items-center justify-center gap-2
      transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
      whitespace-nowrap
    `;

    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-medium rounded-lg',
      md: 'px-4 py-2 text-sm font-semibold rounded-lg',
      lg: 'px-5 py-2.5 text-base font-semibold rounded-xl',
    };

    const variantClasses = {
      pills: isActive
        ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
        : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50',

      underline: isActive
        ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 -mb-px rounded-none'
        : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border-b-2 border-transparent rounded-none',

      solid: isActive
        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
        : 'text-gray-300 hover:text-white hover:bg-white/10',

      gaming: isActive
        ? 'bg-white text-purple-600 shadow-lg'
        : 'text-white/80 hover:text-white hover:bg-white/10',
    };

    return `${base} ${sizes[size]} ${variantClasses[variant]}`;
  };

  const Icon = (tab) => tab.icon;

  return (
    <div className={className}>
      {/* ============================================
          Tab List
          ============================================ */}
      <div
        className={`
          ${containerVariants[variant] || containerVariants.pills}
          ${fullWidth ? 'w-full' : ''}
          overflow-x-auto scrollbar-hide
        `.trim()}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const TabIcon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={`
                ${getTabClasses(tab, isActive)}
                ${fullWidth ? 'flex-1' : ''}
              `.trim()}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
            >
              {TabIcon && <TabIcon className="w-4 h-4" />}
              <span>{tab.label}</span>

              {/* Badge */}
              {tab.badge !== undefined && tab.badge !== null && (
                <span
                  className={`
                    min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full
                    flex items-center justify-center
                    ${
                      isActive && (variant === 'solid' || variant === 'gaming')
                        ? 'bg-white/20 text-white'
                        : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                    }
                  `.trim()}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================
          Custom Children (optional)
          ============================================ */}
      {children}
    </div>
  );
};

// ============================================
// 📦 Tab Panel Component
// ============================================
export const TabPanel = ({ id, activeTab, children, className = '' }) => {
  if (id !== activeTab) return null;
  return (
    <div
      className={`animate-fade-in ${className}`}
      role="tabpanel"
      id={`tabpanel-${id}`}
    >
      {children}
    </div>
  );
};

export default Tabs;