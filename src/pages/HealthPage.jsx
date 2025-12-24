import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import CycleTracker from '../components/CycleTracker';
import BinaryDailyCheckin from '../components/BinaryDailyCheckin';
import PullUpProgressionTracker from '../components/PullUpProgressionTracker';
import WeeklyTrainingSchedule from '../components/WeeklyTrainingSchedule';
import SectionHeader from '../components/SectionHeader';
import FeaturePreview from '../components/FeaturePreview';
import BottomNavigation from '../components/BottomNavigation';
import Logo from '../components/Logo';

/**
 * HealthPage - Combined hormonal health and cycle tracking
 * Adapts content based on user's life stage
 */
const HealthPage = () => {
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);
  const userProfile = useStore((state) => state.userProfile);

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
                  Health & Cycle
                </h1>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Hormonal health and wellness tracking
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

          {/* Content adapts based on life stage */}
          {userProfile.lifeStage === 'perimenopause' || userProfile.lifeStage === 'postmenopause' ? (
            <>
              {/* Strong50 Daily Check-in */}
              <SectionHeader
                emoji="✅"
                title="Strong50 Daily Check-in"
                description="Tick boxes. Close the day."
              />
              <BinaryDailyCheckin />

              {/* Weekly Training Schedule */}
              <SectionHeader
                emoji="📅"
                title="Weekly Training Schedule"
                description="Set it once, repeat weekly"
              />
              <WeeklyTrainingSchedule />

              {/* Pull-Up Progression */}
              <SectionHeader
                emoji="💪"
                title="Pull-Up Progression"
                description="Master the skill, one stage at a time"
              />
              <PullUpProgressionTracker />
            </>
          ) : (
            <>
              {/* Cycle Tracker for menstruating users */}
              <SectionHeader
                emoji="🌙"
                title="Your Cycle-Aware Companion"
                description="Workouts & nutrition that sync with your hormones"
                badge="Preview: Today's tips"
              />
              <FeaturePreview
                feature="cycleTracking"
                requiredTier="starter"
                previewLimits={{
                  showPhase: true,
                  showTip: true,
                  lockWorkouts: true,
                  lockNutrition: true,
                  description: "Phase info only"
                }}
                upgradeMessage={{
                  title: "Unlock Your Full Cycle Guide",
                  benefits: [
                    "Detailed workout recommendations",
                    "Cycle-synced nutrition plans",
                    "Historical tracking"
                  ],
                  cta: "Get Starter for $4.99/mo"
                }}
              >
                <CycleTracker />
              </FeaturePreview>
            </>
          )}

        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default HealthPage;
