import React, { ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (React.Component as any) {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[400px] text-center bg-surface border border-outline-variant/30 rounded-2xl shadow-sm my-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mb-4 border border-rose-200 dark:border-rose-900/40">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">
            {this.props.fallbackTitle || 'Something went wrong loading this section'}
          </h2>
          <p className="text-sm text-on-surface-variant max-w-md mb-6">
            {this.state.error?.message || 'An unexpected error occurred. Please try reloading this section.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-on-primary rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Section
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
