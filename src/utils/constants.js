// ============================================
// 📌 Application Constants
// ============================================
// পুরো অ্যাপের সব স্থির মান এখানে

// ============================================
// 🏢 App Info
// ============================================
export const APP_NAME = 'BAFI Gaming';
export const APP_SHORT_NAME = 'BAFI';
export const APP_DESCRIPTION = 'Fast & Secure Gaming Top-up Platform';
export const APP_VERSION = '1.0.0';
export const APP_URL = 'https://bafigaming.com';

// ============================================
// 🎮 Game Categories
// ============================================
export const GAME_CATEGORIES = [
  { id: 'all', name: 'All Games', nameBn: 'সব গেম', icon: '🎮' },
  { id: 'battle-royale', name: 'Battle Royale', nameBn: 'ব্যাটল রয়্যাল', icon: '🎯' },
  { id: 'moba', name: 'MOBA', nameBn: 'মোবা', icon: '⚔️' },
  { id: 'fps', name: 'FPS', nameBn: 'এফপিএস', icon: '🔫' },
  { id: 'rpg', name: 'RPG', nameBn: 'আরপিজি', icon: '🐉' },
  { id: 'strategy', name: 'Strategy', nameBn: 'স্ট্র্যাটেজি', icon: '🏰' },
  { id: 'sports', name: 'Sports', nameBn: 'স্পোর্টস', icon: '⚽' },
  { id: 'racing', name: 'Racing', nameBn: 'রেসিং', icon: '🏎️' },
  { id: 'puzzle', name: 'Puzzle', nameBn: 'পাজল', icon: '🧩' },
  { id: 'action', name: 'Action', nameBn: 'অ্যাকশন', icon: '💥' },
];

// ============================================
// 💳 Payment Methods
// ============================================
export const PAYMENT_METHODS = [
  {
    id: 'bkash',
    name: 'bKash',
    nameBn: 'বিকাশ',
    icon: '💗',
    color: '#e2136e',
    enabled: true,
  },
  {
    id: 'nagad',
    name: 'Nagad',
    nameBn: 'নগদ',
    icon: '🟠',
    color: '#ec1c24',
    enabled: true,
  },
  {
    id: 'rocket',
    name: 'Rocket',
    nameBn: 'রকেট',
    icon: '🚀',
    color: '#8c3494',
    enabled: true,
  },
  {
    id: 'card',
    name: 'Card',
    nameBn: 'কার্ড',
    icon: '💳',
    color: '#3b82f6',
    enabled: false,
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    nameBn: 'ব্যাংক ট্রান্সফার',
    icon: '🏦',
    color: '#10b981',
    enabled: false,
  },
];

// ============================================
// 📦 Order Status
// ============================================
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
};

export const ORDER_STATUS_LIST = [
  { id: 'pending', name: 'Pending', nameBn: 'পেন্ডিং', color: 'yellow', icon: '⏳' },
  { id: 'processing', name: 'Processing', nameBn: 'প্রসেসিং', color: 'blue', icon: '⚙️' },
  { id: 'completed', name: 'Completed', nameBn: 'সম্পন্ন', color: 'green', icon: '✅' },
  { id: 'cancelled', name: 'Cancelled', nameBn: 'বাতিল', color: 'red', icon: '❌' },
  { id: 'failed', name: 'Failed', nameBn: 'ব্যর্থ', color: 'red', icon: '⚠️' },
];

// ============================================
// 💰 Transaction Types
// ============================================
export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  PURCHASE: 'purchase',
  REFUND: 'refund',
  BONUS: 'bonus',
  REFERRAL: 'referral',
};

export const TRANSACTION_TYPE_LIST = [
  { id: 'deposit', name: 'Deposit', nameBn: 'জমা', icon: '➕', color: 'green' },
  { id: 'withdrawal', name: 'Withdrawal', nameBn: 'উত্তোলন', icon: '➖', color: 'red' },
  { id: 'purchase', name: 'Purchase', nameBn: 'ক্রয়', icon: '🛒', color: 'blue' },
  { id: 'refund', name: 'Refund', nameBn: 'রিফান্ড', icon: '↩️', color: 'orange' },
  { id: 'bonus', name: 'Bonus', nameBn: 'বোনাস', icon: '🎁', color: 'purple' },
  { id: 'referral', name: 'Referral', nameBn: 'রেফারেল', icon: '👥', color: 'pink' },
];

// ============================================
// 👤 User Roles
// ============================================
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
};

// ============================================
// 🔐 Auth Settings
// ============================================
export const AUTH_SETTINGS = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCK_DURATION_MINUTES: 15,
  MIN_PASSWORD_LENGTH: 6,
  STRONG_PASSWORD_LENGTH: 8,
  SESSION_TIMEOUT_HOURS: 24,
};

// ============================================
// 💵 Money Settings
// ============================================
export const MONEY = {
  CURRENCY: 'BDT',
  CURRENCY_SYMBOL: '৳',
  MIN_DEPOSIT: 10,
  MAX_DEPOSIT: 100000,
  MIN_WITHDRAWAL: 100,
  MAX_WITHDRAWAL: 50000,
  MIN_TOPUP: 10,
  MAX_TOPUP: 100000,
  REFERRAL_BONUS: 50,
};

// ============================================
// 📊 Pagination
// ============================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  LIMIT_OPTIONS: [12, 24, 48, 96],
  MAX_LIMIT: 100,
};

// ============================================
// 🖼️ File Upload
// ============================================
export const UPLOAD = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_AVATAR_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_AVATAR_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};

// ============================================
// 🌐 Languages
// ============================================
export const LANGUAGES = [
  { code: 'en', name: 'English', nameBn: 'English', flag: '🇬🇧' },
  { code: 'bn', name: 'Bangla', nameBn: 'বাংলা', flag: '🇧🇩' },
];

export const DEFAULT_LANGUAGE = 'en';

// ============================================
// 🎨 Themes
// ============================================
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const DEFAULT_THEME = 'light';

// ============================================
// 🎯 Routes
// ============================================
export const ROUTES = {
  // Public
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  REFUND: '/refund',
  BLOG: '/blog',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  // User
  USER_DASHBOARD: '/user',
  USER_PROFILE: '/profile',
  WALLET: '/wallet',
  TOPUP_HISTORY: '/topup-history',
  FAVORITES: '/favorites',
  ORDERS: '/orders',
  ORDER_DETAILS: '/orders/:id',
  CHECKOUT: '/checkout',
  REFERRAL: '/referral',
  COUPONS: '/coupons',
  SUPPORT: '/support',
  SETTINGS: '/settings',

  // Games
  GAMES: '/games',
  GAME_DETAILS: '/games/:id',
  CATEGORY: '/category/:slug',
  SEARCH: '/search',

  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_GAMES: '/admin/games',
  ADMIN_NOTICES: '/admin/notices',
  ADMIN_USERS: '/admin/users',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_TRANSACTIONS: '/admin/transactions',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_COUPONS: '/admin/coupons',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_TICKETS: '/admin/tickets',
  ADMIN_INVENTORY: '/admin/inventory',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_BACKUP: '/admin/backup',
};

// ============================================
// 🕒 Time Constants
// ============================================
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
};

export const NOTIFICATION_DURATION = 4000;

// ============================================
// 🔔 Notification Types
// ============================================
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// ============================================
// 📱 PWA
// ============================================
export const PWA = {
  CACHE_NAME: 'bafi-gaming-v1',
  RUNTIME_CACHE: 'bafi-runtime-v1',
};

// ============================================
// 🎁 Referral
// ============================================
export const REFERRAL = {
  CODE_LENGTH: 8,
  BONUS_AMOUNT: 50,
  MIN_PURCHASE_FOR_BONUS: 100,
};

// ============================================
// 🎟️ Coupons
// ============================================
export const COUPON_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
};

// ============================================
// 📞 Contact Info (ডিফল্ট - পরে অ্যাডমিন থেকে পরিবর্তন করা যাবে)
// ============================================
export const DEFAULT_CONTACT = {
  EMAIL: 'admin@bafi.gd',
  PHONE: '+8801700000000',
  WHATSAPP: '+8801700000000',
  TELEGRAM: 'bafigaming',
  FACEBOOK: 'https://facebook.com/bafigaming',
  YOUTUBE: 'https://youtube.com/@bafigaming',
  ADDRESS: 'Dhaka, Bangladesh',
};

// ============================================
// ⚙️ Site Defaults
// ============================================
export const SITE_DEFAULTS = {
  SITE_NAME: 'BAFI Gaming',
  WELCOME_MESSAGE: 'Welcome to BAFI Gaming!',
  SITE_LOGO: '',
  PRIMARY_COLOR: '#667eea',
  SECONDARY_COLOR: '#764ba2',
  ITEMS_PER_PAGE: 12,
  ENABLE_LIVE_CHAT: true,
  ENABLE_REFERRAL: true,
  ENABLE_COUPONS: true,
  ENABLE_REVIEWS: true,
  MAINTENANCE_MODE: false,
};

// ============================================
// 📊 Chart Colors (Admin Dashboard)
// ============================================
export const CHART_COLORS = [
  '#667eea',
  '#764ba2',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
];

// ============================================
// 🎯 Sort Options
// ============================================
export const SORT_OPTIONS = [
  { id: 'newest', name: 'Newest First', nameBn: 'নতুন আগে' },
  { id: 'oldest', name: 'Oldest First', nameBn: 'পুরাতন আগে' },
  { id: 'price-low', name: 'Price: Low to High', nameBn: 'দাম: কম থেকে বেশি' },
  { id: 'price-high', name: 'Price: High to Low', nameBn: 'দাম: বেশি থেকে কম' },
  { id: 'popular', name: 'Most Popular', nameBn: 'সবচেয়ে জনপ্রিয়' },
  { id: 'rating', name: 'Highest Rated', nameBn: 'সেরা রেটিং' },
];

// ============================================
// 🚫 Error Messages
// ============================================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_INPUT: 'Invalid input. Please check your data.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
};