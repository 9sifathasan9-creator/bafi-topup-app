// ============================================
// 💳 Payment API Wrapper
// ============================================

export const initiatePayment = async (method, amount, userData) => {
  console.log(`Initiating ${method} payment of ৳${amount}`);
  
  // আপাতত এটি একটি ডেমো (মক) প্রসেস, কারণ আসল API Key দেওয়া নেই
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Payment initiated (Demo Mode)',
        transactionId: `DEMO-${Date.now()}`,
        amount: amount,
        method: method,
      });
    }, 1500);
  });
};

export const verifyPayment = async (method, transactionId) => {
  console.log(`Verifying payment: ${transactionId} via ${method}`);
  
  // আসল API যুক্ত না হওয়া পর্যন্ত এটি অটোমেটিক সফল (Success) দেখাবে
  return {
    success: true,
    status: 'completed',
    verifiedAt: new Date().toISOString(),
  };
};
