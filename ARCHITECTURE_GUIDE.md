# DualTrack OS - Architecture Guide

**Maintaining Clean, Scalable Code**

---

## Core Principles

### 1. Single Responsibility Principle (SRP)
**Every file, function, and component should do ONE thing well.**

✅ **GOOD:**
```javascript
// App.jsx - Only handles initialization and routing
const DualTrackOS = () => {
  useAuthInitialization();  // Delegated
  useDataPersistence();     // Delegated
  return <AppRouter />;     // Delegated
};
```

❌ **BAD:**
```javascript
// App.jsx - Monolith with everything
const DualTrackOS = () => {
  const [state1, setState1] = useState();
  const [state2, setState2] = useState();
  // ... 50 more useState hooks
  // ... 20 useEffect hooks
  // ... inline business logic
  // ... 4000 lines of code
};
```

### 2. Separation of Concerns
**Organize code by responsibility, not by file type.**

```
✅ Feature-Based Organization:
src/
  features/
    wellness/
      components/    - UI components
      hooks/         - Business logic
      store/         - State management
      utils/         - Helper functions

❌ Type-Based Organization:
src/
  components/       - All components mixed together
  hooks/            - All hooks mixed together
  utils/            - All utilities mixed together
```

### 3. DRY (Don't Repeat Yourself)
**Extract reusable logic into hooks, utilities, or components.**

✅ **GOOD:**
```javascript
// Custom hook for reusable logic
const useAuth = () => {
  const [user, setUser] = useState(null);
  // Auth logic here
  return { user, login, logout };
};

// Use in multiple components
const Dashboard = () => {
  const { user } = useAuth();
};
```

❌ **BAD:**
```javascript
// Duplicated auth logic in every component
const Dashboard = () => {
  const [user, setUser] = useState(null);
  useEffect(() => { /* auth logic */ }, []);
};

const Profile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => { /* same auth logic */ }, []);
};
```

---

## File Size Limits

**Hard Rules to Prevent Monoliths:**

| File Type | Max Lines | Recommended | Action if Exceeded |
|-----------|-----------|-------------|-------------------|
| **App.jsx** | 50 | 30 | Extract hooks |
| **Components** | 300 | 150 | Extract sub-components |
| **Hooks** | 200 | 100 | Split into multiple hooks |
| **Stores** | 250 | 150 | Split into feature stores |
| **Pages** | 400 | 200 | Extract components |
| **Utils** | 150 | 75 | Split by domain |

**Current Status:**
- ✅ App.jsx: **37 lines** (Excellent!)
- ✅ All stores: < 250 lines
- ✅ Most components: < 200 lines

---

## Architecture Layers

### Layer 1: Entry Point (App.jsx)
**Responsibility:** Initialize app and render router

```javascript
// App.jsx (37 lines)
const DualTrackOS = () => {
  useAuthInitialization();  // Init auth
  useDataPersistence();     // Auto-save
  return <AppRouter />;     // Route
};
```

**Rules:**
- ✅ Should be < 50 lines
- ✅ No business logic
- ✅ Only initialization hooks
- ✅ Only render router
- ❌ Never add useState here
- ❌ Never add complex useEffect
- ❌ Never add UI components

### Layer 2: Routing (Router.jsx)
**Responsibility:** Define routes and navigation

```javascript
// Router.jsx
const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
);
```

**Rules:**
- ✅ Only routing logic
- ✅ Route guards for auth
- ❌ No business logic
- ❌ No data fetching

### Layer 3: Pages (pages/)
**Responsibility:** Layout and composition

```javascript
// pages/Dashboard.jsx
const Dashboard = () => {
  // Connect to stores
  const { data } = useStore();

  // Compose layout with components
  return (
    <Layout>
      <Header />
      <MainContent>
        <FeatureA />
        <FeatureB />
      </MainContent>
    </Layout>
  );
};
```

**Rules:**
- ✅ Compose components
- ✅ Connect to stores
- ⚠️ Minimal business logic
- ❌ No complex calculations
- ❌ No data transformations

### Layer 4: Components (components/)
**Responsibility:** Reusable UI elements

```javascript
// components/BoxBreathing.jsx
const BoxBreathing = ({ onComplete }) => {
  // Local UI state only
  const [elapsed, setElapsed] = useState(0);

  // Render UI
  return <div>...</div>;
};
```

**Rules:**
- ✅ Focused on rendering
- ✅ Local UI state only
- ✅ Props for communication
- ❌ No global state (use stores)
- ❌ No data fetching (use hooks)

### Layer 5: Hooks (hooks/)
**Responsibility:** Reusable business logic

```javascript
// hooks/useAuthInitialization.js
export const useAuthInitialization = () => {
  // Encapsulates auth initialization logic
  useEffect(() => {
    // Complex auth logic here
  }, []);
};
```

**Rules:**
- ✅ Single purpose
- ✅ Reusable across components
- ✅ Return values, not JSX
- ❌ No UI rendering

### Layer 6: Stores (store/)
**Responsibility:** Global state management

```javascript
// store/useWellnessStore.js
const useWellnessStore = create((set) => ({
  // State
  data: {},

  // Actions
  updateData: (data) => set({ data }),
}));
```

**Rules:**
- ✅ One store per feature
- ✅ Actions for mutations
- ✅ Selectors for derived state
- ❌ No side effects (use hooks)

### Layer 7: Services (services/)
**Responsibility:** External integrations

```javascript
// services/dataService.js
export const saveUserData = async (userId, data) => {
  await supabase.from('users').update(data);
};
```

**Rules:**
- ✅ API calls
- ✅ Data transformations
- ✅ Error handling
- ❌ No state management
- ❌ No UI logic

---

## Component Organization

### When to Extract a Component

**Extract when:**
1. ✅ Code block > 50 lines
2. ✅ Used in multiple places
3. ✅ Has distinct responsibility
4. ✅ Can be tested independently
5. ✅ Has clear inputs/outputs

**Don't extract when:**
1. ❌ Only used once and < 30 lines
2. ❌ Tightly coupled to parent
3. ❌ No clear boundaries

### Component Types

#### 1. Page Components (pages/)
```javascript
// pages/Dashboard.jsx
// - Layout and composition
// - Connects features together
// - 200-400 lines max
```

#### 2. Feature Components (components/)
```javascript
// components/WellnessSnackModal.jsx
// - Complete feature
// - Self-contained
// - 100-300 lines max
```

#### 3. UI Components (components/common/)
```javascript
// components/common/Button.jsx
// - Reusable UI elements
// - No business logic
// - < 100 lines
```

---

## State Management

### Local vs Global State

**Use Local State (useState) when:**
- ✅ UI state (modals, toggles)
- ✅ Form inputs
- ✅ Component-specific data
- ✅ Not needed elsewhere

**Use Global State (Zustand) when:**
- ✅ User authentication
- ✅ User profile
- ✅ Application settings
- ✅ Shared across pages

### Store Organization

```
store/
  useStore.js              - App-level state (user, darkMode)
  useWellnessStore.js      - Wellness feature state
  usePomodoroStore.js      - Pomodoro feature state
  useKanbanStore.js        - Kanban feature state
  useMetricsStore.js       - Metrics feature state
```

**Rules:**
- ✅ One store per feature domain
- ✅ Keep stores focused
- ✅ Use store composition
- ❌ Never one giant store

---

## Hook Organization

### Custom Hook Categories

#### 1. Lifecycle Hooks (hooks/)
```javascript
// useAuthInitialization.js
// useDataPersistence.js
// - Run on mount
// - Setup/teardown
```

#### 2. Feature Hooks (features/*/hooks/)
```javascript
// features/wellness/hooks/useWellnessTracking.js
// - Feature-specific logic
// - Reusable within feature
```

#### 3. Utility Hooks (hooks/)
```javascript
// useLocalStorage.js
// useInterval.js
// useDebouncedSave.js
// - Generic, reusable
// - No feature dependencies
```

---

## Testing Strategy

### What to Test

**High Priority:**
1. ✅ Utility functions
2. ✅ Custom hooks
3. ✅ Store actions
4. ✅ Service functions

**Medium Priority:**
1. ⚠️ Components (snapshot tests)
2. ⚠️ Integration tests

**Low Priority:**
1. ⏳ UI styling
2. ⏳ Layout

### Test Organization

```
src/
  components/
    BoxBreathing.jsx
    BoxBreathing.test.jsx  ← Co-located
  hooks/
    useInterval.ts
    useInterval.test.ts    ← Co-located
```

---

## Code Review Checklist

### Before Committing

- [ ] **File size:** Is any file > 300 lines?
- [ ] **SRP:** Does each file do one thing?
- [ ] **DRY:** Any duplicated logic?
- [ ] **Naming:** Clear, descriptive names?
- [ ] **Comments:** Complex logic documented?
- [ ] **Imports:** No unused imports?
- [ ] **State:** Using right state management?
- [ ] **Testing:** Critical logic tested?

### Red Flags

🚩 **File > 500 lines** → Split immediately
🚩 **10+ useState in component** → Extract hooks
🚩 **Duplicated code** → Extract to utility
🚩 **Complex useEffect** → Extract to hook
🚩 **Business logic in component** → Move to hook/store
🚩 **Props drilling > 2 levels** → Use context/store

---

## Refactoring Guide

### When App.jsx Gets Too Big

**If App.jsx > 50 lines, extract in this order:**

1. **Extract hooks**
```javascript
// Before (70 lines)
const App = () => {
  useEffect(() => { /* auth */ }, []);
  useEffect(() => { /* save */ }, []);
  return <Router />;
};

// After (37 lines)
const App = () => {
  useAuthInitialization();
  useDataPersistence();
  return <Router />;
};
```

2. **Extract providers**
```javascript
// Create AppProvider.jsx
const AppProvider = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      {children}
    </AuthProvider>
  </ThemeProvider>
);

// App.jsx
const App = () => (
  <AppProvider>
    <AppRouter />
  </AppProvider>
);
```

3. **Extract initialization**
```javascript
// Create AppInitializer.jsx
const AppInitializer = ({ children }) => {
  useAuthInitialization();
  useDataPersistence();
  return children;
};

// App.jsx
const App = () => (
  <AppInitializer>
    <AppRouter />
  </AppInitializer>
);
```

### When Component Gets Too Big

**If component > 300 lines:**

1. Extract sub-components
2. Extract custom hooks
3. Move calculations to utilities
4. Split into multiple files

---

## Maintenance Rules

### Daily
- ✅ Fix ESLint warnings
- ✅ Remove unused code
- ✅ Update comments

### Weekly
- ✅ Review file sizes
- ✅ Check for duplication
- ✅ Update documentation

### Monthly
- ✅ Bundle size analysis
- ✅ Performance profiling
- ✅ Dependency updates

---

## Success Metrics

### Code Quality
- ✅ App.jsx: < 50 lines
- ✅ Components: < 300 lines
- ✅ Hooks: < 200 lines
- ✅ ESLint warnings: 0
- ✅ Test coverage: > 80%

### Performance
- ✅ Bundle: < 120 KB gzipped
- ✅ FCP: < 1.5s
- ✅ TTI: < 3s
- ✅ Lighthouse: > 90

### Maintainability
- ✅ Clear file structure
- ✅ Documented patterns
- ✅ Easy to onboard
- ✅ Fast to modify

---

## Quick Reference

### File Limits
```
App.jsx:     < 50 lines   ✅ (37 lines)
Components:  < 300 lines
Hooks:       < 200 lines
Stores:      < 250 lines
Pages:       < 400 lines
```

### When to Extract
```
> 50 lines in component     → Extract sub-component
> 10 useState               → Extract hook
> 5 useEffect               → Extract hook
Duplicated code             → Extract utility
Complex calculation         → Extract function
```

### Architecture Layers
```
App.jsx              → Initialization only
Router.jsx           → Routing only
pages/               → Layout and composition
components/          → UI rendering
hooks/               → Business logic
store/               → State management
services/            → External integrations
utils/               → Helper functions
```

---

**Status:** ✅ Architecture following best practices
**App.jsx:** 37 lines (Excellent!)
**Next:** Maintain this standard going forward
