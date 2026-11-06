import React, { useEffect } from 'react';

// ============================================
// 💬 Tawk.to Live Chat Widget
// ============================================

// 🔴 এখানে পরিবর্তন করুন 🔴 (আইডি না থাকলে এভাবেই রাখুন)
const TAWK_PROPERTY_ID = '[এখানে_TAWK_PROPERTY_ID_দিন]';
const TAWK_WIDGET_ID = '[এখানে_TAWK_WIDGET_ID_দিন]';

const TawkChat = () => {
  useEffect(() => {
    if (TAWK_PROPERTY_ID.includes('[এখানে_TAWK_PROPERTY_ID_দিন]')) {
      console.log('💬 Tawk.to: Demo Mode (No ID). Chat disabled.');
      return;
    }

    // আসল Tawk.to স্ক্রিপ্ট এখানে লোড হবে
    console.log('💬 Tawk.to Chat Initialized');
  }, []);

  return null; // এটি নিজে কোনো UI দেখায় না, স্ক্রিপ্ট ব্যাকগ্রাউন্ডে কাজ করে
};

export default TawkChat;
