# DualTrack OS - Robust Build & Deployment Guide

## 🛡️ Protection System

This project now has a **4-layer protection system** to prevent React Hooks errors from reaching production:

### Layer 1: ESLint (Development)
- **What**: Strict ESLint rules for React Hooks
- **When**: Real-time in your IDE
- **Config**: `.eslintrc.js`
- **Rule**: `react-hooks/rules-of-hooks: error` (blocks build)

### Layer 2: Pre-Commit Hook (Git)
- **What**: Validates code before allowing commits
- **When**: Every `git commit`
- **Location**: `.git/hooks/pre-commit`
- **Checks**:
  - ESLint on staged files
  - Custom hooks validation script

### Layer 3: Pre-Build Validation (npm)
- **What**: Runs validation before every build
- **When**: `npm run build`
- **Script**: `scripts/validate-hooks.js`
- **Blocks**: Build fails if violations found

### Layer 4: CI/CD (Future)
- **What**: Automated testing in CI pipeline
- **When**: Pull requests & deployments
- **Status**: Planned for future implementation

---

## 📋 Development Workflow

### Starting Development
```bash
# Start dev server (includes hot reload)
npm start
```

### Before Committing
```bash
# 1. Lint your code
npm run lint

# 2. Fix auto-fixable issues
npm run lint:fix

# 3. Validate hooks manually (optional - pre-commit hook does this)
npm run validate:hooks

# 4. Commit (pre-commit hook runs automatically)
git add .
git commit -m "your message"
```

### Building for Production
```bash
# Full build with validation (RECOMMENDED)
npm run build

# Skip validation (EMERGENCY ONLY - use with caution)
npm run build:skip-validation
```

### Deployment
```bash
# Deploy to production
npm run deploy
```

---

## 🚫 Common Hooks Violations & Fixes

### ❌ Problem 1: Hooks After Early Return
```javascript
// WRONG - Hook after return
function MyComponent({ condition }) {
  if (!condition) {
    return null;  // Early return
  }

  const [state, setState] = useState(0);  // ❌ Hook after return!

  return <div>{state}</div>;
}
```

```javascript
// CORRECT - All hooks before any returns
function MyComponent({ condition }) {
  const [state, setState] = useState(0);  // ✅ Hook at top

  if (!condition) {
    return null;  // Early return is OK now
  }

  return <div>{state}</div>;
}
```

### ❌ Problem 2: Conditional Hooks
```javascript
// WRONG - Hook inside condition
function MyComponent({ showFeature }) {
  if (showFeature) {
    const [value, setValue] = useState(0);  // ❌ Conditional hook!
  }

  return <div>Content</div>;
}
```

```javascript
// CORRECT - Hook always called
function MyComponent({ showFeature }) {
  const [value, setValue] = useState(0);  // ✅ Always called

  if (showFeature) {
    // Use the value here
  }

  return <div>Content</div>;
}
```

### ❌ Problem 3: Hooks in Loops
```javascript
// WRONG - Hook in loop
function MyComponent({ items }) {
  return items.map(item => {
    const [selected, setSelected] = useState(false);  // ❌ Hook in loop!
    return <div>{item}</div>;
  });
}
```

```javascript
// CORRECT - Extract to separate component
function Item({ item }) {
  const [selected, setSelected] = useState(false);  // ✅ In component
  return <div>{item}</div>;
}

function MyComponent({ items }) {
  return items.map(item => <Item key={item.id} item={item} />);
}
```

---

## 🔧 Scripts Reference

| Command | Description | Blocks on Error |
|---------|-------------|-----------------|
| `npm start` | Start dev server | No |
| `npm run lint` | Check code for errors | No |
| `npm run lint:fix` | Auto-fix linting issues | No |
| `npm run validate` | Run all validations | Yes |
| `npm run validate:hooks` | Check hooks rules only | Yes |
| `npm run build` | Build with validation | Yes |
| `npm run build:skip-validation` | Emergency build without checks | No |
| `npm run deploy` | Build + deploy to production | Yes |

---

## 🚨 If Build Fails

### Step 1: Check the Error Message
The validation script will show exactly which files and lines have violations.

### Step 2: Fix the Violations
Use the examples above to fix hooks violations.

### Step 3: Verify the Fix
```bash
npm run validate:hooks
```

### Step 4: Build Again
```bash
npm run build
```

### Emergency Override (NOT RECOMMENDED)
If you absolutely must build without validation:
```bash
npm run build:skip-validation
```
**⚠️ WARNING**: This bypasses all safety checks. Only use in emergencies.

---

## 🎯 Best Practices

### ✅ DO:
1. Run `npm run lint` before committing
2. Fix violations immediately when found
3. Use `npm run build` (with validation) before deploying
4. Keep all hooks at the top of components
5. Extract components if logic gets complex

### ❌ DON'T:
1. Skip validation to "save time"
2. Use `build:skip-validation` regularly
3. Put hooks inside conditions, loops, or after returns
4. Ignore ESLint warnings in your IDE
5. Commit code that fails validation

---

## 🐛 Debugging Hooks Errors

### Error: "Rendered fewer hooks than expected"
**Cause**: Component rendered different number of hooks between renders
**Fix**: Ensure all hooks are called unconditionally at the top level

### Error: "Hooks can only be called inside the body of a function component"
**Cause**: Calling hooks outside of React components
**Fix**: Move hooks inside function component or custom hook

### Error: "Invalid hook call"
**Cause**: Multiple reasons (see React docs)
**Fix**: Check React Hooks documentation

---

## 📚 Resources

- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
- [ESLint React Hooks Plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [React Error Decoder](https://reactjs.org/docs/error-decoder.html?invariant=185)

---

## 🔄 Updating This System

### Add New Validation Rules
Edit `.eslintrc.js` and add rules under the `rules` section.

### Modify Pre-Commit Hook
Edit `.git/hooks/pre-commit` (remember to keep it executable).

### Enhance Validation Script
Edit `scripts/validate-hooks.js` to add more sophisticated checks.

---

## ❓ FAQ

**Q: Why does my build take longer now?**
A: Validation adds ~5-10 seconds but prevents hours of debugging production errors.

**Q: Can I disable the pre-commit hook?**
A: Not recommended. If needed: `git commit --no-verify` (emergency only).

**Q: What if the validation script has false positives?**
A: Report them and we'll improve the script. Use `build:skip-validation` temporarily.

**Q: How do I share this with the team?**
A: The pre-commit hook is in `.git/hooks` which isn't tracked. Each developer needs to set it up after cloning.

---

## 🎉 Success!

This system ensures:
- ✅ No more React Hooks #185 errors in production
- ✅ Errors caught at development time, not runtime
- ✅ Automated validation before every build
- ✅ Consistent code quality across the team

Happy building! 🚀
