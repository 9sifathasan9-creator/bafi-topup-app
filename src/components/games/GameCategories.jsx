import React from 'react';
import { Grid3x3 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { GAME_CATEGORIES } from '../../utils/constants';

// ============================================
// 🗂️ Game Categories Component
// ============================================
// ক্যাটাগরি সিলেক্ট করার হরাইজন্টাল স্ক্রলযোগ্য লিস্ট

const GameCategories = ({
  selectedCategory = 'all',
  onSelect,
  variant = 'horizontal',    // horizontal | grid | pills
  showIcons = true,
  showCounts = false,
  categoryCounts = {},       // { 'battle-royale': 5, 'moba': 3 }
  className = '',
}) => {
  const { t, language } = useLanguage();

  // ============================================
  // 🌐 Get Category Name (Language Based)
  // ============================================
  const getCategoryName = (cat) => {
    return language === 'bn' ? cat.nameBn : cat.name;
  };

  // ============================================
  // 🎯 Handle Select
  // ============================================
  const handleSelect = (catId) => {
    onSelect?.(catId);
  };

  // ============================================
  // ➡️ Horizontal Variant (Default)
  // ============================================
  if (variant === 'horizontal') {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {GAME_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl
                  whitespace-nowrap font-semibold text-sm
                  transition-all duration-200 flex-shrink-0
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-white/10 backdrop-blur-lg text-white/80 hover:bg-white/20 hover:text-white border border-white/20'
                  }
                `.trim()}
              >
                {showIcons && <span className="text-base">{cat.icon}</span>}
                <span>{getCategoryName(cat)}</span>
                {showCounts && count > 0 && (
                  <span
                    className={`
                      min-w-[20px] h-5 px-1.5 text-[10px] font-bold
                      rounded-full flex items-center justify-center
                      ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-purple-500/20 text-purple-300'
                      }
                    `.trim()}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ============================================
  // 🔲 Grid Variant
  // ============================================
  if (variant === 'grid') {
    return (
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 ${className}`}
      >
        {GAME_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`
                flex flex-col items-center justify-center gap-2 p-4
                rounded-xl font-semibold text-sm
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-white/10 backdrop-blur-lg text-white/80 hover:bg-white/20 hover:text-white border border-white/20'
                }
              `.trim()}
            >
              {showIcons && <span className="text-3xl">{cat.icon}</span>}
              <span className="text-center leading-tight">
                {getCategoryName(cat)}
              </span>
              {showCounts && count > 0 && (
                <span
                  className={`
                    text-xs font-bold
                    ${isActive ? 'text-white/80' : 'text-purple-300'}
                  `.trim()}
                >
                  {count} {t('games') || 'games'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // ============================================
  // 💊 Pills Variant (Compact)
  // ============================================
  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-1.5 ${className}`}>
        {GAME_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-semibold
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }
              `.trim()}
            >
              {showIcons && <span className="mr-1">{cat.icon}</span>}
              {getCategoryName(cat)}
            </button>
          );
        })}
      </div>
    );
  }

  return null;
};

export default GameCategories;