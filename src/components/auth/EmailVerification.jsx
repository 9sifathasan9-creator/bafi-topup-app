import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../utils/constants';

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { notifySuccess, notifyError, notifyInfo } = useNotifications();

  const emailFromState = location.state?.email || user?.email || '';
  const [email] = useState(emailFromState);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // ============================================
  // ⏱️ Resend Timer Countdown
  // ============================================
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  // ============================================
  // 🔄 Check Verification Status
  // ============================================
  useEffect(() => {
    if (!user) return;

    if (user.email_confirmed_at) {
      setVerified(true);
      notifySuccess(t('emailVerified') || 'Email verified!');
      setTimeout(() => navigate(ROUTES.USER_DASHBOARD, { replace: true }), 2000);
    }
  }, [user, navigate, notifySuccess, t]);

  // ============================================
  // 📧 Resend Verification Email
  // ============================================
  const handleResend = async () => {
    if (!email) {
      notifyError(t('emailNotFound') || 'Email not found');
      return;
    }

    if (!canResend) {
      notifyInfo(
        t('waitBeforeResend') || `Please wait ${resendTimer}s before resending`
      );
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}${ROUTES.USER_DASHBOARD}`,
        },
      });

      if (error) throw error;

      notifySuccess(t('verificationEmailSent') || 'Verification email sent!');
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      console.error('Resend error:', err);
      notifyError(err.message || t('resendFailed') || 'Failed to resend email');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 🔍 Check Verification Manually
  // ============================================
  const handleCheckVerification = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (data.user?.email_confirmed_at) {
        setVerified(true);
        notifySuccess(t('emailVerified') || 'Email verified!');
        setTimeout(() => navigate(ROUTES.USER_DASHBOARD, { replace: true }), 1500);
      } else {
        notifyInfo(t('emailNotVerified') || 'Email not verified yet. Check your inbox.');
      }
    } catch (err) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ✅ Verified View
  // ============================================
  if (verified) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
        <div className="gaming-card w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {t('emailVerified') || 'Email Verified!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            {t('redirectingToDashboard') || 'Redirecting to dashboard...'}
          </p>
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // ============================================
  // 📧 Default View
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
            {t('verifyEmail') || 'Verify Your Email'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            {t('verifyEmailDesc') || 'We sent a verification link to your email'}
          </p>
        </div>

        {/* Email Display */}
        {email && (
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {t('emailSentTo') || 'Email sent to'}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                  {email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-6 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 dark:text-purple-400 text-xs font-bold">1</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('step1CheckInbox') || 'Check your email inbox'}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 dark:text-purple-400 text-xs font-bold">2</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('step2ClickLink') || 'Click the verification link'}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 dark:text-purple-400 text-xs font-bold">3</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('step3ComeBack') || 'Come back and click "I\'ve verified"'}
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-700 dark:text-yellow-200 text-xs">
              {t('checkSpam') || "Didn't receive it? Check your spam or junk folder."}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCheckVerification}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('checking') || 'Checking...'}
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                {t('iveVerified') || "I've Verified"}
              </>
            )}
          </button>

          <button
            onClick={handleResend}
            disabled={loading || !canResend}
            className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {canResend
              ? t('resendEmail') || 'Resend Email'
              : `${t('resendIn') || 'Resend in'} ${resendTimer}s`}
          </button>
        </div>

        {/* Footer */}
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

export default EmailVerification;