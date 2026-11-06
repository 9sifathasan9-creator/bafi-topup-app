// ============================================
// 🔐 useAuth Hook
// ============================================
// AuthContext-এর উপরে বাড়তি সুবিধা দেয়:
// Rate limiting, login attempts tracking, role check

import { useState, useCallback, useEffect } from 'react';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../supabaseClient';

// ============================================
// ⚙️ Config
// ============================================
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 মিনিট
const STORAGE_KEY = 'bafi-login-attempts';

// ============================================
// 🎣 Main Hook
// ============================================
export const useAuth = () => {
  const auth = useAuthContext();

  // ============================================
  // 🔒 Rate Limiting State
  // ============================================
  const [loginAttempts, setLoginAttempts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return { count: 0, lockedUntil: 0 };
      const parsed = JSON.parse(saved);
      // লক টাইম শেষ হলে রিসেট
      if (parsed.lockedUntil && Date.now() > parsed.lockedUntil) {
        return { count: 0, lockedUntil: 0 };
      }
      return parsed;
    } catch {
      return { count: 0, lockedUntil: 0 };
    }
  });

  const [lockTimer, setLockTimer] = useState(0);

  // ============================================
  // 💾 Save Attempts to Storage
  // ============================================
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loginAttempts));
    } catch (err) {
      console.error('Save attempts error:', err);
    }
  }, [loginAttempts]);

  // ============================================
  // ⏱️ Lock Countdown Timer
  // ============================================
  useEffect(() => {
    if (!loginAttempts.lockedUntil) {
      setLockTimer(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.floor((loginAttempts.lockedUntil - Date.now()) / 1000)
      );
      setLockTimer(remaining);

      if (remaining === 0) {
        // লক শেষ হলে রিসেট
        setLoginAttempts({ count: 0, lockedUntil: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [loginAttempts.lockedUntil]);

  // ============================================
  // 📊 Computed
  // ============================================
  const isLocked = lockTimer > 0;
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - loginAttempts.count);

  // ============================================
  // 📈 Record Failed Attempt
  // ============================================
  const recordFailedAttempt = useCallback(() => {
    setLoginAttempts((prev) => {
      const newCount = prev.count + 1;
      if (newCount >= MAX_ATTEMPTS) {
        return {
          count: newCount,
          lockedUntil: Date.now() + LOCK_DURATION_MS,
        };
      }
      return { ...prev, count: newCount };
    });
  }, []);

  // ============================================
  // ✅ Reset Attempts
  // ============================================
  const resetAttempts = useCallback(() => {
    setLoginAttempts({ count: 0, lockedUntil: 0 });
    setLockTimer(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  // ============================================
  // 🔐 Login with Rate Limiting
  // ============================================
  const loginWithRateLimit = useCallback(
    async (email, password, requireAdmin = false) => {
      // ১. লক চেক
      if (isLocked) {
        return {
          success: false,
          error: `Account locked. Try again in ${formatLockTime(lockTimer)}`,
          isLocked: true,
        };
      }

      // ২. অ্যাডমিন ইমেইল চেক (ঐচ্ছিক)
      if (requireAdmin) {
        const cleanEmail = email.trim().toLowerCase();
        if (cleanEmail !== ADMIN_EMAIL) {
          recordFailedAttempt();
          return {
            success: false,
            error: `Access denied. Only ${ADMIN_EMAIL} can access.`,
          };
        }
      }

      // ৩. Auth দিয়ে লগইন
      const result = await auth.login(email, password);

      if (result.success) {
        // সফল হলে attempts রিসেট
        resetAttempts();
        return { success: true, user: result.user };
      } else {
        // ব্যর্থ হলে attempts বাড়াই
        recordFailedAttempt();
        return {
          success: false,
          error: result.error || 'Invalid credentials',
        };
      }
    },
    [auth, isLocked, lockTimer, recordFailedAttempt, resetAttempts]
  );

  // ============================================
  // 🎁 Return Combined Value
  // ============================================
  return {
    // AuthContext থেকে
    ...auth,

    // Rate limiting
    isLocked,
    lockTimer,
    attemptsLeft,
    loginAttempts: loginAttempts.count,

    // Enhanced login
    loginWithRateLimit,
    recordFailedAttempt,
    resetAttempts,
  };
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

export default useAuth;