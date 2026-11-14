import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Clock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useLanguage } from '../../context/LanguageContext';
import { ROUTES } from '../../utils/constants';
import { isValidEmail } from '../../utils/validators';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError(t('invalidEmail') || 'Please enter a valid email');
      return;
    }

    setLoading(true);

    // সরাসরি Supabase Auth দিয়ে লগইন
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (authError || !data.user) {
      setError(authError.message || t('invalidCredentials') || 'Invalid credentials');
      return;
    }

    // লগইন সফল হলে ইমেইল চেক করে রিডাইরেক্ট
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    if (data.user.email === adminEmail) {
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
    } else {
      navigate(ROUTES.USER_DASHBOARD, { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="gaming-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Login</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 dark:text-red-200 text-sm">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 dark:text-white" required disabled={loading} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 dark:text-white" required disabled={loading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Logging in...</> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Don't have an account? </span>
          <Link to={ROUTES.REGISTER} className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
