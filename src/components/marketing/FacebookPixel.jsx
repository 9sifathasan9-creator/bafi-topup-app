import React, { useEffect } from 'react';

// ============================================
// 📘 Facebook Pixel Component
// ============================================

// 🔴 এখানে পরিবর্তন করুন 🔴
const FB_PIXEL_ID = '[এখানে_আপনার_FB_পিক্সেল_আইডি_দিন]';

const FacebookPixel = () => {
  useEffect(() => {
    if (FB_PIXEL_ID.includes('[এখানে_আপনার_FB_পিক্সেল_আইডি_দিন]')) {
      console.log('📘 FB Pixel: Demo Mode (No ID)');
      return;
    }

    // আসল ফেসবুক পিক্সেল স্ক্রিপ্ট এখানে লোড হবে
    console.log('📘 FB Pixel Initialized:', FB_PIXEL_ID);
  }, []);

  return null; // এটি কোনো UI দেখায় না, শুধু ব্যাকগ্রাউন্ডে কাজ করে
};

export default FacebookPixel;
