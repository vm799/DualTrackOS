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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center">

        {/* CENTERED LOGO + BRANDING */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="mb-6 sm:mb-8 flex justify-center">
            <Logo size="xlarge" className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[520px] md:h-[520px] animate-fade-in" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-4 sm:mb-6">
            <span className={darkMode ? 'text-gray-100' : 'text-gray-900'}>
              DualTrack
            </span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              OS
            </span>
          </h1>

          <p
            className={`text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-6 sm:mb-8 max-w-3xl ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}
          >
            Your companion through every challenge, cycle, and chapter
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
              Start Your Day
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1 text-purple-500"
              />
            </span>
          </button>
        </div>

        {/* BOTTOM — Auth & Story (Subtle) */}
        <div className="pb-4 sm:pb-6 space-y-2">
          {!user ? (
            <>
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all hover:opacity-80 flex items-center gap-2 mx-auto ${
                  signingIn
                    ? 'opacity-50 cursor-not-allowed'
                    : 'opacity-60'
                } ${
                  darkMode
                    ? 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/20'
                    : 'bg-gray-900/5 hover:bg-gray-900/10 text-gray-500 border border-gray-300'
                }`}
              >
                <LogIn size={14} className={signingIn ? 'animate-spin' : ''} />
                {signingIn ? 'Signing in...' : 'Sign in with Google'}
              </button>
              {error && (
                <div className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-600'} max-w-sm mx-auto`}>
                  {error}
                </div>
              )}
            </>
          ) : (
            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Signed in as {user.email}
            </div>
          )}

          <button
            onClick={onViewStory}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all hover:opacity-80 opacity-60 ${
              darkMode
                ? 'bg-amber-500/10 hover:bg-amber-500/15 text-amber-400/80 border border-amber-500/20'
                : 'bg-amber-100/50 hover:bg-amber-100 text-amber-600/80 border border-amber-300/50'
            }`}
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
