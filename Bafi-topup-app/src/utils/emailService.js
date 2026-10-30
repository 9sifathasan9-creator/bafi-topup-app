// ============================================
// 📧 Email Service (Resend API)
// ============================================

// 🔴 এখানে পরিবর্তন করুন 🔴
// নিচের কোটেশনের ভেতরে আপনার Resend API Key পেস্ট করুন
const RESEND_API_KEY = 're_4mhsdc21_51Hoza2wGPfmEyJBGHvv3Sp2'; 

export const sendEmail = async (to, subject, html) => {
  // যদি API Key না থাকে, তবে ডেমো মোডে চলবে (Console-এ দেখাবে)
  if (RESEND_API_KEY.includes('re_4mhsdc21_51Hoza2wGPfmEyJBGHvv3Sp2')) {
    console.log(`[DEMO EMAIL] To: ${to} | Subject: ${subject}`);
    console.log('Email body:', html);
    return { success: true, message: 'Demo email sent (No API Key)' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'BAFI Topup <onboarding@resend.dev>', // ডোমেইন কেনার পর এটি পরিবর্তন করবেন
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to send email');
    return { success: true, data };

  } catch (error) {
    console.error('Email Error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// 📨 Pre-made Email Templates
// ============================================

export const sendOrderConfirmation = async (email, orderData) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>🎮 Order Confirmed!</h2>
      <p>Thank you for your order.</p>
      <p><strong>Order ID:</strong> ${orderData.id}</p>
      <p><strong>Game:</strong> ${orderData.gameName}</p>
      <p><strong>Amount:</strong> ৳${orderData.amount}</p>
      <br/>
      <p>We will process your top-up shortly.</p>
      <p><a href="https://bafitopup.com/orders">View Order Details</a></p>
    </div>
  `;
  return sendEmail(email, `Order Confirmed - ${orderData.id}`, html);
};
