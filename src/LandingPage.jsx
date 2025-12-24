import React, { useState } from 'react';
import { ArrowRight, LogIn } from 'lucide-react';
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
      <div className="relative z-10 flex flex-col min-h-[100dvh] px-6 text-center">

        {/* TOP — Brand Anchor */}
        <div className="pt-3 sm:pt-6 md:pt-10">
          <div className="flex justify-center">
            <Logo size="xlarge" className="w-[280px] h-[280px] sm:w-[480px] sm:h-[480px] md:w-[720px] md:h-[720px] animate-fade-in" />
          </div>

          <h1 className="mt-[-12px] text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            <span className={darkMode ? 'text-gray-100' : 'text-gray-900'}>
              DualTrack
            </span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              OS
            </span>
          </h1>

          <p
            className={`mt-2 text-sm sm:text-base md:text-lg leading-snug font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            The operating system powering every role she runs, every day.
          </p>
        </div>

        {/* MIDDLE — Motivation + CTA */}
        <div className="flex flex-col items-center justify-center flex-grow gap-2 py-3 sm:py-4 md:py-6">
          <p
            className={`text-sm sm:text-base italic font-light ${
              darkMode ? 'text-purple-400' : 'text-purple-600'
            }`}
          >
            Take a breath. You got this. Let’s do it.
          </p>

          <button
            onClick={onEnter}
            className={`group relative px-7 py-3 text-base sm:text-lg font-bold transition-all duration-300 hover:scale-105 ${
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
              Enter Here
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1 text-purple-500"
              />
            </span>
          </button>
        </div>

        {/* BOTTOM — Auth & Story */}
        <div className="mt-3 sm:mt-4 md:mt-6 pb-4 sm:pb-6 space-y-3">
          {!user ? (
            <>
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className={`px-8 py-3 rounded-full text-sm sm:text-base font-medium transition-all hover:scale-105 flex items-center gap-2 mx-auto ${
                  signingIn
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                } ${
                  darkMode
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
                    : 'bg-gray-900 hover:bg-gray-800 text-white border border-gray-700'
                }`}
                style={{
                  backdropFilter: 'blur(10px)',
                  boxShadow: darkMode
                    ? '0 0 20px rgba(255, 255, 255, 0.2)'
                    : '0 0 20px rgba(0, 0, 0, 0.2)',
                }}
              >
                <LogIn size={18} className={signingIn ? 'animate-spin' : ''} />
                {signingIn ? 'Signing in...' : 'Sign in with Google'}
              </button>
              {error && (
                <div className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'} max-w-sm mx-auto`}>
                  {error}
                </div>
              )}
            </>
          ) : (
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Signed in as {user.email}
            </div>
          )}

          <button
            onClick={onViewStory}
            className={`px-8 py-3 rounded-full text-sm sm:text-base font-medium transition-all hover:scale-105 ${
              darkMode
                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-300'
            }`}
            style={{
              backdropFilter: 'blur(10px)',
              boxShadow: darkMode
                ? '0 0 25px rgba(251, 191, 36, 0.35)'
                : '0 0 25px rgba(252, 211, 77, 0.45)',
            }}
          >
            ✨ The Story Behind the App
          </button>
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
