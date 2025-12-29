import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Heart, BookOpen, Target, User } from 'lucide-react';
import useStore from '../store/useStore';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const darkMode = useStore((state) => state.darkMode);

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/health', icon: Heart, label: 'Health' },
    // { path: '/story-bank', icon: BookOpen, label: 'Stories' }, // DISABLED - Investigating hooks error
    { path: '/productivity', icon: Target, label: 'Focus' },
    { path: '/settings', icon: User, label: 'Settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 border-t ${
      darkMode
        ? 'bg-gray-900/95 border-gray-800 backdrop-blur-xl'
        : 'bg-white/95 border-gray-200 backdrop-blur-xl'
    }`}
    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all min-w-[60px] ${
                  active
                    ? darkMode
                      ? 'text-purple-400'
                      : 'text-purple-600'
                    : darkMode
                    ? 'text-gray-500 hover:text-gray-300'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon
                  size={24}
                  strokeWidth={active ? 2.5 : 2}
                  className={active ? 'mb-1' : 'mb-1'}
                />
                <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
