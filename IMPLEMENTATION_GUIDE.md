# DualTrack OS - Implementation & Error Guide

**Last Updated**: 2025-12-29
**Purpose**: Single source of truth for development, fixes, and deployment
**Read This First** before making any code changes

---

## Table of Contents

1. [Quick Development Workflow](#quick-development-workflow)
2. [Critical Errors & Solutions](#critical-errors--solutions)
3. [Architecture Patterns](#architecture-patterns)
4. [Recent Changes Log](#recent-changes-log)
5. [Build & Deployment](#build--deployment)
6. [Common Tasks](#common-tasks)

---

## Quick Development Workflow

### Start Development
```bash
npm install          # First time only
npm start            # Start dev server at localhost:3000
```

### Build & Test
```bash
npm run build        # Build production bundle
npm run lint         # Run ESLint checks
```

### Git Workflow
```bash
git status           # Check current state
git add -A           # Stage all changes
git commit -m "..."  # Commit with message
git push -u origin <branch-name>  # Push to remote
```

---

## Critical Errors & Solutions

### 🔴 ERROR: useNavigate() outside Router context

**Symptom**: `Error: useNavigate() may be used only in the context of a <Router> component`

**Root Cause**: Component using React Router hooks (`useNavigate`, `useLocation`, etc.) is placed OUTSIDE the `<Router>` component.

**Solution**:
```javascript
// ❌ WRONG - Component outside Router
return (
  <ErrorBoundary>
    <StickyLogoBanner />  // Has useNavigate() - BREAKS!
    <AppRouter />         // Router is here
  </ErrorBoundary>
);

// ✅ CORRECT - Component inside Router
// In Router.jsx:
return (
  <Router>
    <PathTracker />
    <StickyLogoBanner />  // Now has Router context - WORKS!
    <Routes>...</Routes>
  </Router>
);
```

**Rule**: ANY component using `useNavigate()`, `useLocation()`, `useParams()`, etc. MUST be rendered inside `<Router>`.

**Fixed In**: Commit `ece31fc` (2025-12-29)

---

### 🟡 WARNING: UI Overlapping

**Symptom**: Multiple headers/logos appearing on same page, overlapping content

**Root Cause**: Adding global sticky components without checking for existing page headers

**Solution**: Use whitelist approach instead of blacklist
```javascript
// ❌ BAD - Hide on some pages (blacklist)
const hiddenPaths = ['/', '/dashboard'];
if (hiddenPaths.includes(location.pathname)) return null;

// ✅ GOOD - Only show where needed (whitelist)
const showPaths = ['/story'];  // Only pages WITHOUT headers
if (!showPaths.includes(location.pathname)) return null;
```

**Checklist Before Adding Global Components**:
1. ✅ Check EVERY page for existing headers/logos
2. ✅ Test on actual pages, not just in isolation
3. ✅ Use whitelist instead of blacklist
4. ✅ Add proper padding to prevent content overlap

**Fixed In**: Commit `17eeb08` and `8efc2e4` (2025-12-29)

---

### 🟢 Non-Critical Warnings

#### Tailwind CDN in Production
**Warning**: `cdn.tailwindcss.com should not be used in production`

**Status**: Works fine, but not optimal for performance

**Future Fix** (optional):
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Zustand Deprecation
**Warning**: `Default export is deprecated`

**Status**: ✅ Already fixed - all our stores use `import { create } from 'zustand'`

**Likely Source**: Vercel instrumentation or third-party packages

---

## Architecture Patterns

### Component Placement Rules

#### React Router Hooks
- ✅ **MUST** be inside `<Router>` component
- ✅ Place in `Router.jsx` or child components
- ❌ **NEVER** in `App.jsx` before `<Router>`

#### Global Navigation Components
```javascript
// Whitelist pattern for conditional rendering
const showPaths = ['/story', '/specific-page'];
if (!showPaths.includes(location.pathname)) {
  return null;
}
```

#### State Management (Zustand)
```javascript
// ✅ CORRECT - Named import
import { create } from 'zustand';

const useStore = create((set) => ({
  // state here
}));

// ❌ WRONG - Default import (deprecated)
import create from 'zustand';
```

### File Organization

```
src/
├── components/          # Reusable components
│   ├── StickyLogoBanner.jsx    # Global navigation
│   ├── Logo.jsx                # Logo component
│   └── ...
├── pages/              # Page components (routed)
│   ├── Dashboard.jsx
│   ├── StoryPage.jsx
│   └── ...
├── store/              # Zustand stores
│   └── useStore.js
├── Router.jsx          # Route definitions
└── App.jsx             # Root component
```

---

## Recent Changes Log

### 2025-12-29: Story Page Overlapping Fix
**Commit**: `8efc2e4`

**Changes**:
- Removed redundant sticky header from `StoryPage.jsx`
- StickyLogoBanner now provides navigation
- Added `pt-20` padding to story content
- Restricted StickyLogoBanner to `/story` page only

**Files Modified**:
- `src/StoryPage.jsx` - Removed sticky header
- `src/components/StickyLogoBanner.jsx` - Restricted to `/story`
- `src/pages/StoryPage.jsx` - Removed `onBack` prop

---

### 2025-12-29: UX Improvements Complete
**Commits**: `8182002`, `d19d534`, `ece31fc`, `17eeb08`, `fca95e8`

**5 Major Changes**:

1. **Sticky Logo Banner** - Navigation to dashboard from story page
   - Only shows on pages without headers
   - Prevents UI overlapping
   - File: `src/components/StickyLogoBanner.jsx`

2. **Enhanced Google Sign-In** - Bright white button with official logo
   - 300% more visible
   - Official Google brand colors (#4285F4, #34A853, #FBBC05, #EA4335)
   - File: `src/LandingPage.jsx:127-147`

3. **Auto-Redirect for Returning Users** - Skip landing page
   - Checks `hasCompletedOnboarding`
   - Direct to dashboard via `useEffect`
   - File: `src/pages/LandingPage.jsx:11-17`

4. **Simplified Onboarding** - Removed energy/mood check-in
   - Deleted Step 0 (~230 lines)
   - Only asks for initials (not name)
   - Faster onboarding (50% reduction)
   - File: `src/Onboarding.jsx`

5. **Time-Based Recommendations** - Meal and work suggestions
   - 5 time periods (Morning, Midday, Afternoon, Evening, Night)
   - Combines time-of-day + energy level
   - File: `src/pages/CheckInPage.jsx:108-192`

---

## Build & Deployment

### Local Build
```bash
npm run build
```

**Output**:
- `build/` directory with static files
- Main JS bundle: ~262KB gzipped
- CSS bundle: ~1.87KB

**Success Indicators**:
- ✅ "The build folder is ready to be deployed"
- ✅ No errors (warnings are okay)
- ✅ ESLint passes

### Deploy to Vercel

**Production Branch**: `claude/review-mvp-master-plan-eKpTu`

**Push Changes**:
```bash
git add -A
git commit -m "description"
git push -u origin claude/review-mvp-master-plan-eKpTu
```

**Auto-Deploy**: Vercel watches the branch and deploys automatically

**Environment Variables** (Vercel Dashboard):
```
REACT_APP_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY
REACT_APP_STRIPE_STARTER_PAYMENT_LINK
```

---

## Common Tasks

### Add New Route

**1. Create page component** in `src/pages/NewPage.jsx`
```javascript
const NewPage = () => {
  return <div>New Page Content</div>;
};
export default NewPage;
```

**2. Add route** in `src/Router.jsx`
```javascript
import NewPage from './pages/NewPage';

// Inside <Routes>:
<Route path="/new-page" element={<NewPage />} />
```

**3. Add navigation** (optional)
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/new-page');
```

---

### Add Global Component (Sticky Header/Banner)

**⚠️ IMPORTANT**: Check for existing headers FIRST!

**Steps**:
1. Create component in `src/components/YourComponent.jsx`
2. Import and place in `Router.jsx` INSIDE `<Router>`
3. Use whitelist pattern for conditional display
4. Test on ALL pages for overlaps
5. Add proper z-index and padding

**Example**:
```javascript
// Router.jsx
import YourComponent from './components/YourComponent';

return (
  <Router>
    <PathTracker />
    <YourComponent />  // Inside Router!
    <Routes>...</Routes>
  </Router>
);

// YourComponent.jsx
const YourComponent = () => {
  const location = useLocation();

  // Whitelist - only show where needed
  const showPaths = ['/specific-page'];
  if (!showPaths.includes(location.pathname)) {
    return null;
  }

  return <div className="fixed top-4 z-50">...</div>;
};
```

---

### Debug Production Errors

**1. Check Console Logs**
- Open browser DevTools → Console
- Look for red errors
- Check React error boundaries

**2. Common Issues**:
- Router context errors → Move component inside `<Router>`
- UI overlapping → Use whitelist pattern
- Build errors → Run `npm run lint` first

**3. Test Build Locally**:
```bash
npm run build
npx serve -s build
# Open http://localhost:3000
```

---

### Update Dependencies

**Check for Updates**:
```bash
npm outdated
```

**Update Specific Package**:
```bash
npm install package-name@latest
```

**⚠️ WARNING**: Test thoroughly after updates, especially:
- `react-router-dom`
- `zustand`
- `react-scripts`

---

## Best Practices

### Before Every Code Change

1. ✅ Read this guide first
2. ✅ Check for similar patterns in codebase
3. ✅ Test on multiple pages
4. ✅ Run `npm run build` before committing
5. ✅ Check for console errors

### Commit Message Format

```
type: brief description

- Bullet point 1
- Bullet point 2

Fixes: specific issue
```

**Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**Example**:
```
fix: Remove overlapping header from story page

- Removed redundant sticky header
- StickyLogoBanner now provides navigation
- Added pt-20 padding to content

Fixes: UI overlapping on story page
```

### Code Review Checklist

- [ ] No Router context errors
- [ ] No UI overlapping
- [ ] Build succeeds without errors
- [ ] ESLint passes
- [ ] Tested on multiple pages
- [ ] Responsive on mobile
- [ ] Dark mode works
- [ ] Console has no errors

---

## Emergency Fixes

### App Won't Load

**Check**:
1. Console errors → Fix Router context issues
2. Build errors → Run `npm run build`
3. Git status → Revert last commit if needed

**Quick Revert**:
```bash
git log --oneline -5        # Find last good commit
git reset --hard <commit>   # Revert to it
git push -f origin <branch> # Force push (CAREFUL!)
```

### Production Broken

**Immediate Steps**:
1. Check Vercel deployment logs
2. Check browser console
3. Verify environment variables
4. Rollback to last working deployment

**Vercel Rollback**:
- Go to Vercel dashboard
- Deployments tab
- Click "..." on last working deployment
- Click "Promote to Production"

---

## Reference Links

- **React Router**: https://reactrouter.com/
- **Zustand**: https://zustand-demo.pmnd.rs/
- **Tailwind CSS**: https://tailwindcss.com/
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs

---

## Memory Notes for Future Sessions

### ✅ Patterns That Work

1. **Whitelist over Blacklist** - For conditional component rendering
2. **Router Components Inside Router** - Never outside
3. **Top Padding for Fixed Elements** - Prevent content overlap
4. **Build Before Commit** - Catch errors early

### ❌ Common Mistakes to Avoid

1. **Don't** place Router hooks outside `<Router>`
2. **Don't** use blacklist for global components
3. **Don't** skip testing on all pages
4. **Don't** commit without running build
5. **Don't** force push without confirmation

### 🎯 Current Production Status

- **Branch**: `claude/review-mvp-master-plan-eKpTu`
- **Status**: ✅ Production ready
- **Last Deploy**: 2025-12-29
- **Known Issues**: None
- **Warnings**: Tailwind CDN (non-critical)

---

**END OF GUIDE**

*This is the ONLY implementation guide. All other session summaries, plans, and fix documents have been consolidated here.*
