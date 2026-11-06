// ============================================
// 📊 Google Analytics Service
// ============================================

// 🔴 এখানে পরিবর্তন করুন 🔴 (না থাকলে এভাবেই রাখুন)
// নিচের কোটেশনের ভেতরে আপনার Google Analytics ID বসান (যেমন: G-XXXXXXXXXX)
const GA_MEASUREMENT_ID = '[এখানে_আপনার_GA_আইডি_দিন]'; 

export const initAnalytics = () => {
  if (GA_MEASUREMENT_ID.includes('[এখানে_আপনার_GA_আইডি_দিন]')) {
    console.log('📊 Analytics: Demo Mode (No GA ID)');
    return;
  }
  // আসল গুগল অ্যানালিটিক্স স্ক্রিপ্ট এখানে লোড হবে
  console.log('📊 Analytics Initialized with ID:', GA_MEASUREMENT_ID);
};

export const trackPageView = (pagePath, pageTitle) => {
  if (GA_MEASUREMENT_ID.includes('[এখানে_আপনার_GA_আইডি_দিন]')) return;
  console.log(`📊 [Page View] ${pageTitle} - ${pagePath}`);
};

export const trackEvent = (eventName, eventParams = {}) => {
  if (GA_MEASUREMENT_ID.includes('[এখানে_আপনার_GA_আইডি_দিন]')) return;
  console.log(`📊 [Event] ${eventName}`, eventParams);
};
