import React from 'react';
import { ArrowLeft, Heart, Zap, Brain, Sparkles, ArrowRight } from 'lucide-react';

const StoryPage = ({ onBack, onEnter, darkMode }) => {
  return (
    <div className={`min-h-screen overflow-x-hidden ${
      darkMode ? 'bg-[#191919]' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50'
    }`} style={{ position: 'fixed', width: '100%', height: '100%', overflowY: 'auto' }}>
      {/* Back button */}
      <div className="sticky top-0 z-20 backdrop-blur-xl border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className={`flex items-center space-x-2 transition-all ${
              darkMode
                ? 'text-purple-400 hover:text-purple-300'
                : 'text-purple-600 hover:text-purple-700'
            }`}
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Hero section */}
        <div className="text-center space-y-6">
          <h1 className={`text-4xl md:text-5xl font-bold ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            The Story Behind{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              DualTrack OS
            </span>
          </h1>
          <p className={`text-lg md:text-xl leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            A personal operating system born from a simple truth: no woman should have to choose between her power and her peace.
          </p>
        </div>

        {/* The Reality */}
        <div className={`rounded-2xl p-8 ${
          darkMode
            ? 'bg-gradient-to-br from-rose-900/30 via-pink-900/20 to-rose-900/30 border-2 border-rose-500/30'
            : 'bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200'
        }`}>
          <h2 className={`text-2xl md:text-3xl font-bold mb-6 flex items-center ${
            darkMode ? 'text-rose-300' : 'text-rose-800'
          }`}>
            <Heart className="mr-3" size={32} />
            The Reality We Navigate
          </h2>
          <div className={`space-y-4 text-base md:text-lg leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <p>
              Every day, women are expected to show up fully present, high-performing, emotionally available in every domain of life.
            </p>
            <p className="font-medium">
              At work: Strategic thinker. Leader. Expert. Always one step ahead.
            </p>
            <p className="font-medium">
              With family: Nurturing presence. Patient listener. Rock-solid support.
            </p>
            <p className="font-medium">
              In relationships: Emotionally available. Deeply connected. Fully engaged.
            </p>
            <p className="font-medium">
              For friendships: Present. Supportive. The one who shows up.
            </p>
            <p className="font-medium">
              Building a side business: Visionary. Hustler. Risk-taker.
            </p>
            <p className="mt-6 italic">
              And society expects you to do all of this at the same capacity, every single day.
            </p>
          </div>
        </div>

        {/* The Internal Reality */}
        <div className={`rounded-2xl p-8 ${
          darkMode
            ? 'bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 border-2 border-purple-500/30'
            : 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200'
        }`}>
          <h2 className={`text-2xl md:text-3xl font-bold mb-6 flex items-center ${
            darkMode ? 'text-purple-300' : 'text-purple-800'
          }`}>
            <Zap className="mr-3" size={32} />
            But Here's What They Don't Tell You
          </h2>
          <div className={`space-y-4 text-base md:text-lg leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <p className="font-bold text-xl">
              Your biology operates on cycles. Your energy ebbs and flows. Your hormones create natural rhythms.
            </p>
            <p>
              Some days you wake up with a 5/5 energy—ready to conquer the world, close the deal, lead the meeting, write the proposal.
            </p>
            <p>
              Other days you're at 2/5—brain fog thick, motivation low, body asking for rest—but the world still demands your full presence.
            </p>
            <p className="mt-6 font-medium">
              The truth? Your menstrual cycle affects your energy. Stress impacts your hormones. Sleep deprivation changes your capacity. Perimenopause and menopause bring tidal waves of change. Postpartum recovery is real. ADHD makes executive function variable.
            </p>
            <p className="mt-6 italic bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent font-bold text-xl">
              And NO productivity system accounts for this.
            </p>
          </div>
        </div>

        {/* The Lioness - Shakti */}
        <div className={`rounded-2xl p-8 ${
          darkMode
            ? 'bg-gradient-to-br from-orange-900/30 via-amber-900/20 to-orange-900/30 border-2 border-orange-500/30'
            : 'bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200'
        }`}>
          <h2 className={`text-2xl md:text-3xl font-bold mb-6 flex items-center ${
            darkMode ? 'text-orange-300' : 'text-orange-800'
          }`}>
            <Sparkles className="mr-3" size={32} />
            Enter the Lioness: Shakti in Motion
          </h2>
          <div className={`space-y-6 text-base md:text-lg leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <p className="font-bold text-xl">
              From the founder's deep Indian heritage and the sacred traditions of Shakti, we chose the lioness—Durga's divine companion—as our spirit animal.
            </p>

            <div className="space-y-4">
              <p className="font-medium flex items-start gap-3">
                <img src="/lioness-logo.png" alt="Lioness" className="w-12 h-12 inline-block flex-shrink-0" style={{ filter: 'drop-shadow(0 0 8px rgba(251, 146, 60, 0.6))' }} />
                <strong>The Lioness represents controlled power, not aggression.</strong>
              </p>
              <p className="pl-8">
                She doesn't roar at every challenge. She observes. She waits. She chooses her battles. She knows when to pounce and when to rest in the tall grass.
              </p>

              <p className="font-medium flex items-start gap-3">
                <img src="/lioness-logo.png" alt="Lioness" className="w-12 h-12 inline-block flex-shrink-0" style={{ filter: 'drop-shadow(0 0 8px rgba(251, 146, 60, 0.6))' }} />
                <strong>She embodies Shakti—the primordial cosmic energy of creation.</strong>
              </p>
              <p className="pl-8">
                Shakti is not about doing more. It's about harnessing your energy wisely. It's the force that creates worlds, but also the wisdom that knows rest is sacred.
              </p>

              <p className="font-medium flex items-start gap-3">
                <img src="/lioness-logo.png" alt="Lioness" className="w-12 h-12 inline-block flex-shrink-0" style={{ filter: 'drop-shadow(0 0 8px rgba(251, 146, 60, 0.6))' }} />
                <strong>She masters raw power while staying centered in chaos.</strong>
              </p>
              <p className="pl-8">
                Goddess Durga rides the lioness into battle against demons—but she doesn't fight frantically. She moves with intention. She protects what matters. She destroys only what threatens balance.
              </p>

              <p className="font-medium flex items-start gap-3">
                <img src="/lioness-logo.png" alt="Lioness" className="w-12 h-12 inline-block flex-shrink-0" style={{ filter: 'drop-shadow(0 0 8px rgba(251, 146, 60, 0.6))' }} />
                <strong>She balances fierceness with nurturing.</strong>
              </p>
              <p className="pl-6">
                The lioness hunts to feed her pride. She protects her young. She leads with strength and cares with depth. She doesn't choose between power and love—she IS both.
              </p>
            </div>

            <div className={`mt-8 p-6 rounded-xl ${
              darkMode
                ? 'bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-500/30'
                : 'bg-gradient-to-r from-cyan-100 to-purple-100 border border-cyan-300'
            }`}>
              <p className="font-bold text-xl mb-3 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                This is DualTrack OS.
              </p>
              <p>
                A system that honors your inner lioness. One that recognizes your 2/5 energy days are not failures—they're part of your natural rhythm. One that celebrates your 5/5 days as opportunities to leap, not obligations to overextend.
              </p>
            </div>
          </div>
        </div>

        {/* The Vision */}
        <div className={`rounded-2xl p-8 ${
          darkMode
            ? 'bg-gradient-to-br from-cyan-900/30 via-blue-900/20 to-cyan-900/30 border-2 border-cyan-500/30'
            : 'bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200'
        }`}>
          <h2 className={`text-2xl md:text-3xl font-bold mb-6 flex items-center ${
            darkMode ? 'text-cyan-300' : 'text-cyan-800'
          }`}>
            <Brain className="mr-3" size={32} />
            Why DualTrack Exists
          </h2>
          <div className={`space-y-4 text-base md:text-lg leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <p>
              Because you deserve a system that adapts to YOU—not one that demands you adapt to it.
            </p>
            <p>
              Because running a corporate career AND a side business AND a full life requires different strategies on different days.
            </p>
            <p>
              Because hormonal fluctuations are not weaknesses—they're biological realities that can be worked WITH, not against.
            </p>
            <p>
              Because Shakti is not about constant output—it's about intentional energy flow.
            </p>
            <p className="font-bold text-xl mt-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              You are not failing at balance. You are navigating a system that was never designed for your reality.
            </p>
            <p className="font-bold text-xl">
              DualTrack OS is designed FOR your reality. For your cycles. For your ambitions. For your humanity.
            </p>
          </div>
        </div>

        {/* Closing */}
        <div className="text-center space-y-6 py-8">
          <p className="text-2xl md:text-3xl font-medium italic leading-relaxed bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 bg-clip-text text-transparent" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', textShadow: '0 0 30px rgba(236, 72, 153, 0.4)' }}>
            "Real strength comes from vulnerability, setting boundaries, and showing up as your full, imperfect self even when the outcome is uncertain."
          </p>
          <p className={`text-lg font-medium ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>
            - Brené Brown
          </p>
          <p className={`text-2xl md:text-3xl font-semibold mt-12 leading-relaxed ${
            darkMode ? 'text-purple-400' : 'text-purple-700'
          }`}>
            Welcome to your OS.<br />You got this.
          </p>

          {/* Enter Button */}
          {onEnter && (
            <div className="mt-8">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryPage;
