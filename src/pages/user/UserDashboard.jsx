import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Package, Heart, Ticket, Gift, Headphones, ChevronRight, Gamepad2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../hooks/useWallet';
import { useOrders } from '../../hooks/useOrders';
import { ROUTES } from '../../utils/constants';
import Card from '../../components/ui/Card';
import WalletCard from '../../components/wallet/WalletCard';

const UserDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { balance, formattedBalance, totalDeposited, totalSpent } = useWallet();
  const { totalOrders, pendingOrders } = useOrders();

  const quickLinks = [
    { icon: Package, label: t('myOrders') || 'My Orders', path: ROUTES.ORDERS, color: 'blue', count: totalOrders },
    { icon: Heart, label: t('favorites') || 'Favorites', path: ROUTES.FAVORITES, color: 'red' },
    { icon: Ticket, label: t('coupons') || 'Coupons', path: ROUTES.COUPONS, color: 'purple' },
    { icon: Gift, label: t('referEarn') || 'Refer & Earn', path: ROUTES.REFERRAL, color: 'pink' },
    { icon: Headphones, label: t('support') || 'Support', path: ROUTES.SUPPORT, color: 'green' },
    { icon: Gamepad2, label: t('browseGames') || 'Browse Games', path: ROUTES.GAMES, color: 'yellow' },
  ];

  const colorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">
            {t('welcomeBack') || 'Welcome back'}! 👋
          </h1>
          <p className="text-white/70 text-sm">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
          </p>
        </div>

        <div className="mb-6">
          <WalletCard balance={balance} totalDeposited={totalDeposited} totalSpent={totalSpent} />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card variant="gaming" padding="sm" className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('totalOrders') || 'Total Orders'}</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">{totalOrders}</p>
          </Card>
          <Card variant="gaming" padding="sm" className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('pending') || 'Pending'}</p>
            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{pendingOrders}</p>
          </Card>
          <Card variant="gaming" padding="sm" className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('balance') || 'Balance'}</p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">{formattedBalance}</p>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-3">{t('quickActions') || 'Quick Actions'}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.path} to={link.path}>
                  <Card variant="gaming" padding="md" hover clickable className="h-full">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[link.color]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                          {link.label}
                        </p>
                        {link.count !== undefined && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{link.count}</p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
