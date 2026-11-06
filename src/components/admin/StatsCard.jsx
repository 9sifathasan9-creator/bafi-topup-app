import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../ui/Card';

const StatsCard = ({ icon: Icon, label, value, change, trend, color = 'purple' }) => {
  const colorConfig = {
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
    green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
    yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' },
    red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
  };
  const config = colorConfig[color] || colorConfig.purple;
  const TrendIcon = trend === 'down' ? TrendingDown : TrendingUp;

  return (
    <Card variant="gaming" padding="md" hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
          {change !== undefined && (
            <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${trend === 'down' ? 'text-red-500' : 'text-green-500'}`}>
              <TrendIcon className="w-3 h-3" />
              <span>{change}%</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
            <Icon className={`w-6 h-6 ${config.text}`} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;
