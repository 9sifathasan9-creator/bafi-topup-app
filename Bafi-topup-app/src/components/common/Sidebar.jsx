import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  X,
  Shield,
  LayoutDashboard,
  Gamepad2,
  Bell,
  Users,
  ShoppingCart,
  CreditCard,
  Settings,
  BarChart3,
  Ticket,
  Star,
  Package,
  UserCog,
  Database,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { ROUTES } from '../../utils/constants';

// ============================================
// 📂 Sidebar Component (Admin Panel)
// ============================================
// Admin ড্যাশবোর্ডের সাইড নেভিগেশন
// মোবাইলে ড্রয়ার হিসেবে কাজ করে

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();
  const { t } = useLanguage();

  // ============================================
  // 🎯 Admin Menu Items
  // ============================================
  const adminMenu = [
    { id: 'dashboard', label: t('dashboard') || 'Dashboard', icon: LayoutDashboard, path: ROUTES.ADMIN_DASHBOARD },
    { id: 'analytics', label: t('analytics') || 'Analytics', icon: BarChart3, path: ROUTES.ADMIN_ANALYTICS },
    { id: 'games', label: t('games') || 'Games', icon: Gamepad2, path: ROUTES.ADMIN_GAMES },
    { id: 'orders', label: t('orders') || 'Orders', icon: ShoppingCart, path: ROUTES.ADMIN_ORDERS },
    { id: 'transactions', label: t('transactions') || 'Transactions', icon: CreditCard, path: ROUTES.ADMIN_TRANSACTIONS },
    { id: 'users', label: t('users') || 'Users', icon: Users, path: ROUTES.ADMIN_USERS },
    { id: 'notices', label: t('notices') || 'Notices', icon: Bell, path: ROUTES.ADMIN_NOTICES },
    { id: 'coupons', label: t('coupons') || 'Coupons', icon: Ticket, path: ROUTES.ADMIN_COUPONS },
    { id: 'reviews', label: t('reviews') || 'Reviews', icon: Star, path: ROUTES.ADMIN_REVIEWS },
    { id: 'tickets', label: t('supportTickets') || 'Support Tickets', icon: Package, path: ROUTES.ADMIN_TICKETS },
    { id: 'roles', label: t('roles') || 'Roles', icon: UserCog, path: ROUTES.ADMIN_ROLES },
    { id: 'backup', label: t('backup') || 'Backup', icon: Database, path: ROUTES.ADMIN_BACKUP },
    { id: 'settings', label: t('settings') || 'Settings', icon: Settings, path: ROUTES.ADMIN_SETTINGS },
  ];

  // ============================================
  // 🔒 Body Scroll Lock
  // ============================================
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // ============================================
  // 🚪 Handle Logout
  // ============================================
  const handleLogout = async () => {
    await logout();
    onClose?.();
    navigate(ROUTES.HOME);
  };

  // ============================================
  // 🎯 Is Active?
  // ============================================
  const isActive = (path) => location.pathname === path;

  if (!isAdmin) return null;

  return (
    <>
      {/* ============================================
          Overlay (Mobile)
          ============================================ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* ============================================
          Sidebar
          ============================================ */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          w-64 h-full
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `.trim()}
      >
        {/* ============================================
            Header
            ============================================ */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-white">
                {t('adminPanel') || 'Admin Panel'}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                BAFI Gaming
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================
            Menu Items (Scrollable)
            ============================================ */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition
                  ${
                    active
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white'
                  }
                `.trim()}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ============================================
            Footer - Logout
            ============================================ */}
        <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout') || 'Logout'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;