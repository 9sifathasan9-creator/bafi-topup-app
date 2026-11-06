import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Gamepad2, ShoppingCart, CreditCard, Users, Bell, Settings, LogOut, Shield, Send, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { ROUTES } from '../../utils/constants';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const { t } = useLanguage();

  const menu = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard') || 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
    { id: 'analytics', icon: BarChart3, label: t('analytics') || 'Analytics', path: ROUTES.ADMIN_ANALYTICS },
    { id: 'games', icon: Gamepad2, label: t('games') || 'Games', path: ROUTES.ADMIN_GAMES },
    { id: 'orders', icon: ShoppingCart, label: t('orders') || 'Orders', path: ROUTES.ADMIN_ORDERS },
    { id: 'transactions', icon: CreditCard, label: t('transactions') || 'Transactions', path: ROUTES.ADMIN_TRANSACTIONS },
    { id: 'withdrawals', icon: Send, label: 'Withdrawals', path: '/admin/withdrawals' },
    { id: 'users', icon: Users, label: t('users') || 'Users', path: ROUTES.ADMIN_USERS },
    { id: 'notices', icon: Bell, label: t('notices') || 'Notices', path: ROUTES.ADMIN_NOTICES },
    { id: 'settings', icon: Settings, label: t('settings') || 'Settings', path: ROUTES.ADMIN_SETTINGS },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed lg:static top-0 left-0 z-50 w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-white">{t('adminPanel') || 'Admin Panel'}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">BAFI Gaming</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={item.id} to={item.path} onClick={onClose} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${active ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
            <LogOut className="w-4 h-4" /><span>{t('logout') || 'Logout'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
