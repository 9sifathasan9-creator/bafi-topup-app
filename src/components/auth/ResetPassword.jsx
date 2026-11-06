import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../utils/constants';
import { isValidPassword, getPasswordStrength } from '../../utils/validators';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // ============================================
  // 🔐 Handle Reset
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidPassword(password)) {
      setError(t('weakPassword') || 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError(t('passwordMismatch') || 'Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      notifySuccess(t('passwordChanged') || 'Password changed successfully!');
      setTimeout(() => navigate(ROUTES.LOGIN, { replace: true }), 2500);
    } else {
      const errMsg = result.error || t('passwordResetFailed') || 'Failed to reset password';
      setError(errMsg);
      notifyError(errMsg);
    }
  };

  // ============================================
  // 🔒 Password Strength
  // ============================================
  const strength = getPasswordStrength(password);

  const strengthColorClass = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    gray: 'bg-gray-300',
  }[strength.color] || 'bg-gray-300';

  const strengthWidth = {
    0: '0%',
    1: '15%',
    2: '30%',
    3: '45%',
    4: '60%',
    5: '75%',
    6: '90%',
    7: '100%',
  }[strength.score] || '0%';

  // ============================================
  // ✅ Success View
  // ============================================
  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
        <div className="gaming-card w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {t('passwordChanged') || 'Password Changed!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            {t('redirectingToLogin') || 'Redirecting to login...'}
          </p>
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // ============================================
  // 📝 Form View
  // ============================================
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="gaming-card w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t('resetPassword') || 'Reset Password'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            {t('setNewPassword') || 'Set your new password'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 dark:text-red-200 text-sm">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('newPassword') || 'New Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-800 dark:text-white"
                required
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Strength Bar */}
            {password && (
              <div className="mt-2">
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strengthColorClass}`}
                    style={{ width: strengthWidth }}
                  />
                </div>
                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400 capitalize">
                  {t('strength') || 'Strength'}: {strength.label}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('confirmPassword') || 'Confirm Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-800 dark:text-white"
                required
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword && password === confirmPassword && (
              <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Passwords match
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('updating') || 'Updating...'}
              </>
            ) : (
              t('resetPassword') || 'Reset Password'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToLogin') || 'Back to Login'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;