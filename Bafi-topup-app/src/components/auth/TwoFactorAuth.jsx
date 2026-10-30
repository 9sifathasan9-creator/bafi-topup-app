import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, CheckCircle, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../utils/constants';

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();

  // ৬ ডিজিট OTP ইনপুট
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // ইনপুট রেফারেন্স
  const inputRefs = useRef([]);

  // ============================================
  // ⏱️ Resend Timer
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
  // 🎯 Auto Focus First Input
  // ============================================
  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, []);

  // ============================================
  // 📝 Handle OTP Input Change
  // ============================================
  const handleChange = (index, value) => {
    // শুধু সংখ্যা অনুমোদন
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto focus পরের ইনপুটে
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ============================================
  // ⌨️ Handle Backspace
  // ============================================
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ============================================
  // 📋 Handle Paste
  // ============================================
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newOtp = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    // শেষ ইনপুটে focus
    const lastIndex = Math.min(pasted.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  // ============================================
  // ✅ Verify OTP
  // ============================================
  const handleVerify = async (e) => {
    e?.preventDefault();
    setError('');

    const code = otp.join('');
    if (code.length !== 6) {
      setError(t('enterFullCode') || 'Please enter the full 6-digit code');
      return;
    }

    if (!user?.email) {
      setError(t('userNotFound') || 'User not found');
      return;
    }

    setLoading(true);

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: user.email,
        token: code,
        type: 'email',
      });

      if (verifyError) throw verifyError;

      if (data?.session || data?.user) {
        setSuccess(true);
        notifySuccess(t('verified') || 'Verified successfully!');

        setTimeout(() => {
          navigate(isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD, {
            replace: true,
          });
        }, 1500);
      } else {
        throw new Error(t('invalidCode') || 'Invalid code');
      }
    } catch (err) {
      console.error('2FA verify error:', err);
      const errMsg = err.message || t('invalidCode') || 'Invalid verification code';
      setError(errMsg);
      notifyError(errMsg);

      // ভুল হলে ক্লিয়ার করি
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 🔄 Resend OTP
  // ============================================
  const handleResend = async () => {
    if (!canResend || !user?.email) return;

    setLoading(true);
    try {
      const { error: resendError } = await supabase.auth.signInWithOtp({
        email: user.email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (resendError) throw resendError;

      notifySuccess(t('codeResent') || 'New code sent to your email!');
      setResendTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error('Resend error:', err);
      notifyError(err.message || t('resendFailed') || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

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
            {t('verified') || 'Verified!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            {t('redirecting') || 'Redirecting...'}
          </p>
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="gaming-card w-full max-w-md p-8">
        {/* ============================================
            Header
            ============================================ */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t('twoFactorAuth') || 'Two-Factor Auth'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            {t('enterOtpDesc') || 'Enter the 6-digit code from your email'}
          </p>
        </div>

        {/* Email Display */}
        {user?.email && (
          <div className="mb-6 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg text-center">
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {t('codeSentTo') || 'Code sent to'}
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate mt-0.5">
              {user.email}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 dark:text-red-200 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* ============================================
            OTP Input Boxes
            ============================================ */}
        <form onSubmit={handleVerify}>
          <div className="flex justify-center gap-2 sm:gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-11 h-14 sm:w-12 sm:h-14 text-center text-2xl font-bold bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-gray-800 dark:text-white"
                disabled={loading || success}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('verifying') || 'Verifying...'}
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                {t('verify') || 'Verify'}
              </>
            )}
          </button>

          {/* Resend Button */}
          <button
            type="button"
            onClick={handleResend}
            disabled={loading || !canResend}
            className="w-full py-2 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {canResend
              ? t('resendCode') || 'Resend Code'
              : `${t('resendIn') || 'Resend in'} ${resendTimer}s`}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToLogin') || 'Back to Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;