import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry for error tracking
 * Call this as early as possible in your application
 */
export const initSentry = () => {
  // Only initialize Sentry in production or if explicitly enabled
  if (process.env.NODE_ENV !== 'production' && !process.env.REACT_APP_SENTRY_ENABLED) {
    console.log('Sentry not initialized (not in production mode)');
    return;
  }

  // Check if DSN is configured
  const sentryDsn = process.env.REACT_APP_SENTRY_DSN;
  if (!sentryDsn || sentryDsn === 'YOUR_SENTRY_DSN_HERE') {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: sentryDsn,

    // Environment (production, staging, development)
    environment: process.env.NODE_ENV || 'development',

    // Release version (use git commit hash or package.json version)
    release: process.env.REACT_APP_VERSION || '1.0.0',

    // Performance Monitoring
    integrations: [
      // Browser tracing for performance monitoring
      new Sentry.BrowserTracing({
        // Trace all routes
        tracePropagationTargets: [
          'localhost',
          /^\//,
          /^https:\/\/.*\.supabase\.co/,
        ],
      }),
      // Replay sessions for debugging
      new Sentry.Replay({
        maskAllText: true, // Mask all text for privacy
        blockAllMedia: true, // Block all media for privacy
      }),
    ],

    // Performance Monitoring - Sample rate
    // 1.0 = 100% of transactions, 0.1 = 10%
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Session Replay - Sample rate
    // This sets the sample rate at 10%. You may want to change it to 100% while in development
    // and then sample at a lower rate in production.
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Filter out noisy errors
    beforeSend(event, hint) {
      // Don't send errors in development unless explicitly enabled
      if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_SENTRY_ENABLED) {
        return null;
      }

      // Filter out browser extension errors
      if (event.exception) {
        const values = event.exception.values || [];
        for (const value of values) {
          if (value.stacktrace) {
            const frames = value.stacktrace.frames || [];
            for (const frame of frames) {
              if (frame.filename && (
                frame.filename.includes('chrome-extension://') ||
                frame.filename.includes('moz-extension://') ||
                frame.filename.includes('safari-extension://')
              )) {
                return null; // Don't send browser extension errors
              }
            }
          }
        }
      }

      // Filter out network errors (too noisy)
      const errorMessage = event.message || '';
      if (
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('Load failed')
      ) {
        // Only send if it's a critical API call
        const isCriticalAPI = errorMessage.includes('/api/') ||
                             errorMessage.includes('supabase') ||
                             errorMessage.includes('stripe');
        if (!isCriticalAPI) {
          return null;
        }
      }

      return event;
    },

    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'Can\'t find variable: ZiteReader',
      'jigsaw is not defined',
      'ComboSearch is not defined',

      // Facebook-related errors
      'fb_xd_fragment',

      // Random plugins/extensions
      'atomicFindClose',
      'conduitPage',

      // Network errors
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',

      // React errors that are handled
      'ChunkLoadError',
      'Loading chunk',
    ],

    // Automatically capture unhandled promise rejections
    autoSessionTracking: true,

    // Configure breadcrumbs (user actions leading up to error)
    maxBreadcrumbs: 50,
  });

  // Set initial user context (will be updated on auth)
  Sentry.setContext('app', {
    name: 'DualTrack OS',
    version: process.env.REACT_APP_VERSION || '1.0.0',
  });

  console.log('✅ Sentry initialized successfully');
};

/**
 * Set user context for error tracking
 * Call this after user authentication
 */
export const setSentryUser = (user) => {
  if (!user) {
    Sentry.setUser(null);
    return;
  }

  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.email?.split('@')[0] || 'unknown',
  });
};

/**
 * Log a custom error to Sentry
 */
export const logError = (error, context = {}) => {
  console.error('[Error]', error, context);

  Sentry.captureException(error, {
    tags: context.tags || {},
    extra: context.extra || {},
    level: context.level || 'error',
  });
};

/**
 * Log a custom message to Sentry
 */
export const logMessage = (message, level = 'info', context = {}) => {
  console.log(`[${level.toUpperCase()}]`, message, context);

  Sentry.captureMessage(message, {
    level,
    tags: context.tags || {},
    extra: context.extra || {},
  });
};

/**
 * Add breadcrumb for user action tracking
 */
export const addBreadcrumb = (message, category = 'user-action', data = {}) => {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
};

/**
 * Set custom context for errors
 */
export const setContext = (name, context) => {
  Sentry.setContext(name, context);
};

/**
 * Wrap async functions with error tracking
 */
export const withErrorTracking = (fn, context = {}) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, {
        ...context,
        tags: {
          ...context.tags,
          function: fn.name || 'anonymous',
        },
      });
      throw error; // Re-throw so caller can handle
    }
  };
};

export default Sentry;
