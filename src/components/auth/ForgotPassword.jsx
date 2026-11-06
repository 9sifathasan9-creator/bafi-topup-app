import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../utils/constants';
import { isValidEmail } from '../../utils/validators';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  // ============================================
  // 📤 Handle Submit
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError(t('invalidEmail') || 'Please enter a valid email');
      return;
    }

    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);

    if (result.success) {
      setSent(true);
      notifySuccess(t('resetLinkSent') || 'Reset link sent to your email!');
    } else {
      const errMsg = result.error || t('resetFailed') || 'Failed to send reset link';
      setError(errMsg);
      notifyError(errMsg);
    }
  };

  // ============================================
  // ✅ Success View
  // ============================================
  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
        <div className="gaming-card w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {t('emailSent') || 'Email Sent!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            {t('resetLinkSentTo') || 'We have sent a reset link to'}{' '}
            <span className="font-semibold text-purple-600">{email}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            {t('checkInbox') || "Didn't receive the email? Check your spam folder."}
          </p>
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToLogin') || 'Back to Login'}
          </Link>
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
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t('forgotPassword') || 'Forgot Password?'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            {t('forgotPasswordDesc') || 'Enter your email to receive reset link'}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('email') || 'Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-800 dark:text-white"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('sending') || 'Sending...'}
              </>
            ) : (
              t('sendResetLink') || 'Send Reset Link'
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

export default ForgotPassword;