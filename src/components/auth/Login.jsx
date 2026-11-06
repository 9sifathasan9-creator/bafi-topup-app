import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Clock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { ADMIN_EMAIL } from '../../supabaseClient';
import { ROUTES } from '../../utils/constants';
import { isValidEmail } from '../../utils/validators';

const Login = () => {
  const navigate = useNavigate();
  const {
    loginWithRateLimit,
    isLocked,
    lockTimer,
    attemptsLeft,
    isAuthenticated,
    user,
    isAdmin,
  } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ============================================
  // 🔄 Already Logged In → Redirect
  // ============================================
  React.useEffect(() => {
    if (isAuthenticated && user) {
      navigate(isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD, {
        replace: true,
      });
    }
  }, [isAuthenticated, user, isAdmin, navigate]);

  // ============================================
  // 🔐 Handle Login
  // ============================================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!isValidEmail(email)) {
      setError(t('invalidEmail') || 'Please enter a valid email');
      return;
    }

    if (!password || password.length < 6) {
      setError(t('password') + ' must be at least 6 characters');
      return;
    }

    setLoading(true);

    // Rate-limited login (only admin allowed)
    const result = await loginWithRateLimit(email, password, true);

    setLoading(false);

    if (result.success) {
      // সফল → role অনুযায়ী রিডাইরেক্ট
      const targetPath =
        result.user?.email === ADMIN_EMAIL
          ? ROUTES.ADMIN_DASHBOARD
          : ROUTES.USER_DASHBOARD;
      navigate(targetPath, { replace: true });
    } else {
      setError(result.error || t('invalidCredentials'));
    }
  };

  // ============================================
  // ⏱️ Format Lock Time
  // ============================================
  const formatLockTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="gaming-card w-full max-w-md p-8">
        {/* ============================================
            Header
            ============================================ */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t('adminLogin') || 'Admin Login'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            {t('accessDashboard') || 'Access the admin dashboard'}
          </p>
        </div>

        {/* ============================================
            Error Alert
            ============================================ */}
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-3 rounded-lg animate-slide-down">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 dark:text-red-200 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* ============================================
            Lock Alert
            ============================================ */}
        {isLocked && (
          <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 animate-pulse" />
              <div className="flex-1">
                <p className="text-yellow-700 dark:text-yellow-200 text-sm font-semibold">
                  {t('accountLocked') || 'Account Locked'}
                </p>
                <p className="text-yellow-600 dark:text-yellow-300 text-xs mt-0.5">
                  {t('tryAgainIn') || 'Try again in'}: {formatLockTime(lockTimer)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================
            Form
            ============================================ */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('adminEmail') || 'Admin Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bafi.gd"
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-800 dark:text-white placeholder:text-gray-400"
                required
                disabled={isLocked || loading}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('password') || 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-800 dark:text-white placeholder:text-gray-400"
                required
                disabled={isLocked || loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Attempts Left */}
          {!isLocked && attemptsLeft < 5 && attemptsLeft > 0 && (
            <p className="text-xs text-red-500 text-center">
              {t('attempts') || 'Attempts'}: {attemptsLeft}/5
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLocked || loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('loggingIn') || 'Logging in...'}
              </>
            ) : (
              t('signIn') || 'Sign In'
            )}
          </button>
        </form>

        {/* ============================================
            Footer
            ============================================ */}
        <div className="mt-6 text-center space-y-2">
          <Link
            to={ROUTES.HOME}
            className="block text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
          >
            ← {t('back') || 'Back to'} {t('home') || 'Home'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;