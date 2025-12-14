import React from 'react';
import { ArrowRight } from 'lucide-react';

const LandingPage = ({ onEnter, onViewStory, darkMode }) => {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden ${
      darkMode ? 'bg-[#191919]' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50'
    }`}>
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-purple-300 to-pink-300'
        } animate-pulse`} style={{ animationDuration: '4s' }}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-gradient-to-r from-cyan-600 to-purple-600' : 'bg-gradient-to-r from-cyan-300 to-purple-300'
        } animate-pulse`} style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-2xl">
        {/* Logo - Lioness */}
        <div className="mb-8 animate-fade-in">
          <div className="relative">
            {/* Actual Logo Image */}
            <img
              src="/lioness-logo.png"
              alt="DualTrack OS Lioness Logo"
              className="w-48 h-48 md:w-56 md:h-56 mx-auto drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className={darkMode ? 'text-gray-100' : 'text-gray-900'}>DualTrack</span>{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            OS
          </span>
        </h1>

        {/* Strapline */}
        <p className={`text-lg md:text-xl mb-6 leading-relaxed font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          The operating system powering every role she runs, every day.
        </p>

        {/* Motivation message */}
        <p className={`text-base md:text-lg mb-12 italic font-light ${
          darkMode ? 'text-purple-400' : 'text-purple-600'
        }`}>
          Take a breath. You got this. Lets do it.
        </p>

        {/* Enter button */}
        <button
          onClick={onEnter}
          className="group relative px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl mb-8"
          style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 33%, #ec4899 66%, #fb923c 100%)'
          }}
        >
          <span className="text-white flex items-center space-x-2">
            <span>Enter Here</span>
            <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
          </span>
        </button>

        {/* Story link - moved to bottom with highlight */}
        <button
          onClick={onViewStory}
          className={`px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 ${
            darkMode
              ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-2 border-amber-500/40'
              : 'bg-amber-100 hover:bg-amber-200 text-amber-700 border-2 border-amber-300'
          }`}
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
