import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from '../ui/Button';

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

  handleReload = () => window.location.reload();
  handleGoHome = () => { window.location.href = '/'; };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600">
          <div className="gaming-card max-w-lg w-full p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Something went wrong</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">We are sorry for the inconvenience.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="primary" leftIcon={RefreshCw} onClick={this.handleReload} fullWidth>Reload</Button>
              <Button variant="secondary" leftIcon={Home} onClick={this.handleGoHome} fullWidth>Go Home</Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
