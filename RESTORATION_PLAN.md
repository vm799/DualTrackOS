# DualTrack OS - Feature Restoration Plan
## Comprehensive Analysis & Implementation Roadmap

**Date:** 2025-12-21
**Branch:** `claude/production-optimization-eKpTu`
**Goal:** Restore all functionality lost during refactor while maintaining clean, production-ready code

---

## 🔍 AUDIT SUMMARY

### ✅ Features Currently Working:
1. **Wellness Snack Modal** - Fully functional
   - Exercise snacks (squats, pushups, etc.) with rep counter
   - Box breathing component
   - Hydration tracking
   - Snooze (15 min) and Dismiss options
   - Hourly triggers (9am-5pm active hours)
   - Location: `src/components/WellnessSnackModal.jsx`

2. **Supabase Integration** - Fully configured
   - Google OAuth sign-in available (`signInWithGoogle()`)
   - User data persistence to Supabase + localStorage fallback
   - Auth state management
   - Location: `src/services/dataService.js`, `src/supabaseClient.js`

3. **Dashboard Components** - All rendering
   - HourlyTaskDisplay
   - EnergyMoodTracker
   - ProteinTracker
   - VoiceDiary
   - LearningLibrary
   - KanbanBoard
   - DailyCommandCenterModal

4. **Header & Navigation** - Restored
   - Sticky header with logo
   - Clock with Pomodoro trigger
   - Dark mode toggle
   - Scroll animations

---

## ❌ LOST/MISSING FEATURES:

### 1. **NDM (Non-Negotiables Daily Manager) Status Bar**
**Status:** Component exists but NOT rendered
**File:** `src/components/NDMStatusBar.jsx`

**What it does:**
- Displays progress for 4 daily non-negotiables:
  1. **Nutrition** - Protein-rich breakfast
  2. **Movement** - HIIT/exercise
  3. **Mindfulness** - Meditation/breathing
  4. **Brain Dump** - Thought capture
- Shows completion count (X/4)
- Progress bar visualization
- Each item clickable to navigate to relevant view

**Why it's missing:**
- Old App.jsx line 1337 has it commented out
- Requires state management for `ndm` object
- Requires `setCurrentView`, `openMindfulMoment`, `openBrainDump` handlers

**Restoration needed:**
- [ ] Create NDM store (Zustand)
- [ ] Implement handler functions
- [ ] Add to Dashboard render
- [ ] Connect to currentView navigation system

---

### 2. **Settings/Insights Page**
**Status:** Never implemented (planned but incomplete)
**Evidence:** `currentView` state exists with 'insights' option

**What it should include:**
- **User Profile Management**
  - Edit name, initials, age, weight
  - Change avatar/spirit animal
  - Update preferences

- **Authentication Section**
  - Google OAuth sign-in button
  - Sign-out option
  - User session info

- **Waitlist Signup** (if not authenticated)
  - Email input
  - Waitlist CTA
  - "Coming soon" features

- **Balance/Spirit Animal Score**
  - Display current score
  - Growth progress (egg → kitsune)
  - Balance history graph

- **App Settings**
  - Dark/light mode toggle
  - Notification preferences
  - Active hours configuration
  - Data export/import

- **About Section**
  - Version info
  - Credits
  - Privacy policy link

**Implementation needed:**
- [ ] Create `src/pages/SettingsPage.jsx`
- [ ] Add currentView state to Dashboard
- [ ] Create Settings route/modal
- [ ] Build authentication UI
- [ ] Build waitlist form component
- [ ] Connect to Supabase auth

---

### 3. **Full-Screen Pomodoro Focus Mode**
**Status:** State exists but feature never implemented
**Evidence:** `showPomodoroFullScreen` state in old app (line 75)

**What it should do:**
- When Pomodoro timer starts → fullscreen overlay
- Full-screen immersive timer display
- Blocks all distractions
- Large countdown timer (center screen)
- Minimal controls (Pause, Exit only)
- Dark overlay behind timer (z-50)
- Optional: ambient focus animation/background

**Implementation needed:**
- [ ] Create fullscreen overlay component
- [ ] Add `showPomodoroFullScreen` to Pomodoro store
- [ ] Trigger on `startPomodoro()`
- [ ] Render at root level (z-index 50)
- [ ] Add keyboard shortcuts (ESC to exit)

---

### 4. **Multi-View Navigation System**
**Status:** Partially exists but not connected
**Evidence:** `currentView` state with options: 'dashboard', 'food', 'exercise', 'learn', 'settings', 'workout-active'

**What it enables:**
- Switch between different app sections
- NDM items navigate to relevant views
- Settings toggle
- Deep linking to specific features

**Views needed:**
- ✅ `dashboard` - Main dashboard (current)
- ❌ `food` - Nutrition/meal tracking view
- ❌ `exercise` - Workout/movement view
- ❌ `learn` - Learning library view
- ❌ `settings` - Settings/insights page
- ❌ `workout-active` - Active workout mode

**Implementation needed:**
- [ ] Add `currentView` state to Dashboard
- [ ] Create view components or use modals
- [ ] Add navigation controls
- [ ] Update NDM handlers to switch views

---

### 5. **OAuth Sign-In UI**
**Status:** Backend ready, UI missing

**What exists:**
- ✅ `signInWithGoogle()` function
- ✅ `signOut()` function
- ✅ Session management
- ✅ Auto-save to Supabase on auth

**What's missing:**
- ❌ Sign-in button UI
- ❌ User profile dropdown/menu
- ❌ Sign-out button
- ❌ "Signed in as..." indicator

**Implementation needed:**
- [ ] Add sign-in button to landing page
- [ ] Add user menu to dashboard header
- [ ] Show auth status indicator
- [ ] Handle auth redirects
- [ ] Display user info from session

---

## 📋 IMPLEMENTATION PRIORITIES

### Phase 1: Critical Functionality (Week 1)
**Priority: HIGH** - Core features users expect

1. **Restore NDM Status Bar**
   - File: `src/store/useNDMStore.js` (create)
   - Update: `src/pages/Dashboard.jsx`
   - Est: 2-3 hours

2. **Implement Full-Screen Pomodoro**
   - File: `src/components/PomodoroFullScreen.jsx` (create)
   - Update: `src/store/usePomodoroStore.js`
   - Update: `src/pages/Dashboard.jsx`
   - Est: 3-4 hours

3. **Add OAuth Sign-In UI**
   - Update: `src/pages/LandingPage.jsx`
   - Update: `src/pages/Dashboard.jsx` (user menu)
   - Est: 2-3 hours

### Phase 2: Settings & Profile Management (Week 2)
**Priority: MEDIUM** - Important for retention

4. **Create Settings Page**
   - File: `src/pages/SettingsPage.jsx` (create)
   - Components:
     - `src/components/UserProfileEditor.jsx`
     - `src/components/AuthSection.jsx`
     - `src/components/WaitlistForm.jsx`
     - `src/components/SpiritAnimalCard.jsx` (exists, enhance)
   - Est: 6-8 hours

5. **Implement Multi-View Navigation**
   - Update: `src/pages/Dashboard.jsx`
   - Add routing or modal system
   - Est: 3-4 hours

### Phase 3: Additional Views (Week 3)
**Priority: LOW** - Nice to have

6. **Food/Nutrition View**
   - File: `src/pages/FoodView.jsx` (create)
   - Est: 4-5 hours

7. **Exercise/Movement View**
   - File: `src/pages/ExerciseView.jsx` (create)
   - Est: 4-5 hours

8. **Learning Library Enhancement**
   - Enhance existing component
   - Add full-view mode
   - Est: 2-3 hours

---

## 🏗️ TECHNICAL ARCHITECTURE

### State Management Structure:

```javascript
// Existing Stores (Zustand)
useStore.js              // Global: user, darkMode, userProfile, currentTime
usePomodoroStore.js      // Pomodoro timer state
useWellnessStore.js      // Wellness snacks state
useDailyMetricsStore.js  // Daily metrics tracking

// NEW Stores Needed:
useNDMStore.js           // Non-negotiables tracking
useViewStore.js          // Current view navigation
useAuthStore.js          // User auth session (optional, could use useStore)
```

### Component Hierarchy:

```
App.jsx
└─ Router.jsx
   ├─ LandingPage/
   │  └─ SignInButton (NEW)
   ├─ OnboardingPage/
   └─ Dashboard/
      ├─ Header (with User Menu - NEW)
      ├─ NDMStatusBar (RESTORE)
      ├─ Components (existing)
      ├─ SettingsPage (NEW - modal or route)
      └─ PomodoroFullScreen (NEW - overlay)
```

---

## 🎯 DETAILED IMPLEMENTATION STEPS

### STEP 1: Restore NDM Status Bar

**Files to create:**
```bash
src/store/useNDMStore.js
```

**Files to modify:**
```bash
src/pages/Dashboard.jsx
```

**Implementation:**

1. **Create NDM Store:**
```javascript
// src/store/useNDMStore.js
import { create } from 'zustand';

const useNDMStore = create((set) => ({
  ndm: {
    nutrition: false,
    movement: false,
    mindfulness: false,
    brainDump: false
  },

  setNutrition: (value) => set((state) => ({
    ndm: { ...state.ndm, nutrition: value }
  })),

  setMovement: (value) => set((state) => ({
    ndm: { ...state.ndm, movement: value }
  })),

  setMindfulness: (value) => set((state) => ({
    ndm: { ...state.ndm, mindfulness: value }
  })),

  setBrainDump: (value) => set((state) => ({
    ndm: { ...state.ndm, brainDump: value }
  })),

  resetNDM: () => set({
    ndm: {
      nutrition: false,
      movement: false,
      mindfulness: false,
      brainDump: false
    }
  })
}));

export default useNDMStore;
```

2. **Add to Dashboard:**
```javascript
// In Dashboard.jsx
import NDMStatusBar from '../components/NDMStatusBar';
import useNDMStore from '../store/useNDMStore';

// Inside Dashboard component:
const ndm = useNDMStore((state) => state.ndm);
const [currentView, setCurrentView] = useState('dashboard');

const openMindfulMoment = () => {
  // Open box breathing modal
  useWellnessStore.getState().setWellnessSnackChoice('breathing');
  useWellnessStore.getState().setBoxBreathingActive(true);
  useWellnessStore.getState().setShowWellnessSnackModal(true);
};

const openBrainDump = () => {
  // TODO: Create brain dump modal or navigate to kanban
  setCurrentView('dashboard');
};

// In render, after header:
<NDMStatusBar
  ndm={ndm}
  darkMode={darkMode}
  setCurrentView={setCurrentView}
  openMindfulMoment={openMindfulMoment}
  openBrainDump={openBrainDump}
/>
```

3. **Connect to daily reset:**
```javascript
// Reset NDM at midnight
useEffect(() => {
  const checkMidnight = setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      useNDMStore.getState().resetNDM();
    }
  }, 60000); // Check every minute

  return () => clearInterval(checkMidnight);
}, []);
```

---

### STEP 2: Implement Full-Screen Pomodoro

**Files to create:**
```bash
src/components/PomodoroFullScreen.jsx
```

**Files to modify:**
```bash
src/store/usePomodoroStore.js
src/pages/Dashboard.jsx
```

**Implementation:**

1. **Update Pomodoro Store:**
```javascript
// In usePomodoroStore.js
// Add to state:
showFullScreen: false,

// Update actions:
startPomodoro: () => set({
  pomodoroRunning: true,
  showFullScreen: true  // Enable fullscreen
}),

pausePomodoro: () => set({
  pomodoroRunning: false,
  showFullScreen: false  // Exit fullscreen
}),

resetPomodoro: () => set({
  pomodoroSeconds: POMODORO_DURATION_SECONDS,
  pomodoroRunning: false,
  showFullScreen: false
}),

setShowFullScreen: (show) => set({ showFullScreen: show }),
```

2. **Create FullScreen Component:**
```javascript
// src/components/PomodoroFullScreen.jsx
import React from 'react';
import { Pause, RotateCcw, X } from 'lucide-react';
import usePomodoroStore from '../store/usePomodoroStore';

const PomodoroFullScreen = ({ darkMode }) => {
  const {
    pomodoroSeconds,
    pomodoroRunning,
    showFullScreen
  } = usePomodoroStore();

  const pausePomodoro = usePomodoroStore((state) => state.pausePomodoro);
  const resetPomodoro = usePomodoroStore((state) => state.resetPomodoro);
  const setShowFullScreen = usePomodoroStore((state) => state.setShowFullScreen);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (!showFullScreen || !pomodoroRunning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl">
      {/* Ambient background animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Timer */}
        <div className="font-mono text-9xl font-bold mb-12 bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 bg-clip-text text-transparent animate-pulse">
          {formatTime(pomodoroSeconds)}
        </div>

        {/* Status */}
        <div className="text-2xl text-gray-300 mb-16">
          🎯 Deep Focus Mode Active
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-6">
          <button
            onClick={pausePomodoro}
            className="px-8 py-4 rounded-xl font-semibold flex items-center space-x-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border-2 border-orange-500/50 transition-all"
          >
            <Pause size={24} />
            <span>Pause</span>
          </button>

          <button
            onClick={resetPomodoro}
            className="p-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all"
            title="Reset Timer"
          >
            <RotateCcw size={24} />
          </button>

          <button
            onClick={() => setShowFullScreen(false)}
            className="p-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all"
            title="Exit Fullscreen"
          >
            <X size={24} />
          </button>
        </div>

        {/* Keyboard hint */}
        <div className="mt-12 text-sm text-gray-500">
          Press ESC to exit fullscreen
        </div>
      </div>
    </div>
  );
};

export default PomodoroFullScreen;
```

3. **Add to Dashboard:**
```javascript
// In Dashboard.jsx
import PomodoroFullScreen from '../components/PomodoroFullScreen';

// In render, at end before closing div:
<PomodoroFullScreen darkMode={darkMode} />
```

4. **Add ESC key handler:**
```javascript
// In Dashboard.jsx, add useEffect:
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && usePomodoroStore.getState().showFullScreen) {
      usePomodoroStore.getState().setShowFullScreen(false);
    }
  };

  window.addEventListener('keydown', handleEscape);
  return () => window.removeEventListener('keydown', handleEscape);
}, []);
```

---

### STEP 3: Add OAuth Sign-In UI

**Files to modify:**
```bash
src/pages/LandingPage.jsx
src/pages/Dashboard.jsx
src/LandingPage.jsx (original component)
```

**Implementation:**

1. **Add Sign-In Button to Landing Page:**
```javascript
// In src/LandingPage.jsx (original component)
import { LogIn } from 'lucide-react';
import { signInWithGoogle } from './services/dataService';
import useStore from './store/useStore';

// Add to props:
const LandingPage = ({ onEnter, onViewStory, darkMode, user }) => {

  // Update bottom section (line 94+):
  <div className="mt-3 sm:mt-4 md:mt-6 pb-4 sm:pb-6 space-y-3">
    {!user ? (
      <button
        onClick={signInWithGoogle}
        className={`px-8 py-3 rounded-full text-sm sm:text-base font-medium transition-all hover:scale-105 flex items-center gap-2 mx-auto ${
          darkMode
            ? 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
            : 'bg-gray-900 hover:bg-gray-800 text-white border border-gray-700'
        }`}
      >
        <LogIn size={18} />
        Sign in with Google
      </button>
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
    >
      ✨ Our Story
    </button>
  </div>
```

2. **Update LandingPage wrapper to pass user:**
```javascript
// In src/pages/LandingPage.jsx
import useStore from '../store/useStore';

const LandingPageView = ({ darkMode }) => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);

  // ... handlers

  return (
    <LandingPage
      onEnter={handleEnter}
      onViewStory={handleViewStory}
      darkMode={darkMode}
      user={user}  // Pass user
    />
  );
};
```

3. **Add User Menu to Dashboard Header:**
```javascript
// In Dashboard.jsx, add after dark mode toggle:
import { LogOut, User } from 'lucide-react';
import { signOut } from '../services/dataService';

// Get user from store:
const user = useStore((state) => state.user);

// In header, replace Settings button with:
{user ? (
  <div className="relative group">
    <button
      className={`p-2 rounded-full transition-all flex items-center gap-2 ${
        darkMode
          ? 'hover:bg-white/10 text-gray-400 hover:text-gray-300'
          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-700'
      }`}
    >
      <User className="w-5 h-5 md:w-6 md:h-6" />
    </button>

    {/* Dropdown menu */}
    <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      <div className="p-3 border-b border-gray-700">
        <div className="text-xs text-gray-400">Signed in as</div>
        <div className="text-sm font-medium truncate">{user.email}</div>
      </div>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-all"
      >
        Toggle Dark Mode
      </button>
      <button
        onClick={signOut}
        className="w-full px-4 py-2 text-left text-sm hover:bg-rose-500/20 text-rose-400 transition-all flex items-center gap-2"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  </div>
) : (
  <button
    onClick={() => setDarkMode(!darkMode)}
    className={`p-2 rounded-full transition-all ${
      darkMode
        ? 'hover:bg-white/10 text-gray-400 hover:text-gray-300'
        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-700'
    }`}
    title="Toggle Dark Mode"
  >
    <Settings className="w-5 h-5 md:w-6 md:h-6" />
  </button>
)}
```

---

## 📊 TESTING CHECKLIST

After implementation, verify:

### NDM Status Bar:
- [ ] Bar renders on dashboard
- [ ] Shows 0/4 initially
- [ ] Progress bar updates when items completed
- [ ] Clicking Nutrition navigates to food view
- [ ] Clicking Movement navigates to exercise view
- [ ] Clicking Mindfulness opens box breathing
- [ ] Clicking Brain Dump opens appropriate modal
- [ ] Resets at midnight
- [ ] Persists across sessions

### Full-Screen Pomodoro:
- [ ] Starts fullscreen when "Start Focus" clicked
- [ ] Timer counts down correctly
- [ ] Ambient background animation visible
- [ ] Pause button works
- [ ] Reset button works
- [ ] Exit button works
- [ ] ESC key exits fullscreen
- [ ] Returns to normal view on pause/exit
- [ ] Timer state persists

### OAuth Sign-In:
- [ ] Sign-in button visible on landing page
- [ ] Google OAuth flow works
- [ ] Redirects back to app after auth
- [ ] User session persists
- [ ] User menu shows in dashboard
- [ ] Email displayed correctly
- [ ] Sign-out button works
- [ ] Data saves to Supabase when authenticated

---

## 🚀 DEPLOYMENT NOTES

1. **Environment Variables Required:**
   ```bash
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
   ```

2. **Supabase Configuration:**
   - Enable Google OAuth in Authentication settings
   - Add redirect URL: `http://localhost:3000` (dev)
   - Add redirect URL: `https://your-domain.com` (prod)
   - Create `user_data` table with columns:
     - `id` (text, primary key)
     - `data` (jsonb)
     - `updated_at` (timestamp)

3. **Bundle Size Target:**
   - Current: 134.02 KB gzipped
   - Target after features: < 150 KB gzipped
   - Optimize if exceeds 160 KB

---

## 💡 RECOMMENDATIONS

1. **Use Feature Flags:** Implement feature toggles for gradual rollout
2. **A/B Test:** Test fullscreen Pomodoro vs inline timer
3. **Analytics:** Track NDM completion rates
4. **User Feedback:** Survey users on settings page priorities
5. **Performance:** Lazy load settings page components
6. **Accessibility:** Add ARIA labels, keyboard navigation
7. **Mobile:** Test all features on mobile devices
8. **Error Handling:** Add error boundaries for new components

---

## 📝 SUMMARY

**Total Implementation Time: ~25-30 hours**

**Phase 1 (Critical):** ~8-10 hours
**Phase 2 (Important):** ~10-12 hours
**Phase 3 (Enhancement):** ~7-8 hours

**Files to Create:** 10-12 new files
**Files to Modify:** 5-7 existing files
**Expected Bundle Increase:** +10-15 KB gzipped

**Risk Level:** LOW - All features have existing infrastructure
**Dependencies:** None - All dependencies already installed
**Breaking Changes:** None - Purely additive changes

---

**Next Steps:**
1. Review this plan with stakeholders
2. Prioritize Phase 1 features
3. Create feature branch for each major feature
4. Implement in order of priority
5. Test thoroughly before merging
6. Deploy incrementally

---

*End of Restoration Plan*
