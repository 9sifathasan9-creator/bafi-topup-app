import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../ui/Card';

const AnalyticsChart = ({ data = [], title }) => {
  const { t } = useLanguage();

  return (
    <Card variant="gaming" padding="md">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <h3 className="text-sm font-bold text-gray-800 dark:text-white">
          {title || t('analytics') || 'Analytics'}
        </h3>
      </div>

      <div className="h-64">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            {t('noData') || 'No data available'}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="value" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default AnalyticsChart;
