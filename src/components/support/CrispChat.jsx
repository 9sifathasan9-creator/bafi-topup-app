import React, { useEffect } from 'react';

// ============================================
// 💬 Crisp Live Chat Widget
// ============================================

// 🔴 এখানে পরিবর্তন করুন 🔴 (আইডি না থাকলে এভাবেই রাখুন)
const CRISP_WEBSITE_ID = '[এখানে_CRISP_WEBSITE_ID_দিন]';

const CrispChat = () => {
  useEffect(() => {
    if (CRISP_WEBSITE_ID.includes('[এখানে_CRISP_WEBSITE_ID_দিন]')) {
      console.log('💬 Crisp: Demo Mode (No ID). Chat disabled.');
      return;
    }

    // আসল Crisp স্ক্রিপ্ট এখানে লোড হবে
    console.log('💬 Crisp Chat Initialized');
  }, []);

  return null;
};

export default CrispChat;
