import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Zap, Wallet, Receipt, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ROUTES } from '../../utils/constants';

const BottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', icon: Home, label: t('home') || 'Home', path: ROUTES.HOME },
    { id: 'topup', icon: Zap, label: t('topup') || 'Top Up', path: ROUTES.GAMES },
    { id: 'wallet', icon: Wallet, label: t('wallet') || 'Wallet', path: ROUTES.WALLET },
    { id: 'transactions', icon: Receipt, label: t('transactions') || 'Transactions', path: ROUTES.ORDERS },
    { id: 'account', icon: User, label: t('account') || 'Account', path: ROUTES.USER_PROFILE },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 md:hidden pb-safe">
      <div className="flex items-center justify-around px-1 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link key={item.id} to={item.path} className={`relative flex flex-col items-center justify-center gap-0.5 px-1 py-1 rounded-lg transition min-w-[50px] ${active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <Icon className={`w-5 h-5 ${active ? 'fill-current' : ''}`} />
              <span className={`text-[9px] ${active ? 'font-bold' : 'font-medium'} truncate w-full text-center`}>{item.label}</span>
              {active && <span className="absolute -top-1.5 w-5 h-1 bg-purple-600 dark:bg-purple-400 rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
