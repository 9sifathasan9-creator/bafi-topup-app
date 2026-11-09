import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // ডিবাগ তথ্য চেক করা
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
          <div className="max-w-lg w-full bg-white rounded-xl shadow-2xl overflow-hidden">
            
            <div className="bg-red-500 p-6 text-center">
              <AlertTriangle className="w-16 h-16 text-white mx-auto mb-2" />
              <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
              <p className="text-red-100 text-sm mt-1">Error: {this.state.error?.message}</p>
            </div>

            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">🔍 Debug Info (Check This)</h2>
              
              <div className="space-y-3 text-sm font-mono bg-gray-100 p-4 rounded-lg">
                <div>
                  <p className="text-gray-500 font-bold mb-1">1. Supabase URL:</p>
                  <p className={url ? "text-green-600 break-all" : "text-red-600"}>
                    {url || "❌ MISSING (Vercel-এ URL সেট করা নেই)"}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-500 font-bold mb-1">2. Supabase Key:</p>
                  <p className={key ? "text-green-600 break-all" : "text-red-600"}>
                    {key ? "✅ Key is Loaded" : "❌ MISSING (Vercel-এ Key সেট করা নেই)"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => window.location.reload()} className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Reload
                </button>
                <button onClick={() => window.location.href = '/'} className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" /> Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
