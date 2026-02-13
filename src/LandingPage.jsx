import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { signInWithGoogle } from './services/dataService';
import Logo from './components/Logo';

const LandingPage = ({ onEnter, onViewStory, darkMode, user }) => {
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setError(null);

    const result = await signInWithGoogle();

    if (result?.error) {
      setSigningIn(false);

      // Check if it's a Supabase configuration error
      if (result.error === 'Supabase not configured') {
        setError(
          'Google Sign-In requires setup. Click "Enter Here" above to continue without signing in.'
        );
      } else {
        setError('Unable to sign in with Google. Please try again or click "Enter Here" above to continue.');
      }

      console.error('Sign in error:', result.error);
    }
    // If successful, Supabase redirects to Google OAuth, so we stay in loading state
  };
  return (
    <div
      className={`min-h-[100dvh] relative overflow-hidden ${
        darkMode
          ? 'bg-[#191919]'
          : 'bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50'
      }`}
    >
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${
            darkMode
              ? 'bg-gradient-to-r from-purple-600 to-pink-600'
              : 'bg-gradient-to-r from-purple-300 to-pink-300'
          } animate-pulse`}
        />
        <div
          className={`absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-600 to-purple-600'
              : 'bg-gradient-to-r from-cyan-300 to-purple-300'
          } animate-pulse`}
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center">

        {/* CENTERED LOGO + BRANDING */}
        <div className="flex flex-col items-center justify-center flex-1 w-full">
          <div className="mb-6 sm:mb-8 w-full flex items-center justify-center">
            <div className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[520px] md:h-[520px] flex items-center justify-center">
              <Logo size="xlarge" className="animate-fade-in" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-4 sm:mb-6">
            <span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>
              DualTrack
            </span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              OS
            </span>
          </h1>

          <p
            className={`text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-8 sm:mb-10 max-w-3xl ${
              darkMode ? 'text-gray-400' : 'text-gray-700'
            }`}
          >
            Your companion through every challenge, cycle, and chapter
          </p>

          {/* Primary CTA */}
          <button
            onClick={onEnter}
            className={`group relative px-7 py-3 text-base sm:text-lg font-bold transition-all duration-300 hover:scale-105 mb-6 ${
              darkMode ? 'bg-gray-900' : 'bg-white'
            }`}
            style={{
              border: '3px solid transparent',
              borderImage:
                'linear-gradient(135deg, #06b6d4 0%, #a855f7 33%, #ec4899 66%, #fb923c 100%) 1',
              boxShadow:
                '0 0 20px rgba(168, 85, 247, 0.45), 0 0 40px rgba(6, 182, 212, 0.25)',
            }}
          >
            <span className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Start Your Day
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1 text-purple-500"
              />
            </span>
          </button>

          {/* Secondary CTA - Story */}
          <button
            onClick={onViewStory}
            className={`px-6 py-2.5 rounded-full text-sm sm:text-base font-semibold transition-all hover:scale-105 ${
              darkMode
                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-300'
            }`}
          >
            ✨ The Story Behind the App
          </button>
        </div>

        {/* BOTTOM — Auth (Subtle) */}
        <div className="pb-4 sm:pb-6 mt-8">
          {!user ? (
            <>
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all hover:scale-105 flex items-center gap-2 mx-auto shadow-md ${
                  signingIn
                    ? 'opacity-70 cursor-not-allowed'
                    : ''
                } ${
                  darkMode
                    ? 'bg-white text-gray-900 hover:bg-gray-100 border border-white/20'
                    : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{signingIn ? 'Signing in...' : 'Sign in with Google'}</span>
              </button>
              {error && (
                <div className={`text-xs mt-2 ${darkMode ? 'text-red-400' : 'text-red-600'} max-w-sm mx-auto`}>
                  {error}
                </div>
              )}
            </>
          ) : (
            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Signed in as {user.email}
            </div>
          )}
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.9s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
