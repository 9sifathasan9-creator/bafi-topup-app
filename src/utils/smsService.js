// ============================================
// 📱 SMS Service (Demo Mode)
// ============================================

// 🔴 এখানে পরিবর্তন করুন 🔴
// ভবিষ্যতে Twilio বা SSLWireless এর API Key এখানে বসাবেন
const SMS_API_KEY = '[এখানে_আপনার_SMS_API_KEY_দিন]';

export const sendSMS = async (phoneNumber, message) => {
  if (SMS_API_KEY.includes('[এখানে_আপনার_SMS_API_KEY_দিন]')) {
    console.log(`[DEMO SMS] To: ${phoneNumber} | Message: ${message}`);
    return { success: true, message: 'Demo SMS sent (No API Key)' };
  }

  try {
    // এখানে ভবিষ্যতে আসল API-এর fetch কল বসবে
    return { success: true, message: 'SMS sent successfully' };
  } catch (error) {
    console.error('SMS Error:', error);
    return { success: false, error: error.message };
  }
};
