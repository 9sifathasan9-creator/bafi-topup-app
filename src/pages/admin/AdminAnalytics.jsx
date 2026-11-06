import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getAnalytics } from '../../supabaseClient';
import StatsCard from '../../components/admin/StatsCard';
import AnalyticsChart from '../../components/admin/AnalyticsChart';
import RevenueChart from '../../components/admin/RevenueChart';

const AdminAnalytics = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getAnalytics();
      setStats(data || {});
      setLoading(false);
    };
    load();
  }, []);

  const chartData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 19 },
    { name: 'Wed', value: 14 },
    { name: 'Thu', value: 25 },
    { name: 'Fri', value: 22 },
    { name: 'Sat', value: 30 },
    { name: 'Sun', value: 28 },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6" /> {t('analytics') || 'Analytics'}
        </h1>
        <p className="text-white/70 text-sm">{t('analyticsDesc') || 'Platform statistics'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Users} label={t('totalUsers') || 'Users'} value={stats.totalUsers || 0} color="purple" />
        <StatsCard icon={ShoppingCart} label={t('totalOrders') || 'Orders'} value={stats.totalOrders || 0} color="green" />
        <StatsCard icon={TrendingUp} label={t('totalGames') || 'Games'} value={stats.totalGames || 0} color="blue" />
        <StatsCard icon={BarChart3} label={t('transactions') || 'Txns'} value={stats.totalTransactions || 0} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AnalyticsChart data={chartData} title={t('weeklyActivity') || 'Weekly Activity'} />
        <RevenueChart data={chartData} />
      </div>
    </div>
  );
};

export default AdminAnalytics;
