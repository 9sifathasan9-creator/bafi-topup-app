import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Shield, LogOut, Wallet, Home, Gamepad2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { useWallet } from '../../hooks/useWallet';
import { ROUTES } from '../../utils/constants';
import LanguageToggle from '../toggles/LanguageToggle';
import ThemeToggle from '../toggles/ThemeToggle';
import NotificationBell from '../notifications/NotificationBell';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { t } = useLanguage();
  const { formattedBalance } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/90 dark:bg-white/10 backdrop-blur-lg border-b border-gray-200 dark:border-white/20 sticky top-0 z-50 shadow-sm dark:shadow-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to={ROUTES.HOME} className="flex items-center space-x-2 flex-shrink-0">
            <img src="/icon-192.png" alt="BAFI Topup" className="w-8 h-8 rounded-lg shadow-sm object-cover" />
            <span className="text-slate-800 dark:text-white font-bold text-base sm:text-lg">BAFI Topup</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link to={ROUTES.HOME} className={`flex items-center gap-1 px-3 py-2 rounded-lg transition ${isActive(ROUTES.HOME) ? 'bg-gray-100 dark:bg-white/20 text-purple-600 dark:text-white font-bold' : 'text-slate-600 dark:text-white/80 hover:text-slate-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-white/10'}`}>
              <Home className="w-4 h-4" /><span>{t('home') || 'Home'}</span>
            </Link>
            <Link to={ROUTES.GAMES} className={`flex items-center gap-1 px-3 py-2 rounded-lg transition ${isActive(ROUTES.GAMES) ? 'bg-gray-100 dark:bg-white/20 text-purple-600 dark:text-white font-bold' : 'text-slate-600 dark:text-white/80 hover:text-slate-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-white/10'}`}>
              <Gamepad2 className="w-4 h-4" /><span>{t('games') || 'Games'}</span>
            </Link>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {isAuthenticated && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-white/10 rounded-lg">
                <Wallet className="w-3.5 h-3.5 text-slate-600 dark:text-white" />
                <span className="text-slate-800 dark:text-white font-semibold text-xs">{formattedBalance}</span>
              </div>
            )}
            
            {isAuthenticated && <NotificationBell />}
            <LanguageToggle />
            <ThemeToggle />

            <div className="hidden md:flex items-center space-x-1.5 ml-1">
              {isAuthenticated ? (
                <>
                  <Link to={ROUTES.USER_DASHBOARD} className="p-1.5 text-slate-600 dark:text-white/80 hover:text-purple-600 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition" title="Dashboard"><User className="w-5 h-5" /></Link>
                  {isAdmin && <Link to={ROUTES.ADMIN_DASHBOARD} className="p-1.5 text-slate-600 dark:text-white/80 hover:text-purple-600 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition" title="Admin"><Shield className="w-5 h-5" /></Link>}
                  <button onClick={handleLogout} className="p-1.5 text-slate-600 dark:text-white/80 hover:text-red-500 hover:bg-gray-100 dark:hover:text-red-400 dark:hover:bg-white/10 rounded-lg transition" title="Logout"><LogOut className="w-5 h-5" /></button>
                </>
              ) : (
                <Link to={ROUTES.LOGIN} className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition text-sm font-medium">{t('login') || 'Login'}</Link>
              )}
            </div>

            {!isAuthenticated && (
              <Link to={ROUTES.LOGIN} className="md:hidden px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-lg shadow-sm">
                {t('login') || 'Login'}
              </Link>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1.5 text-slate-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-white/20 absolute w-full shadow-2xl">
          <div className="px-4 py-3 space-y-1">
            <Link to={ROUTES.HOME} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition">🏠 {t('home') || 'Home'}</Link>
            <Link to={ROUTES.GAMES} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition">⚡ {t('topup') || 'Top Up'}</Link>
            <Link to={ROUTES.WALLET} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition">💰 {t('wallet') || 'Wallet'}</Link>
            <Link to={ROUTES.ORDERS} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition">🧾 {t('transactions') || 'Transactions'}</Link>
            <Link to={ROUTES.USER_PROFILE} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-700 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition">👤 {t('account') || 'Account'}</Link>
            
            {isAuthenticated && (
              <>
                <div className="h-px bg-gray-200 dark:bg-white/10 my-2"></div>
                {isAdmin && <Link to={ROUTES.ADMIN_DASHBOARD} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-orange-500 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition font-bold">🛡️ {t('adminDashboard') || 'Admin Panel'}</Link>}
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition">🚪 {t('logout') || 'Logout'}</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
