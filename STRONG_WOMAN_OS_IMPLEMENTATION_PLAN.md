# Strong Woman OS - Implementation Plan

**Based on**: Business Requirements Document (BRD) provided by user
**Current State**: DualTrack OS (perimenopause-focused MVP)
**Target State**: Strong Woman OS (life-stage aware execution system)

---

## 🎯 Strategic Overview

### Product Evolution

**Current**: DualTrack OS
- Focus: Perimenopausal women (45-55)
- Features: Energy/mood tracking, menstrual cycle, strength training
- Architecture: Single life-stage focus

**Target**: Strong Woman OS
- Focus: Women across all life stages (25-70+)
- Features: Binary execution system, life-stage profiles, strength-first training
- Architecture: Shared execution engine + life-stage modifiers

### Key Changes Required

1. **Rename** DualTrack OS → Strong Woman OS
2. **Add** life-stage selection (Strong30, Strong40, Strong50, Strong60, Strong70+)
3. **Simplify** tracking to binary (Yes/No) instead of quantitative
4. **Refocus** on strength-first, consistency over intensity
5. **Remove** complex tracking (calories, macros, daily weight)
6. **Keep** what works (energy tracking, training suggestions, avatar system)

---

## 📋 Implementation Phases

### Phase 0: Analysis & Planning (1-2 days)
**Goal**: Understand current codebase and plan architecture changes

**Tasks**:
- [ ] Audit existing components and stores
- [ ] Map current features → BRD requirements
- [ ] Identify what to keep vs. remove vs. build new
- [ ] Define data model for life-stage system
- [ ] Create component hierarchy diagram
- [ ] Estimate development time for each phase

---

### Phase 1: Core System Refactor (3-5 days)
**Goal**: Transform tracking system from quantitative → binary

#### 1.1 Data Model Changes

**Current** (Quantitative):
```javascript
{
  energyTracking: { morning: 1-5, afternoon: 1-5, evening: 1-5 },
  currentMood: 'energized' | 'focused' | 'calm' | 'tired' | 'anxious' | 'overwhelmed',
  cycleDaySelected: number,
  lastPeriodDate: Date,
  proteinServings: number, // Tracked numerically
  waterIntake: number,
  steps: number
}
```

**Target** (Binary):
```javascript
{
  lifeStage: 'strong30' | 'strong40' | 'strong50' | 'strong60' | 'strong70',
  dailyCheckIn: {
    date: Date,
    strengthOrCardioCompleted: boolean,  // Yes/No only
    dailyMovementCompleted: boolean,      // Yes/No only
    proteinAt3Meals: boolean,             // Yes/No only
    noGrazing: boolean,                   // Yes/No only
    sleepWindDownCompleted: boolean       // Yes/No only
  },
  weeklyMetrics: {
    week: string,
    weight: number | null,                // Once per week only
    waistCircumference: number | null,    // Once per week only
    subjectiveEnergy: 'low' | 'ok' | 'high' // Radio button
  },
  weeklyTrainingPlan: {
    monday: 'gym' | 'home' | 'cardio' | 'rest',
    tuesday: 'gym' | 'home' | 'cardio' | 'rest',
    // ...
    sunday: 'gym' | 'home' | 'cardio' | 'rest'
  }
}
```

**Files to Modify**:
- `src/store/useStore.js` - Main state management
- `src/services/dataService.js` - Save/load functions

**Implementation**:
1. Create new store: `src/store/useExecutionStore.js`
2. Define binary check-in schema
3. Create migration function (old data → new data)
4. Update Supabase table schema

---

#### 1.2 Daily Execution Check-In (PRIMARY SCREEN)

**Current**: Energy modal + mood modal + cycle tracking (multiple screens)

**Target**: Single-screen binary check-in

**New Component**: `src/components/DailyExecutionCheckIn.jsx`

**UI Requirements**:
- ✅ All 5 checkboxes visible on one screen (no scrolling)
- ✅ Binary only (checkbox = yes, unchecked = no)
- ✅ One-tap completion
- ✅ No duration inputs, no intensity ratings
- ✅ Shows today's scheduled training type
- ✅ Clean, minimal design

**Fields**:
```jsx
[ ] Strength / Cardio completed
[ ] Daily movement (walk / steps)
[ ] Protein at 3 meals
[ ] No grazing
[ ] Sleep wind-down completed
```

**Files to Create**:
- `src/components/DailyExecutionCheckIn.jsx`
- `src/pages/DailyCommandCenter.jsx` (new primary screen)

**Files to Deprecate** (keep for now, mark for removal):
- `src/components/EnergyModal.jsx` (replace with simple binary)
- `src/components/MoodModal.jsx` (replace with simple binary)
- `src/CycleCalendar.jsx` (remove - not in BRD)

---

### Phase 2: Life-Stage System (2-3 days)
**Goal**: Add life-stage selection and profile modifiers

#### 2.1 Life-Stage Selection

**New Component**: `src/pages/LifeStageSelection.jsx`

**Flow**:
1. User sees 5 life-stage options during onboarding
2. User selects one (radio button)
3. System stores selection in profile
4. System applies life-stage modifiers

**Life Stages**:
- Strong30 (25-35): High intensity ceiling, performance focus
- Strong40 (35-45): Stability, moderate intensity
- Strong50 (45-55): Strength-first, low HIIT ← **Current DualTrack OS users**
- Strong60 (55-70): Bone density, balance, independence
- Strong70+ (70+): Mobility, frailty prevention, simplicity

**Files to Create**:
- `src/pages/LifeStageSelection.jsx`
- `src/constants/lifeStages.js` (configuration for each stage)

**Example Configuration**:
```javascript
// src/constants/lifeStages.js
export const LIFE_STAGES = {
  strong30: {
    name: 'Strong30',
    ageRange: '25-35',
    focus: 'Build muscle, avoid burnout',
    trainingBias: {
      strengthSessionsPerWeek: [4, 5],
      hiitMaxPerWeek: 3,
      recoveryDaysMin: 1
    },
    messaging: {
      tone: 'Performance-focused',
      morningReminder: 'Strong bodies are built with recovery.',
      eveningReminder: 'Tick boxes. Close the day.'
    },
    guardrails: ['Warn if HIIT >3/week', 'Encourage deload weeks']
  },
  strong50: {
    name: 'Strong50',
    ageRange: '45-55',
    focus: 'Preserve muscle, strength is medicine',
    trainingBias: {
      strengthSessionsPerWeek: [3, 4],
      hiitMaxPerWeek: 1,
      recoveryDaysMin: 2
    },
    messaging: {
      tone: 'Authority + empowerment',
      morningReminder: 'Strong women train before life steals the day.',
      eveningReminder: 'Tick boxes. Close the day.'
    },
    guardrails: ['No consecutive HIIT days', 'Strength is primary']
  },
  // ... other stages
};
```

---

#### 2.2 Onboarding Flow Update

**Current**: Asks for age, weight, cycle info
**Target**: Asks for life stage, then age, weight (simplified)

**Modified Component**: `src/Onboarding.jsx`

**New Flow**:
1. Welcome screen
2. **NEW**: Life-stage selection (radio buttons)
3. Basic profile (name, age, weight, unit preference)
4. **REMOVE**: Cycle tracking setup (not in BRD)
5. **NEW**: Weekly training schedule setup
6. Avatar selection (keep this)
7. Enter app

---

### Phase 3: Training System (3-4 days)
**Goal**: Implement static weekly training schedule

#### 3.1 Weekly Training Schedule

**New Component**: `src/components/WeeklyTrainingSchedule.jsx`

**Features**:
- User assigns training days once (Monday through Sunday)
- Options per day: Gym Strength | Home Strength | Cardio/Mobility | Rest
- System repeats weekly (static, not adaptive)
- User can edit anytime in Settings

**UI**:
```
Monday:    [Gym] [Home] [Cardio] [Rest]
Tuesday:   [Gym] [Home] [Cardio] [Rest]
Wednesday: [Gym] [Home] [Cardio] [Rest]
...
```

**Files to Create**:
- `src/components/WeeklyTrainingSchedule.jsx`
- `src/pages/TrainingPlanSetup.jsx` (onboarding screen)

**Integration**:
- Daily check-in shows: "Today: Gym Strength" (from weekly plan)
- User checks "Strength/Cardio completed" (yes/no)

---

#### 3.2 Pull-Up Progression Tracker

**New Component**: `src/components/PullUpProgressionTracker.jsx`

**Stages** (radio button selection):
- Dead hang duration
- Negative reps
- Assisted pull-ups
- Unassisted reps

**Fields**:
- Stage selection (radio)
- Optional notes (text input)
- **NO** rep max calculations
- **NO** duration tracking beyond stage selection

**Files to Create**:
- `src/components/PullUpProgressionTracker.jsx`
- Add to Settings page or create dedicated Strength Tracker page

---

### Phase 4: Simplified Metrics (1-2 days)
**Goal**: Remove daily tracking, add weekly metrics

#### 4.1 Remove Daily Quantitative Tracking

**Files to Deprecate**:
- Daily protein servings input
- Daily water intake counter
- Daily steps counter
- Daily weight logging
- Calorie/macro tracking (never existed, but ensure not added)

**Files to Modify**:
- `src/components/WellnessSnackModal.jsx` - Keep for qualitative activities only
- `src/pages/DashboardPage.jsx` - Remove numeric displays

---

#### 4.2 Weekly Metrics (Low Frequency)

**New Component**: `src/components/WeeklyMetricsInput.jsx`

**Fields** (once per week only):
- Weight (single value, kg or lbs)
- Waist circumference (cm or inches)
- Subjective energy (radio: Low | OK | High)

**Rules**:
- Prompts user once per week (Sunday evening or Monday morning)
- No daily weight graphs
- No calorie data
- No body fat % input
- No trend calculations (just show last 4-8 weeks in simple list)

**Files to Create**:
- `src/components/WeeklyMetricsInput.jsx`
- `src/pages/WeeklyMetricsPage.jsx` (optional, or add to Settings)

---

### Phase 5: Messaging & Guardrails (1-2 days)
**Goal**: Life-stage specific messaging and automated nudges

#### 5.1 Automated Nudges

**Implementation**: Update `src/App.js` (or create `src/services/notifications.js`)

**Morning Reminder**:
- Trigger: 30 minutes before scheduled training time
- Message: Life-stage specific (from `lifeStages.js`)
- Examples:
  - Strong30: "Strong bodies are built with recovery."
  - Strong50: "Strong women train before life steals the day."
  - Strong60: "Strong for life."

**Evening Reminder**:
- Trigger: User-defined time (default: 8pm)
- Message: "Tick boxes. Close the day." (same for all life stages)

**No Gamification**:
- No streak counters
- No "you're behind" messaging
- No forced catch-up

---

#### 5.2 Guardrails

**Implementation**: Add logic in `src/components/DailyExecutionCheckIn.jsx`

**Examples**:
- Strong30: Warn if user checks HIIT >3 days in same week
- Strong50: Prompt rest day if consecutive high-intensity days detected
- Strong60: No warning needed (no HIIT requirement)

**UI**: Gentle info message (not blocking, not shaming)
```
"ℹ️ You've done 3 HIIT sessions this week. Consider a recovery day tomorrow."
```

---

### Phase 6: UI/UX Polish (2-3 days)
**Goal**: Rebrand and polish user experience

#### 6.1 Rebrand DualTrack OS → Strong Woman OS

**Files to Modify**:
- `package.json` - Update name
- `public/index.html` - Update title
- `public/manifest.json` - Update app name
- `src/LandingPage.jsx` - Update branding
- `src/StoryPage.jsx` - Already updated (keep current version, adjust life-stage messaging)
- `README.md` - Update project description

**Logo**:
- Keep lioness logo (fits Strong Woman branding)
- Update text from "DualTrack OS" → "Strong Woman OS"

---

#### 6.2 Primary Dashboard Update

**Current**: `src/pages/DashboardPage.jsx`
**Target**: Single-page execution dashboard

**Layout**:
```
┌─────────────────────────────────────┐
│ Good Morning, [Name]                │
│ Today: [Gym Strength]               │
│                                     │
│ Daily Execution Check-In            │
│ ┌─────────────────────────────────┐ │
│ │ [ ] Strength/Cardio completed   │ │
│ │ [ ] Daily movement              │ │
│ │ [ ] Protein at 3 meals          │ │
│ │ [ ] No grazing                  │ │
│ │ [ ] Sleep wind-down             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Quick Actions]                     │
│ • Edit Weekly Plan                  │
│ • Log Weekly Metrics                │
│ • View Pull-Up Progress             │
└─────────────────────────────────────┘
```

**Files to Modify**:
- `src/pages/DashboardPage.jsx` - Complete overhaul
- Remove avatar prominently from dashboard (move to Settings or separate page)
- Remove energy/mood modals from dashboard
- Keep bottom navigation (Home | Training | Health | Settings)

---

### Phase 7: Testing & Migration (2-3 days)
**Goal**: Ensure existing users can migrate smoothly

#### 7.1 Data Migration

**Create**: `src/utils/migrateToStrongWomanOS.js`

**Migration Logic**:
```javascript
// For existing DualTrack OS users
const migrateToDualTrackOS = (oldData) => {
  return {
    lifeStage: 'strong50', // All existing users → Strong50
    dailyCheckIn: {
      // Convert old energy/mood tracking → binary check-in
      strengthOrCardioCompleted: oldData.todaysTraining?.completed || false,
      proteinAt3Meals: oldData.proteinServings >= 3,
      // ... best-effort migration
    },
    weeklyTrainingPlan: {
      // Create default weekly plan
      monday: 'gym',
      tuesday: 'rest',
      wednesday: 'gym',
      thursday: 'home',
      friday: 'rest',
      saturday: 'gym',
      sunday: 'cardio'
    },
    // Preserve avatar progress
    avatarLevel: oldData.spiritAnimalScore,
    // ... other preserved data
  };
};
```

**Files to Create**:
- `src/utils/migrateToStrongWomanOS.js`
- Update `src/App.js` to detect old data and run migration on first load

---

#### 7.2 Testing

**Test Scenarios**:
1. Fresh user onboarding (new to Strong Woman OS)
2. Existing DualTrack OS user migration
3. Life-stage selection and modifier application
4. Binary check-in completion (all 5 fields)
5. Weekly training plan setup and editing
6. Weekly metrics logging
7. Pull-up progression tracking
8. Morning/evening reminders (if implemented)

**Files to Create**:
- `src/store/__tests__/useExecutionStore.test.js`
- `src/components/__tests__/DailyExecutionCheckIn.test.js`
- `src/components/__tests__/WeeklyTrainingSchedule.test.js`

---

### Phase 8: Deployment & Launch (1-2 days)
**Goal**: Deploy Strong Woman OS to production

#### 8.1 Update Deployment Guides

**Files to Update**:
- `VERCEL_DEPLOYMENT_GUIDE.md` - Update app name
- `PRODUCTION_STATUS_CURRENT.md` - Update feature list
- `README.md` - Update project description

---

#### 8.2 Database Schema Updates

**Supabase Migration**:
```sql
-- Add life_stage column to user_data
ALTER TABLE user_data
ADD COLUMN life_stage VARCHAR(20) DEFAULT 'strong50';

-- Add new table for daily check-ins
CREATE TABLE daily_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  strength_or_cardio_completed BOOLEAN DEFAULT FALSE,
  daily_movement_completed BOOLEAN DEFAULT FALSE,
  protein_at_3_meals BOOLEAN DEFAULT FALSE,
  no_grazing BOOLEAN DEFAULT FALSE,
  sleep_wind_down_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Add RLS policies
ALTER TABLE daily_check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own check-ins"
  ON daily_check_ins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own check-ins"
  ON daily_check_ins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own check-ins"
  ON daily_check_ins FOR UPDATE
  USING (auth.uid() = user_id);
```

**Files to Create**:
- `supabase/migrations/add_strong_woman_os_schema.sql`

---

## 🗺️ Gantt Chart (Estimated Timeline)

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 0: Analysis | 1-2 days | None |
| Phase 1: Core Refactor | 3-5 days | Phase 0 |
| Phase 2: Life-Stage System | 2-3 days | Phase 1 |
| Phase 3: Training System | 3-4 days | Phase 2 |
| Phase 4: Simplified Metrics | 1-2 days | Phase 1 |
| Phase 5: Messaging & Guardrails | 1-2 days | Phase 2, 3 |
| Phase 6: UI/UX Polish | 2-3 days | All previous |
| Phase 7: Testing & Migration | 2-3 days | All previous |
| Phase 8: Deployment | 1-2 days | Phase 7 |

**Total Estimated Time**: 16-26 days (3-5 weeks)

**Accelerated Timeline** (if working full-time): 2-3 weeks
**Part-Time Timeline** (10-15 hrs/week): 6-8 weeks

---

## 🚨 Critical Decisions Needed

Before starting implementation, clarify:

### 1. Existing Users
**Question**: What happens to current DualTrack OS users?
**Options**:
- A) Auto-migrate them to Strong50 life stage
- B) Prompt them to select life stage on next login
- C) Keep DualTrack OS separate (legacy app)

**Recommendation**: Option A (auto-migrate to Strong50, allow them to change later)

---

### 2. Cycle Tracking
**Question**: Keep cycle tracking for Strong30/40/50?
**Current BRD**: Does not mention cycle tracking
**Current App**: Has cycle calendar (users may expect this)

**Options**:
- A) Remove entirely (follow BRD strictly)
- B) Keep as optional feature for Strong30/40/50
- C) Make it a premium feature

**Recommendation**: Option B (keep as optional, don't make it prominent)

---

### 3. Avatar System
**Question**: Keep avatar evolution?
**Current BRD**: Not mentioned (says "No gamification")
**Current App**: Has avatar evolution tied to daily actions

**Options**:
- A) Remove entirely (no gamification)
- B) Keep but simplify (evolves based on weekly check-ins, not daily)
- C) Keep as-is (users seem to like it)

**Recommendation**: Option B (keep but tie to weekly completion %, not daily streaks)

---

### 4. Energy Tracking
**Question**: Keep 1-5 energy tracking or make it binary?
**Current BRD**: Binary execution model (Yes/No only)
**Current App**: Energy tracking is core to training suggestions

**Options**:
- A) Remove energy tracking (pure binary)
- B) Simplify to 3 levels: Low / OK / High (radio button)
- C) Keep 1-5 scale but make it optional

**Recommendation**: Option A for BRD compliance (training plan is static, not energy-adaptive)

---

## 📦 Deliverables

### Code
- [ ] Refactored state management (`useExecutionStore.js`)
- [ ] New components (DailyExecutionCheckIn, LifeStageSelection, WeeklyTrainingSchedule, etc.)
- [ ] Updated onboarding flow
- [ ] Updated dashboard
- [ ] Migration script
- [ ] Database migrations
- [ ] Updated tests (minimum 50% coverage)

### Documentation
- [ ] Updated README
- [ ] Life-stage selection guide for users
- [ ] Admin guide for managing life-stage configurations
- [ ] Updated deployment guides

### Testing
- [ ] Unit tests for new stores
- [ ] Component tests for new components
- [ ] Integration test for onboarding flow
- [ ] Migration test with sample data
- [ ] End-to-end test for daily check-in flow

---

## 🎯 Success Criteria

### Technical
- [ ] All existing users migrated without data loss
- [ ] All 41 existing tests still passing
- [ ] New features have 50%+ test coverage
- [ ] No breaking changes to Supabase schema (additive only)
- [ ] Performance: Dashboard loads in <2s

### Product
- [ ] User can complete daily check-in in <30 seconds
- [ ] Life-stage selection is clear and intuitive
- [ ] Weekly training plan is easy to set up and edit
- [ ] No confusion about what to log (binary = simple)

### Business
- [ ] Retains 80%+ of existing DualTrack OS users
- [ ] New users onboard successfully (test with 5-10 people)
- [ ] No increase in Sentry error rate
- [ ] User feedback is positive ("simpler, clearer")

---

## 🚀 Launch Strategy

### Soft Launch (Week 1)
1. Deploy to staging environment
2. Migrate 5-10 existing users manually
3. Collect feedback
4. Fix critical bugs

### Beta Launch (Week 2-3)
1. Deploy to production
2. Auto-migrate all existing users
3. Send announcement email explaining changes
4. Monitor Sentry for errors
5. Collect feedback via Sentry user feedback widget

### Public Launch (Week 4+)
1. Update marketing site (if exists)
2. Update landing page copy
3. Launch on social media
4. Consider renaming domain (dualtrack.io → strongwoman.app)

---

## 📞 Next Steps

1. **Review this plan** with product owner/stakeholders
2. **Make critical decisions** (see section above)
3. **Start Phase 0** (analysis & planning)
4. **Create GitHub issues** for each phase
5. **Set up project board** for tracking progress

---

**Ready to build Strong Woman OS? Let's ship it.** 💪
