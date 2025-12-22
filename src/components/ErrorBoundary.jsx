import React from 'react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Displays a fallback UI instead of crashing the whole app
 *
 * Production-ready error handling
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Store error details in state
    this.state = {
      hasError: true,
      error,
      errorInfo
    };

    // TODO: Log to error reporting service (Sentry, LogRocket, etc.)
    // Example:
    // Sentry.captureException(error, {
    //   extra: errorInfo,
    //   tags: {
    //     component: this.props.componentName || 'unknown'
    //   }
    // });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#191919] px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-red-200 dark:border-red-500/30 p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">😔</div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We're sorry for the inconvenience. The app encountered an unexpected error.
              </p>

              {/* Show error details in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-red-600 dark:text-red-400 font-mono mb-2">
                    Error Details (development only)
                  </summary>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg p-4 text-xs font-mono overflow-auto max-h-48">
                    <p className="text-red-800 dark:text-red-300 mb-2">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="text-red-700 dark:text-red-400 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              <div className="flex gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-all"
                >
                  Go Home
                </button>
              </div>

              <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
                If this problem persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
