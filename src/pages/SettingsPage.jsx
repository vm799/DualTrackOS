import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Bell, Moon, Sun, Mail, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import useStore from '../store/useStore';

/**
 * Settings Page
 * User preferences, profile settings, and waitlist signup for early features
 */
const SettingsPage = () => {
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);
  const setDarkMode = useStore((state) => state.setDarkMode);
  const user = useStore((state) => state.user);
  const userProfile = useStore((state) => state.userProfile);

  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (waitlistEmail.trim()) {
      // TODO: Implement actual waitlist submission to backend
      console.log('Waitlist signup:', waitlistEmail);
      setWaitlistSubmitted(true);
      setTimeout(() => {
        setWaitlistSubmitted(false);
        setWaitlistEmail('');
      }, 3000);
    }
  };

  return (
    <div className={`min-h-screen transition-all ${
      darkMode ? 'bg-[#191919] text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className={`sticky top-0 z-20 border-b ${
        darkMode ? 'bg-gray-900/95 border-gray-800 backdrop-blur-lg' : 'bg-white/95 border-gray-200 backdrop-blur-lg'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className={`p-2 rounded-lg transition-all ${
                darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <Settings className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={28} />
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* User Profile Section */}
        {user && (
          <section className={`rounded-2xl p-6 mb-6 ${
            darkMode ? 'bg-gray-800/50 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <User className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={24} />
              <h2 className="text-xl font-bold">Profile</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Email
                </label>
                <p className={`mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {user.email}
                </p>
              </div>
              {userProfile.weight && (
                <div>
                  <label className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Weight
                  </label>
                  <p className={`mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {userProfile.weight} lbs
                  </p>
                </div>
              )}
              {userProfile.spiritAnimal && (
                <div>
                  <label className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Spirit Animal
                  </label>
                  <p className={`mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {userProfile.spiritAnimal}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Appearance Section */}
        <section className={`rounded-2xl p-6 mb-6 ${
          darkMode ? 'bg-gray-800/50 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            {darkMode ? (
              <Moon className="text-purple-400" size={24} />
            ) : (
              <Sun className="text-purple-600" size={24} />
            )}
            <h2 className="text-xl font-bold">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Dark Mode
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Switch between light and dark themes
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-8 rounded-full transition-all ${
                darkMode ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-all ${
                darkMode ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>
        </section>

        {/* Notifications Section */}
        <section className={`rounded-2xl p-6 mb-6 ${
          darkMode ? 'bg-gray-800/50 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <Bell className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={24} />
            <h2 className="text-xl font-bold">Notifications</h2>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Notification preferences coming soon...
          </p>
        </section>

        {/* Waitlist Section */}
        <section className={`rounded-2xl p-6 ${
          darkMode ? 'bg-gradient-to-br from-purple-900/40 via-pink-900/20 to-purple-900/40 border-2 border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <Mail className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={24} />
            <h2 className="text-xl font-bold">Early Access Waitlist</h2>
          </div>
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Get early access to new features before they launch! We'll notify you when exciting updates are ready.
          </p>

          {waitlistSubmitted ? (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${
              darkMode ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-emerald-100 border border-emerald-300'
            }`}>
              <CheckCircle className={darkMode ? 'text-emerald-400' : 'text-emerald-600'} size={24} />
              <div>
                <p className={`font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  You're on the list!
                </p>
                <p className={`text-sm ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                  We'll email you at {waitlistEmail} when new features drop.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="flex gap-2">
              <input
                type="email"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                placeholder="Enter your email"
                className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                }`}
                required
              />
              <button
                type="submit"
                className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  darkMode
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <Send size={18} />
                Join
              </button>
            </form>
          )}

          <div className={`mt-4 p-3 rounded-lg ${
            darkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-100 border border-purple-300'
          }`}>
            <p className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
              Upcoming features: Team collaboration, advanced analytics, mobile app, AI-powered insights, and more!
            </p>
          </div>
        </section>

        {/* App Info */}
        <div className={`mt-8 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          <p>DualTrack OS v1.0.0</p>
          <p className="mt-1">Built for peak productivity and wellness</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
