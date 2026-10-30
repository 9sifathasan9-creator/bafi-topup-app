import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../utils/constants';
import {
  isValidEmail,
  isValidPhone,
  isValidName,
  isValidPassword,
  getPasswordStrength,
} from '../../utils/validators';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();
  const { notifySuccess, notifyError } = useNotifications();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // ============================================
  // 📝 Handle Input Change
  // ============================================
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // সেই ফিল্ডের error মুছে ফেলি
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // ============================================
  // ✅ Validate Form
  // ============================================
  const validateForm = () => {
    const errors = {};

    if (!isValidName(form.fullName)) {
      errors.fullName = t('invalidName') || 'Name must be 2-100 characters';
    }

    if (!isValidEmail(form.email)) {
      errors.email = t('invalidEmail') || 'Please enter a valid email';
    }

    if (!isValidPhone(form.phone)) {
      errors.phone = t('invalidPhone') || 'Enter a valid Bangladeshi phone (01XXXXXXXXX)';
    }

    if (!isValidPassword(form.password)) {
      errors.password = t('weakPassword') || 'Password must be at least 6 characters';
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = t('passwordMismatch') || 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ============================================
  // 📤 Handle Submit
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    const result = await register(form.email, form.password, {
      full_name: form.fullName.trim(),
      phone: form.phone.trim(),
      role: 'user',
    });

    setLoading(false);

    if (result.success) {
      notifySuccess(t('accountCreated') || 'Account created successfully!');
      // Supabase email verification দরকার হলে
      if (result.user && !result.user.email_confirmed_at) {
        // Verify Email পেজে পাঠাই
        navigate(ROUTES.VERIFY_EMAIL, {
          state: { email: form.email },
          replace: true,
        });
      } else {
        navigate(ROUTES.USER_DASHBOARD, { replace: true });
      }
    } else {
      const errMsg = result.error || t('registrationFailed') || 'Registration failed';
      setError(errMsg);
      notifyError(errMsg);
    }
  };

  // ============================================
  // 🔒 Password Strength
  // ============================================
  const strength = getPasswordStrength(form.password);

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

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="gaming-card w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t('register') || 'Create Account'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            {t('signUpToStart') || 'Sign up to start using BAFI Gaming'}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('fullName') || 'Full Name'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-800 dark:text-white"
                required
                disabled={loading}
                autoComplete="name"
              />
            </div>
            {fieldErrors.fullName && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('email') || 'Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-800 dark:text-white"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('phoneNumber') || 'Phone Number'}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-800 dark:text-white"
                required
                disabled={loading}
                autoComplete="tel"
              />
            </div>
            {fieldErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
            )}
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
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
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

            {/* Password Strength Bar */}
            {form.password && (
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

            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
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
                value={form.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
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
            {form.confirmPassword && form.password === form.confirmPassword && (
              <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Passwords match
              </p>
            )}
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
            <input
              type="checkbox"
              required
              className="mt-0.5 accent-purple-600"
            />
            <span>
              {t('agreeToTerms') || 'I agree to the'}{' '}
              <Link to={ROUTES.TERMS} className="text-purple-600 hover:underline">
                {t('termsOfService') || 'Terms'}
              </Link>{' '}
              &{' '}
              <Link to={ROUTES.PRIVACY} className="text-purple-600 hover:underline">
                {t('privacyPolicy') || 'Privacy Policy'}
              </Link>
            </span>
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
                {t('creatingAccount') || 'Creating account...'}
              </>
            ) : (
              t('signUp') || 'Sign Up'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {t('alreadyHaveAccount') || 'Already have an account?'}{' '}
          </span>
          <Link
            to={ROUTES.LOGIN}
            className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
          >
            {t('signIn') || 'Sign In'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;