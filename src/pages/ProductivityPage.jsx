import React from 'react';
import { ArrowLeft, Target, Clock, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import KanbanBoard from '../components/KanbanBoard';
import HourlyTaskDisplay from '../components/HourlyTaskDisplay';
import SectionHeader from '../components/SectionHeader';
import BottomNavigation from '../components/BottomNavigation';
import Logo from '../components/Logo';

const ProductivityPage = () => {
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className={`min-h-screen ${
      darkMode ? 'bg-[#191919]' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`sticky top-0 z-20 backdrop-blur-xl border-b ${
        darkMode
          ? 'bg-gray-900/95 border-gray-800/50'
          : 'bg-white/95 border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className={`p-2 rounded-lg transition-all ${
                  darkMode
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Productivity
                </h1>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Task management and focus tools
                </p>
              </div>
            </div>
            <Logo size="medium" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6 pb-32">

          {/* Hourly Task Display */}
          <SectionHeader
            emoji="⏰"
            title="Today's Schedule"
            description="Your time-blocked tasks for the day"
          />
          <HourlyTaskDisplay />

          {/* Kanban Board */}
          <SectionHeader
            emoji="📋"
            title="Task Board"
            description="Organize your work: Backlog → In Progress → Done"
          />
          <KanbanBoard />

        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ProductivityPage;
