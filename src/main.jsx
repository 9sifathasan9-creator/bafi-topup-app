import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// এরর সরাসরি স্ক্রিনে দেখানোর ফাংশন
function showError(err) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding:20px; font-family:monospace; background:#fee2e2; color:#991b1b; min-height:100vh; z-index:9999; position:relative;">
        <h2>❌ App Crash Error:</h2>
        <p style="font-size:16px; font-weight:bold;">${err?.message || err}</p>
        <pre style="white-space:pre-wrap; word-wrap:break-word; font-size:12px; background:#fff; padding:10px; border-radius:8px; margin-top:10px;">${err?.stack || 'No stack trace available'}</pre>
        <p style="margin-top:20px;">Check your Vercel Environment Variables and Supabase connection.</p>
      </div>
    `;
  }
}

// গ্লোবাল এরর হ্যান্ডলার
window.addEventListener('error', (e) => showError(e.error || e.message));
window.addEventListener('unhandledrejection', (e) => showError(e.reason));

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} catch (error) {
  showError(error);
}
