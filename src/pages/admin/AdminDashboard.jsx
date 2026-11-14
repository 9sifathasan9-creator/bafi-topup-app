import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Gamepad2, ShoppingCart, CreditCard, TrendingUp, BarChart3, Bell, Settings } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { getAnalytics } from '../../supabaseClient';
import { ROUTES } from '../../utils/constants';
import StatsCard from '../../components/admin/StatsCard';
import AnalyticsChart from '../../components/admin/AnalyticsChart';
import RevenueChart from '../../components/admin/RevenueChart';
import Card from '../../components/ui/Card';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalGames: 0, totalOrders: 0, totalTransactions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAnalytics();
        setStats(data || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
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

  const menuItems = [
    { id: 'games', label: t('manageGames') || 'Manage Games', icon: Gamepad2, color: 'text-purple-500', path: ROUTES.ADMIN_GAMES },
    { id: 'orders', label: t('manageOrders') || 'Manage Orders', icon: ShoppingCart, color: 'text-green-500', path: ROUTES.ADMIN_ORDERS },
    { id: 'users', label: t('manageUsers') || 'Manage Users', icon: Users, color: 'text-blue-500', path: ROUTES.ADMIN_USERS },
    { id: 'notices', label: t('manageNotices') || 'Manage Notices', icon: Bell, color: 'text-pink-500', path: ROUTES.ADMIN_NOTICES },
    { id: 'settings', label: t('settings') || 'Settings', icon: Settings, color: 'text-yellow-500', path: ROUTES.ADMIN_SETTINGS },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {t('adminDashboard') || 'Admin Dashboard'}
        </h1>
        <p className="text-white/70 text-sm">
          {t('welcomeBack') || 'Welcome back'}, {user?.email?.split('@')[0]}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Users} label={t('totalUsers') || 'Total Users'} value={stats.totalUsers} color="purple" />
        <StatsCard icon={Gamepad2} label={t('totalGames') || 'Total Games'} value={stats.totalGames} color="blue" />
        <StatsCard icon={ShoppingCart} label={t('totalOrders') || 'Total Orders'} value={stats.totalOrders} color="green" />
        <StatsCard icon={CreditCard} label={t('totalTransactions') || 'Transactions'} value={stats.totalTransactions} color="yellow" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AnalyticsChart data={chartData} title={t('weeklyActivity') || 'Weekly Activity'} />
        <RevenueChart data={chartData} />
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.id} to={item.path}>
              <Card variant="gaming" padding="md" hover clickable className="text-center h-full flex flex-col items-center justify-center gap-2 py-5">
                <Icon className={`w-8 h-8 ${item.color}`} />
                <p className="text-xs font-bold text-gray-800 dark:text-white leading-tight">{item.label}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
