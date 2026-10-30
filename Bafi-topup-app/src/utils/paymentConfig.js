// ============================================
// 💳 Payment Gateway Configuration
// ============================================

export const PAYMENT_CONFIG = {
  bkash: {
    enabled: false, // 🔴 নাম্বার না থাকলে false রাখুন, ইউজার দেখতে পাবে না
    name: 'bKash',
    type: 'personal',
    merchantNumber: '[এখানে_বিকাশ_নাম্বার_দিন]', 
    apiKey: '',
    baseUrl: 'https://tokenized.pay.bka.sh/v1.2.0-beta',
  },
  nagad: {
    enabled: false, // 🔴 নাম্বার না থাকলে false রাখুন
    name: 'Nagad',
    type: 'personal',
    merchantNumber: '[এখানে_নগদ_নাম্বার_দিন]', 
    apiKey: '',
    baseUrl: 'https://api.mynagad.com/api/dfs',
  },
  rocket: {
    enabled: false, // 🔴 নাম্বার না থাকলে false রাখুন
    name: 'Rocket',
    type: 'personal',
    merchantNumber: '[এখানে_রকেট_নাম্বার_দিন]', 
    apiKey: '',
    baseUrl: '',
  },
  card: {
    enabled: false, 
    name: 'Card / SSLCommerz',
    type: 'gateway',
    storeId: '',
    storePassword: '',
    baseUrl: 'https://sandbox.sslcommerz.com',
  },
  bank: {
    enabled: false,
    name: 'Bank Transfer',
    bankName: '[এখানে_ব্যাংকের_নাম_দিন]',
    accountName: '[এখানে_অ্যাকাউন্টের_নাম_দিন]',
    accountNumber: '[এখানে_অ্যাকাউন্ট_নাম্বার_দিন]',
    branchName: '[এখানে_ব্রাঞ্চের_নাম_দিন]',
  },
};

export const getEnabledPaymentMethods = () => {
  return Object.entries(PAYMENT_CONFIG)
    .filter(([_, config]) => config.enabled)
    .map(([key, config]) => ({ id: key, ...config }));
};

export const getPaymentConfig = (method) => {
  return PAYMENT_CONFIG[method] || null;
};

export const isPaymentEnabled = (method) => {
  return PAYMENT_CONFIG[method]?.enabled || false;
};

export default PAYMENT_CONFIG;
