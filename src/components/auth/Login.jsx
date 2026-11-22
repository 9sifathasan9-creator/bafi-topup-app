import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Eye, EyeOff, Loader2, User, Phone, Hash } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useLanguage } from '../../context/LanguageContext';
import { ROUTES } from '../../utils/constants';
import { isValidName, isValidPhone, isValidPassword } from '../../utils/validators';

const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [transactionPin, setTransactionPin] = useState(''); // নতুন পিন স্টেট
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    if (!STRICT_EMAIL_REGEX.test(email.trim())) {
      setError('Please enter a valid email address (e.g., name@gmail.com)');
      return;
    }

    if (mode === 'register') {
      if (!isValidName(fullName)) { setError('Please enter your full name'); return; }
      if (!isValidPhone(phone)) { setError('Please enter a valid phone number'); return; }
      if (!isValidPassword(password)) { setError('Password must be at least 6 characters'); return; }
      if (transactionPin.length !== 4 || !/^\d+$/.test(transactionPin)) { 
        setError('Transaction PIN must be exactly 4 digits'); 
        return; 
      }
    }

    setLoading(true);

    if (mode === 'login') {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      setLoading(false);

      if (authError || !data.user) {
        setError(authError.message || 'Invalid credentials');
        return;
      }

      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      if (data.user.email === adminEmail) {
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.USER_DASHBOARD, { replace: true });
      }
    } else {
      // Registration with PIN
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { 
            full_name: fullName.trim(), 
            phone: phone.trim(),
            transaction_pin: transactionPin // পিন মেটাডাটায় পাঠানো হলো
          }
        }
      });
      setLoading(false);

      if (authError) {
        setError(authError.message);
        return;
      }
      
      if (data.session) {
        navigate(ROUTES.USER_DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.LOGIN, { replace: true });
        setError('Please check your email to confirm your account.');
      }
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/user`
      }
    });
    if (error) {
      setError(error.message);
      setSocialLoading('');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="gaming-card w-full max-w-md p-6 sm:p-8">
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/30 p-1">
            <img src="/icon-192.png" alt="BAFI Topup" className="w-full h-full rounded-xl object-cover" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">
            {mode === 'login' ? 'Sign in to your account' : 'Join BAFI Topup today'}
          </p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-2">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${mode === 'login' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
          >
            Log In / লগ ইন
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${mode === 'register' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
          >
            Sign Up / সাইন আপ
          </button>
        </div>

        <div className="flex justify-between px-1 mb-5">
          <p className="text-[10px] text-gray-400 dark:text-gray-300 font-medium w-1/2 text-center">For existing users / পুরনো ইউজারদের জন্য</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-300 font-medium w-1/2 text-center">For new users / নতুন ইউজারদের জন্য</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 dark:text-red-200 text-xs">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name / পূর্ণ নাম</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm text-gray-800 dark:text-white" required disabled={loading} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number / ফোন নম্বর</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm text-gray-800 dark:text-white" required disabled={loading} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">4-Digit Transaction PIN / ৪ ডিজিটের পিন</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="password" 
                    maxLength={4}
                    value={transactionPin} 
                    onChange={(e) => setTransactionPin(e.target.value.replace(/\D/g, ''))} 
                    placeholder="••••" 
                    className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm text-gray-800 dark:text-white tracking-widest" 
                    required 
                    disabled={loading} 
                  />
                </div>
                {/* সতর্কবার্তা */}
                <p className="text-[10px] text-orange-500 dark:text-orange-400 mt-1.5 leading-relaxed bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                  এটি আপনার বিকাশ, নগদ কিংবা অন্য কোন মোবাইল ব্যাংকিং এর পিন নয় এটি আপনার বাফি একাউন্টের পিন। টাকা ঢুকানো ব্যতীত অন্য সকল ট্রানজেকশনের পূর্বে আপনাকে এই পিন দিতে হবে। তাই এই পিনটি যত্ন সহকারে সংরক্ষণ করুন, ধন্যবাদ।
                  <br/><br/>
                  This is NOT your bKash, Nagad, or any mobile banking PIN. It is your BAFI account PIN. You must enter this PIN before all transactions EXCEPT adding money. Keep it safe, thank you.
                </p>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email / ইমেইল</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm text-gray-800 dark:text-white" required disabled={loading} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Password / পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-9 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm text-gray-800 dark:text-white" required disabled={loading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2 text-sm mt-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : mode === 'login' ? 'Log In / লগ ইন' : 'Sign Up / সাইন আপ'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
          <div className="relative flex justify-center text-xs"><span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Continue With</span></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => handleSocialLogin('google')} disabled={socialLoading === 'google'} className="flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            {socialLoading === 'google' ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            )} Google
          </button>
          <button onClick={() => handleSocialLogin('facebook')} disabled={socialLoading === 'facebook'} className="flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            {socialLoading === 'facebook' ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            )} Facebook
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
