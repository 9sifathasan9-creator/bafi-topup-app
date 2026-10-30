import React from 'react';

const SkeletonLoader = ({ variant = 'card', count = 1, className = '' }) => {
  const baseClass = 'bg-gray-200 dark:bg-gray-700 rounded animate-pulse';

  const renderSkeleton = (i) => {
    switch (variant) {
      case 'card':
        return (
          <div key={i} className={`gaming-card p-4 space-y-3 ${className}`}>
            <div className={`${baseClass} h-40 w-full`} />
            <div className={`${baseClass} h-4 w-3/4`} />
            <div className={`${baseClass} h-3 w-1/2`} />
            <div className="flex justify-between items-center pt-2">
              <div className={`${baseClass} h-6 w-20`} />
              <div className={`${baseClass} h-8 w-24`} />
            </div>
          </div>
        );
      case 'list':
        return (
          <div key={i} className="flex items-center gap-3 py-3">
            <div className={`${baseClass} w-10 h-10 rounded-full flex-shrink-0`} />
            <div className="flex-1 space-y-2">
              <div className={`${baseClass} h-4 w-3/4`} />
              <div className={`${baseClass} h-3 w-1/2`} />
            </div>
          </div>
        );
      case 'text':
        return (
          <div key={i} className="space-y-2">
            <div className={`${baseClass} h-4 w-full`} />
            <div className={`${baseClass} h-4 w-5/6`} />
            <div className={`${baseClass} h-4 w-4/6`} />
          </div>
        );
      case 'table':
        return (
          <div key={i} className="flex items-center gap-3 py-3 px-4">
            <div className={`${baseClass} h-4 flex-1`} />
            <div className={`${baseClass} h-4 w-20`} />
            <div className={`${baseClass} h-4 w-16`} />
          </div>
        );
      default:
        return <div key={i} className={`${baseClass} h-4 w-full`} />;
    }
  };

  return <>{Array.from({ length: count }, (_, i) => renderSkeleton(i))}</>;
};

export default SkeletonLoader;
