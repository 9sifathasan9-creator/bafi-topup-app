import React, { useState } from 'react';
import { Star } from 'lucide-react';

// ============================================
// ⭐ Rating Stars Component
// ============================================
// রেটিং দেখানো ও ইনপুট নেওয়ার জন্য
// Interactive ও Read-only দুটোই সাপোর্ট করে

const RatingStars = ({
  rating = 0,
  maxRating = 5,
  size = 'md',              // sm | md | lg | xl
  interactive = false,      // true হলে ক্লিক করা যাবে
  onChange,                 // interactive হলে কলব্যাক
  showValue = false,        // সংখ্যাও দেখাবে কিনা
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  // ============================================
  // 📏 Size Classes
  // ============================================
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  // ============================================
  // 🎯 Handle Click (Interactive)
  // ============================================
  const handleClick = (starValue) => {
    if (!interactive) return;
    onChange?.(starValue);
  };

  // ============================================
  // 🖱️ Handle Hover (Interactive)
  // ============================================
  const handleMouseEnter = (starValue) => {
    if (!interactive) return;
    setHoverRating(starValue);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  // ============================================
  // 🎨 Determine Star Fill
  // ============================================
  const displayRating = hoverRating || rating;

  const getStarClass = (starIndex) => {
    const isFilled = starIndex <= Math.round(displayRating);
    return isFilled
      ? 'text-yellow-500 fill-current'
      : 'text-gray-300 dark:text-gray-600';
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {/* Stars */}
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={handleMouseLeave}
        role={interactive ? 'radiogroup' : 'img'}
        aria-label={`Rating: ${rating} out of ${maxRating}`}
      >
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((starIndex) => (
          <button
            key={starIndex}
            type="button"
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            disabled={!interactive}
            className={`
              ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
              transition-transform duration-150
              focus:outline-none
              disabled:cursor-default
            `.trim()}
            aria-label={`${starIndex} star${starIndex > 1 ? 's' : ''}`}
            aria-checked={Math.round(rating) === starIndex}
            role={interactive ? 'radio' : undefined}
          >
            <Star className={`${sizeClasses[size]} ${getStarClass(starIndex)}`} />
          </button>
        ))}
      </div>

      {/* Value */}
      {showValue && (
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;