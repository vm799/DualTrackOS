/**
 * DualTrack OS - Main Application Entry Point
 *
 * Single Responsibility: Application initialization and routing
 *
 * Architecture:
 * - Auth initialization delegated to useAuthInitialization hook
 * - Data persistence delegated to useDataPersistence hook
 * - Routing delegated to AppRouter component
 * - State management handled by Zustand stores
 * - UI components organized by feature
 *
 * This file should remain small (<50 lines) and focused only on:
 * 1. Initializing app-level concerns (auth, persistence)
 * 2. Rendering the router
 *
 * All business logic belongs in hooks, stores, or components.
 */

import React from 'react';
import CookieConsent from 'react-cookie-consent';
import AppRouter from './Router';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuthInitialization } from './hooks/useAuthInitialization';
import { useDataPersistence } from './hooks/useDataPersistence';

const DualTrackOS = () => {
  // Initialize authentication and load user data
  useAuthInitialization();

  // Auto-save data to localStorage and Supabase
  useDataPersistence();

  // Handle cookie consent acceptance
  const handleAcceptCookies = () => {
    // Enable Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  };

  const handleDeclineCookies = () => {
    // Disable Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  };

  // Render the application wrapped in Error Boundary for production error handling
  return (
    <ErrorBoundary>
      <AppRouter />
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        onAccept={handleAcceptCookies}
        onDecline={handleDeclineCookies}
        cookieName="dualtrack-cookie-consent"
        style={{
          background: 'rgba(17, 24, 39, 0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(139, 92, 246, 0.3)',
          padding: '20px',
        }}
        buttonStyle={{
          background: 'linear-gradient(to right, #9333ea, #db2777)',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600',
          borderRadius: '8px',
          padding: '10px 24px',
        }}
        declineButtonStyle={{
          background: 'transparent',
          border: '1px solid #6b7280',
          color: '#d1d5db',
          fontSize: '14px',
          borderRadius: '8px',
          padding: '10px 24px',
        }}
        expires={365}
      >
        <span className="text-gray-100">
          We use cookies to improve your experience and analyze usage.{' '}
          <a
            href="/privacy"
            style={{ color: '#a78bfa', textDecoration: 'underline' }}
          >
            Learn more in our Privacy Policy
          </a>
        </span>
      </CookieConsent>
    </ErrorBoundary>
  );
};

export default DualTrackOS;
