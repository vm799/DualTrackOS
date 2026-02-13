import React from 'react';
import * as Sentry from '@sentry/react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Displays a fallback UI instead of crashing the whole app
 *
 * Production-ready error handling with Sentry integration
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null // Sentry event ID for user feedback
    };
  }

  static getDerivedStateFromError(_error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Log to Sentry
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        component: this.props.componentName || 'unknown',
        boundary: 'ErrorBoundary',
      },
      level: 'error',
    });

    // Store error details in state
    this.setState({
      hasError: true,
      error,
      errorInfo,
      eventId,
    });
  }

  handleReset = () => {
    // Try to recover by resetting state first
    this.setState({ hasError: false, error: null, errorInfo: null, eventId: null });

    // If state reset doesn't work, navigate to a safe location
    setTimeout(() => {
      // Get last known good path or default to home
      const lastGoodPath = localStorage.getItem('last-good-path') || '/';

      // If we're still on an error state after reset, navigate away
      if (this.state.hasError) {
        window.location.href = lastGoodPath;
      }
    }, 100);
  };

  handleGoHome = () => {
    // Clear error state and go to home page
    localStorage.setItem('last-good-path', '/');
    window.location.href = '/';
  };

  handleFeedback = () => {
    // Show Sentry user feedback dialog
    if (this.state.eventId) {
      Sentry.showReportDialog({
        eventId: this.state.eventId,
        title: 'It looks like we\'re having issues.',
        subtitle: 'Our team has been notified. If you\'d like to help, tell us what happened below.',
        labelComments: 'What happened?',
      });
    }
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
                  onClick={this.handleGoHome}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-all"
                >
                  Go Home
                </button>
              </div>

              {this.state.eventId && (
                <button
                  onClick={this.handleFeedback}
                  className="mt-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline"
                >
                  Report this issue
                </button>
              )}

              <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
                {this.state.eventId
                  ? 'Our team has been automatically notified of this error.'
                  : 'If this problem persists, please contact support.'}
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
