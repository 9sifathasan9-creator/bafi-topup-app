import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Gamepad2, ShoppingCart, CreditCard, TrendingUp, DollarSign, Package } from 'lucide-react';
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
        <h1 className="text-2xl font-bold text-white mb-1">
          {t('adminDashboard') || 'Admin Dashboard'}
        </h1>
        <p className="text-white/70 text-sm">
          {t('welcomeBack') || 'Welcome back'}, {user?.email?.split('@')[0]}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Users} label={t('totalUsers') || 'Total Users'} value={stats.totalUsers} color="purple" trend="up" change={12} />
        <StatsCard icon={Gamepad2} label={t('totalGames') || 'Total Games'} value={stats.totalGames} color="blue" trend="up" change={5} />
        <StatsCard icon={ShoppingCart} label={t('totalOrders') || 'Total Orders'} value={stats.totalOrders} color="green" trend="up" change={8} />
        <StatsCard icon={CreditCard} label={t('totalTransactions') || 'Transactions'} value={stats.totalTransactions} color="yellow" trend="down" change={-3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AnalyticsChart data={chartData} title={t('weeklyActivity') || 'Weekly Activity'} />
        <RevenueChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to={ROUTES.ADMIN_GAMES}>
          <Card variant="gaming" padding="md" hover clickable className="text-center">
            <Gamepad2 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{t('manageGames') || 'Manage Games'}</p>
          </Card>
        </Link>
        <Link to={ROUTES.ADMIN_ORDERS}>
          <Card variant="gaming" padding="md" hover clickable className="text-center">
            <ShoppingCart className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{t('manageOrders') || 'Manage Orders'}</p>
          </Card>
        </Link>
        <Link to={ROUTES.ADMIN_USERS}>
          <Card variant="gaming" padding="md" hover clickable className="text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{t('manageUsers') || 'Manage Users'}</p>
          </Card>
        </Link>
        <Link to={ROUTES.ADMIN_SETTINGS}>
          <Card variant="gaming" padding="md" hover clickable className="text-center">
            <Package className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{t('settings') || 'Settings'}</p>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
