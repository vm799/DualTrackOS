# 🏗️ REFACTORING PLAN - Component Architecture

## Current State
- **App.jsx**: 3,265 lines (MONOLITHIC)
- **Target**: <500 lines per component
- **Status**: CRITICAL - Violates Single Responsibility Principle

---

## ✅ COMPLETED

### Security Remediation
- ✅ Removed `.env` from local git history
- ✅ Created `SECURITY.md` with remediation steps
- ✅ Documented force push requirement
- ⚠️ **USER ACTION REQUIRED**: Force push main branch + rotate Supabase keys

### Code Cleanup
- ✅ Deleted unused `SpiritAnimal.jsx` (8,792 bytes)
- ✅ Removed unused imports and functions
- ✅ Cleaned up dead code

### UX Improvements
- ✅ Spirit animal gamification (shows pts to next level, Japanese name, progress bar)
- ✅ NDM items now clickable
- ✅ Date/time refined

---

## 🚧 IN PROGRESS - Component Extraction

### Planned Components

#### 1. **Header.jsx** (Priority: HIGH)
Extract entire header section including:
- Spirit animal display
- User greeting
- Time display
- Auth buttons
- Settings icon

**Lines to extract**: ~150

#### 2. **SpiritAnimalCard.jsx** (Priority: HIGH)
Gamified spirit animal display:
- Props: `spiritAnimalScore`, `darkMode`, `onClick`
- Shows Japanese name, description, XP bar, points to next level
- Reusable component

**Lines to extract**: ~80

#### 3. **NDMStatusBar.jsx** (Priority: HIGH)
Non-negotiables tracker:
- Props: `ndm`, `darkMode`, `setCurrentView`, `openMindfulMoment`, `openBrainDump`
- Progress bar + 4 clickable items
- Compact display

**Lines to extract**: ~90

#### 4. **SmartSuggestions.jsx** (Priority: MEDIUM)
Energy + Mood based suggestions:
- Props: `energyLevel`, `mood`, `darkMode`, `addHourlyTask`
- Separate energy/mood sections
- Research-backed recommendations

**Lines to extract**: ~200

#### 5. **EnergyMoodTracker.jsx** (Priority: MEDIUM)
Combined energy + mood tracking UI:
- Props: `energyTracking`, `currentMood`, `setEnergyTracking`, `setCurrentMood`, `darkMode`
- Click to open modals
- Graph visualization

**Lines to extract**: ~150

#### 6. **SpiritAnimalModal.jsx** (Priority: LOW)
Full modal with Japanese philosophy:
- Props: `show`, `onClose`, `spiritAnimalScore`, `darkMode`, `getSpiritAnimalStage`
- Already extracted logic, just needs component wrapper

**Lines to extract**: ~200

---

## 📐 Component Structure

```
src/
├── App.jsx (REDUCED to ~1,500 lines)
├── components/
│   ├── Header.jsx
│   ├── SpiritAnimalCard.jsx
│   ├── NDMStatusBar.jsx
│   ├── SmartSuggestions.jsx
│   ├── EnergyMoodTracker.jsx
│   ├── SpiritAnimalModal.jsx
│   ├── Modals/
│   │   ├── BrainDumpModal.jsx
│   │   └── MindfulMomentModal.jsx
│   └── Dashboard/
│       ├── CurrentHourFocus.jsx
│       ├── ProteinTracker.jsx
│       └── DailyNonNegotiables.jsx
├── Onboarding.jsx
├── supabaseClient.js
└── index.js
```

---

## 🎯 Benefits

1. **Maintainability**: Each component has single responsibility
2. **Testability**: Components can be unit tested in isolation
3. **Reusability**: Components can be reused across views
4. **Performance**: Can optimize re-renders per component
5. **Collaboration**: Multiple developers can work on different components
6. **Readability**: Easier to understand and navigate codebase

---

## 📋 Next Steps

1. Create `src/components/` directory
2. Extract SpiritAnimalCard.jsx
3. Extract NDMStatusBar.jsx
4. Extract Header.jsx (uses above components)
5. Update App.jsx imports
6. Test thoroughly
7. Repeat for remaining components

---

## ⚠️ Notes

- Keep state management in App.jsx for now (avoid prop drilling)
- Use props for data and callbacks
- Maintain existing functionality
- Test after each extraction
- Commit incrementally

---

**Target**: Reduce App.jsx from 3,265 lines → <1,500 lines
**Priority**: HIGH (addresses -8 point deduction from Russian judge)
