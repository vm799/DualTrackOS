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
            {/* SVG Lioness Logo */}
            <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-2xl">
              <defs>
                <linearGradient id="lionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                  <stop offset="33%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                  <stop offset="66%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#fb923c', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              {/* Simplified lioness/tigress silhouette with flowing mane */}
              <g fill="url(#lionGradient)" stroke="url(#lionGradient)" strokeWidth="2">
                {/* Head circle */}
                <circle cx="100" cy="90" r="35" fillOpacity="0.9" />
                {/* Ears */}
                <path d="M 75 65 Q 70 50 75 55 Q 80 60 75 65 Z" />
                <path d="M 125 65 Q 130 50 125 55 Q 120 60 125 65 Z" />
                {/* Eyes */}
                <circle cx="90" cy="85" r="4" fill={darkMode ? "#fff" : "#1a1a1a"} />
                <circle cx="110" cy="85" r="4" fill={darkMode ? "#fff" : "#1a1a1a"} />
                {/* Nose */}
                <path d="M 100 95 L 95 100 L 100 102 L 105 100 Z" fill={darkMode ? "#fff" : "#1a1a1a"} />
                {/* Flowing mane - left side */}
                <path d="M 70 75 Q 50 70 45 85 Q 40 100 50 110" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 68 85 Q 48 82 43 95 Q 38 108 48 118" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 70 95 Q 50 94 45 107 Q 40 120 50 130" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 75 105 Q 55 106 50 119 Q 45 132 55 142" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Flowing mane - right side */}
                <path d="M 130 75 Q 150 70 155 85 Q 160 100 150 110" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 132 85 Q 152 82 157 95 Q 162 108 152 118" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 130 95 Q 150 94 155 107 Q 160 120 150 130" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 125 105 Q 145 106 150 119 Q 155 132 145 142" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Flowing mane - bottom */}
                <path d="M 85 115 Q 80 135 75 145 Q 70 155 75 160" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 100 120 Q 100 140 100 150 Q 100 160 100 165" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 115 115 Q 120 135 125 145 Q 130 155 125 160" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Decorative dots at mane ends */}
                <circle cx="50" cy="110" r="2.5" />
                <circle cx="48" cy="118" r="2.5" />
                <circle cx="50" cy="130" r="2.5" />
                <circle cx="55" cy="142" r="2.5" />
                <circle cx="150" cy="110" r="2.5" />
                <circle cx="152" cy="118" r="2.5" />
                <circle cx="150" cy="130" r="2.5" />
                <circle cx="145" cy="142" r="2.5" />
                <circle cx="75" cy="160" r="2.5" />
                <circle cx="100" cy="165" r="2.5" />
                <circle cx="125" cy="160" r="2.5" />
              </g>
            </svg>
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
          Take a breath. You got this. Let's do this.
        </p>

        {/* Enter button */}
        <button
          onClick={onEnter}
          className="group relative px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 33%, #ec4899 66%, #fb923c 100%)'
          }}
        >
          <span className="text-white flex items-center space-x-2">
            <span>Enter Here</span>
            <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
          </span>
        </button>

        {/* Story link at bottom */}
        <div className="absolute bottom-8 left-0 right-0">
          <button
            onClick={onViewStory}
            className={`text-sm font-medium transition-all hover:scale-105 ${
              darkMode
                ? 'text-purple-400 hover:text-purple-300'
                : 'text-purple-600 hover:text-purple-700'
            }`}
          >
            ✨ The Story Behind the App
          </button>
        </div>
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
