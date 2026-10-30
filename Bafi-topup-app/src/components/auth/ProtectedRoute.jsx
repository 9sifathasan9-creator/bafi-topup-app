import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

// ============================================
// 🛡️ Protected Route Component
// ============================================
// প্রোটেক্টেড পেজ র্যাপার
// login নেই → /login এ redirect
// admin নয় → /user এ redirect

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // ============================================
  // ⏳ Loading State
  // ============================================
  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
        <p className="text-white/80 text-sm">Checking authentication...</p>
      </div>
    );
  }

  // ============================================
  // 🔓 Not Logged In → Login Page
  // ============================================
  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // ============================================
  // 🛡️ Admin Required But User is Not Admin
  // ============================================
  if (requireAdmin && !isAdmin) {
    return <Navigate to={ROUTES.USER_DASHBOARD} replace />;
  }

  // ============================================
  // ✅ Authorized → Render Children
  // ============================================
  return children;
};

export default ProtectedRoute;