import React from 'react';
import { ArrowRight } from 'lucide-react';

const LandingPage = ({ onEnter, onViewStory, darkMode }) => {
  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${
      darkMode ? 'bg-[#191919]' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50'
    }`} style={{ position: 'fixed', width: '100%', height: '100%', overflowY: 'auto' }}>
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-purple-300 to-pink-300'
        } animate-pulse`} style={{ animationDuration: '4s' }}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-gradient-to-r from-cyan-600 to-purple-600' : 'bg-gradient-to-r from-cyan-300 to-purple-300'
        } animate-pulse`} style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
      </div>

      {/* Main content - Centered, tighter spacing */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        {/* Logo - Lioness - 3x Larger */}
        <div className="mb-2 animate-fade-in">
          <div className="relative">
            {/* Actual Logo Image - 3x Larger */}
            <img
              src="/lioness-logo.png"
              alt="DualTrack OS Lioness Logo"
              className="w-[400px] h-[400px] md:w-[550px] md:h-[550px] lg:w-[650px] lg:h-[650px] mx-auto drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Brand name - directly under logo */}
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          <span className={darkMode ? 'text-gray-100' : 'text-gray-900'}>DualTrack</span>{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            OS
          </span>
        </h1>

        {/* Strapline */}
        <p className={`text-base md:text-lg mb-4 leading-relaxed font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          The operating system powering every role she runs, every day.
        </p>

        {/* Motivation message */}
        <p className={`text-sm md:text-base mb-6 italic font-light ${
          darkMode ? 'text-purple-400' : 'text-purple-600'
        }`}>
          Take a breath. You got this. Lets do it.
        </p>

        {/* Enter button - Rectangle with gradient neon border */}
        <button
          onClick={onEnter}
          className={`group relative px-12 py-5 font-bold text-xl transition-all duration-300 transform hover:scale-105 ${
            darkMode ? 'bg-gray-900' : 'bg-white'
          }`}
          style={{
            border: '3px solid transparent',
            borderImage: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 33%, #ec4899 66%, #fb923c 100%) 1',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)'
          }}
        >
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center space-x-2">
            <span>Enter Here</span>
            <ArrowRight className="transition-transform group-hover:translate-x-1 text-purple-500" size={24} />
          </span>
        </button>
      </div>

      {/* Story link - Fixed at bottom, always visible */}
      <div className="relative z-10 pb-4 px-6 text-center">
        <button
          onClick={onViewStory}
          className={`px-10 py-4 rounded-full font-medium text-sm md:text-base transition-all hover:scale-105 ${
            darkMode
              ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
              : 'bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-300'
          }`}
          style={{
            boxShadow: darkMode
              ? '0 0 30px rgba(251, 191, 36, 0.4), 0 8px 30px rgba(251, 191, 36, 0.2)'
              : '0 0 30px rgba(252, 211, 77, 0.5), 0 8px 30px rgba(245, 158, 11, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
        >
          ✨ The Story Behind the App
        </button>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
