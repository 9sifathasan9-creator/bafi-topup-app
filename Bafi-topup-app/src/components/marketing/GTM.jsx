import React, { useEffect } from 'react';

// ============================================
// 🏷️ Google Tag Manager (GTM) Component
// ============================================

// 🔴 এখানে পরিবর্তন করুন 🔴
const GTM_ID = '[এখানে_আপনার_GTM_আইডি_দিন]';

const GTM = () => {
  useEffect(() => {
    if (GTM_ID.includes('[এখানে_আপনার_GTM_আইডি_দিন]')) {
      console.log('🏷️ GTM: Demo Mode (No ID)');
      return;
    }

    // আসল জিটিএম স্ক্রিপ্ট এখানে লোড হবে
    console.log('🏷️ GTM Initialized:', GTM_ID);
  }, []);

  return null; // এটি কোনো UI দেখায় না
};

export default GTM;
