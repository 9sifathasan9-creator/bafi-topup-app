import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import BottomNav from './components/common/BottomNav';
import ErrorBoundary from './components/common/ErrorBoundary';
import PWAInstall from './components/toggles/PWAInstall';
import NotificationToast from './components/notifications/NotificationToast';
import ChatWidget from './components/support/ChatWidget';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminSidebar from './components/admin/AdminSidebar';
import AdminHeader from './components/admin/AdminHeader';

// Public
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import FAQPage from './pages/public/FAQ';
import Terms from './pages/public/Terms';
import Privacy from './pages/public/Privacy';
import Refund from './pages/public/Refund';
import Blog from './pages/public/Blog';
import BlogPost from './pages/public/BlogPost';
import NotFound from './pages/public/NotFound';

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Games
import GamesPage from './pages/games/GamesPage';
import GameDetailsPage from './pages/games/GameDetailsPage';
import CategoryPage from './pages/games/CategoryPage';
import SearchPage from './pages/games/SearchPage';

// User
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import WalletPage from './pages/user/WalletPage';
import TopupHistory from './pages/user/TopupHistory';
import FavoritesPage from './pages/user/FavoritesPage';
import OrderHistory from './pages/user/OrderHistory';
import OrderDetailsPage from './pages/user/OrderDetails';
import Checkout from './pages/user/Checkout';
import ReferralPage from './pages/user/ReferralPage';
import CouponsPage from './pages/user/CouponsPage';
import SupportPage from './pages/user/SupportPage';
import Settings from './pages/user/Settings';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminGames from './pages/admin/AdminGames';
import AdminNotices from './pages/admin/AdminNotices';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminReviews from './pages/admin/AdminReviews';
import AdminTickets from './pages/admin/AdminTickets';
import AdminInventory from './pages/admin/AdminInventory';
import AdminRoles from './pages/admin/AdminRoles';
import AdminBackup from './pages/admin/AdminBackup';

const AdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <div className="flex min-h-screen">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 p-4 md:p-6 bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
            <AuthProvider>
              <CartProvider>
                <BrowserRouter>
                  <NotificationToast position="top-right" />
                  <PWAInstall />
                  <Routes>
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout title="Dashboard"><AdminDashboard /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin><AdminLayout title="Analytics"><AdminAnalytics /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/games" element={<ProtectedRoute requireAdmin><AdminLayout title="Games"><AdminGames /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/notices" element={<ProtectedRoute requireAdmin><AdminLayout title="Notices"><AdminNotices /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminLayout title="Users"><AdminUsers /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/orders" element={<ProtectedRoute requireAdmin><AdminLayout title="Orders"><AdminOrders /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/transactions" element={<ProtectedRoute requireAdmin><AdminLayout title="Transactions"><AdminTransactions /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/withdrawals" element={<ProtectedRoute requireAdmin><AdminLayout title="Withdrawals"><AdminWithdrawals /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/coupons" element={<ProtectedRoute requireAdmin><AdminLayout title="Coupons"><AdminCoupons /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/reviews" element={<ProtectedRoute requireAdmin><AdminLayout title="Reviews"><AdminReviews /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/tickets" element={<ProtectedRoute requireAdmin><AdminLayout title="Tickets"><AdminTickets /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/inventory" element={<ProtectedRoute requireAdmin><AdminLayout title="Inventory"><AdminInventory /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/roles" element={<ProtectedRoute requireAdmin><AdminLayout title="Roles"><AdminRoles /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/backup" element={<ProtectedRoute requireAdmin><AdminLayout title="Backup"><AdminBackup /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminLayout title="Settings"><AdminSettings /></AdminLayout></ProtectedRoute>} />

                    {/* Public Routes */}
                    <Route path="/*" element={
                      <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <div className="flex-1 pb-20 md:pb-0">
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/faq" element={<FAQPage />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/refund" element={<Refund />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/blog/:id" element={<BlogPost />} />

                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/reset-password" element={<ResetPasswordPage />} />
                            <Route path="/verify-email" element={<VerifyEmailPage />} />

                            <Route path="/games" element={<GamesPage />} />
                            <Route path="/games/:id" element={<GameDetailsPage />} />
                            <Route path="/category/:slug" element={<CategoryPage />} />
                            <Route path="/search" element={<SearchPage />} />

                            <Route path="/user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                            <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
                            <Route path="/topup-history" element={<ProtectedRoute><TopupHistory /></ProtectedRoute>} />
                            <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                            <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
                            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                            <Route path="/referral" element={<ProtectedRoute><ReferralPage /></ProtectedRoute>} />
                            <Route path="/coupons" element={<ProtectedRoute><CouponsPage /></ProtectedRoute>} />
                            <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
                            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </div>
                        <Footer />
                        <BottomNav />
                      </div>
                    } />
                  </Routes>
                  <ChatWidget />
                </BrowserRouter>
              </CartProvider>
            </AuthProvider>
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
