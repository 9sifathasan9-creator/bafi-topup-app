// === DEBUG ENV CHECK ===
console.log("=== BAFI ENV CHECK ===");
console.log("URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("KEY EXISTS:", !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
console.log("ADMIN EMAIL:", import.meta.env.VITE_ADMIN_EMAIL);
// =======================

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
