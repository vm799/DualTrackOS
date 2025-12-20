# Contributing to DualTrack OS

## Quick Start

```bash
npm install
npm start        # Development
npm run build    # Production build
```

---

## Architecture Rules

### File Size Limits (HARD RULES)

```
App.jsx:     < 50 lines   (Currently: 37 ✅)
Components:  < 300 lines
Hooks:       < 200 lines
Stores:      < 250 lines
Pages:       < 400 lines
```

**If exceeded:** Extract immediately. No exceptions.

### App.jsx Rules

**ONLY allowed:**
- Initialize hooks (auth, persistence, etc.)
- Render `<AppRouter />`

**NEVER allowed:**
- ❌ useState
- ❌ Business logic
- ❌ Complex useEffect
- ❌ Inline components

---

## Code Organization

```
src/
  App.jsx              - Init & route only
  Router.jsx           - Route definitions
  pages/               - Page layouts
  components/          - Reusable UI
  hooks/               - Business logic
  store/               - Zustand stores (global state)
  services/            - API calls
  utils/               - Helper functions
  constants/           - Magic numbers
```

---

## State Management

**Local State (useState):**
- UI state (modals, toggles)
- Form inputs
- Component-specific data

**Global State (Zustand stores):**
- User auth/profile
- App settings
- Feature data (wellness, kanban, etc.)

---

## Before Committing

- [ ] File sizes within limits?
- [ ] No unused imports/variables?
- [ ] ESLint warnings = 0?
- [ ] Build succeeds?
- [ ] Business logic in hooks/stores (not components)?

---

## Key Patterns

**Custom Hooks for Logic:**
```javascript
// ✅ Good - Logic in hook
const useFeature = () => {
  const [data, setData] = useState();
  // Business logic here
  return { data, actions };
};

// Component stays clean
const Component = () => {
  const { data } = useFeature();
  return <div>{data}</div>;
};
```

**Zustand for Global State:**
```javascript
// store/useFeatureStore.js
const useFeatureStore = create((set) => ({
  data: {},
  updateData: (data) => set({ data }),
}));

// Use in components
const Component = () => {
  const data = useFeatureStore((state) => state.data);
};
```

**Extract When:**
- Component > 300 lines → Split into smaller components
- Hook > 200 lines → Split into multiple hooks
- Duplicated code → Extract to utility
- Complex logic → Extract to hook

---

## Tech Stack

- **React 18** - UI framework
- **Zustand** - State management
- **React Router** - Routing
- **Tailwind CSS** - Styling (via className)
- **Lucide React** - Icons
- **Supabase** - Backend (optional)

---

## Need Help?

Check existing code for patterns - the codebase is well-organized and follows consistent patterns throughout.
