import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { supabase, ADMIN_EMAIL } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('user');

  const setUserAndRole = useCallback((currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      const userRole = currentUser.email === ADMIN_EMAIL ? 'admin' : 'user';
      setRole(userRole);
    } else {
      setUser(null);
      setRole('user');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(currentSession);
          setUserAndRole(currentSession?.user || null);
        }
      } catch (err) {
        console.error('Session init error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (isMounted) {
          setSession(newSession);
          setUserAndRole(newSession?.user || null);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, [setUserAndRole]);

  const login = useCallback(async (email, password) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) throw error;
      setUserAndRole(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [setUserAndRole]);

  const register = useCallback(async (email, password, metadata = {}) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: { data: { ...metadata, role: 'user' } },
      });
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      setRole('user');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const updatePassword = useCallback(async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const updateEmail = useCallback(async (newEmail) => {
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail.trim().toLowerCase() });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = role === 'admin';
  const isUser = role === 'user';
  const userEmail = user?.email || '';
  const userId = user?.id || null;

  const value = {
    user, session, role, loading, login, register, logout, resetPassword, updatePassword, updateEmail,
    isAuthenticated, isAdmin, isUser, userEmail, userId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
