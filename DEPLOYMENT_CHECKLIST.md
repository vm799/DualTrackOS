# 🚀 Deployment Checklist

Use this checklist **every time** before deploying to production to prevent React Hooks errors and other issues.

## ✅ Pre-Deployment Checklist

### 1. Code Quality
- [ ] Run `npm run lint` - All files pass linting
- [ ] Run `npm run lint:fix` - Auto-fix any fixable issues
- [ ] No ESLint errors (warnings are OK, errors block build)

### 2. Hooks Validation
- [ ] Run `npm run validate:hooks` - Passes without errors
- [ ] Review any warnings about potential hooks violations
- [ ] If errors found, fix them before proceeding

### 3. Local Testing
- [ ] Run `npm start` - App starts without errors
- [ ] Test all new features in browser
- [ ] Check browser console - No React errors
- [ ] Test in both light and dark mode
- [ ] Test on mobile viewport (responsive)

### 4. Build Validation
- [ ] Run `npm run build` - Build succeeds
- [ ] Check build output for warnings
- [ ] Build size is reasonable (no huge increases)

### 5. Git Checks
- [ ] All changes committed
- [ ] Commit messages are descriptive
- [ ] No sensitive data in commits (.env files excluded)
- [ ] Pre-commit hook passed

### 6. Feature Verification
- [ ] New features work as expected
- [ ] No existing features broken (regression testing)
- [ ] All routes still work
- [ ] Navigation flows correctly

### 7. Error Boundaries
- [ ] Error boundaries in place
- [ ] Tested error recovery (if applicable)

## 🚫 Red Flags - DO NOT DEPLOY IF:

- ❌ `npm run validate:hooks` fails with errors
- ❌ `npm run build` fails
- ❌ Browser console shows React errors
- ❌ ESLint shows `react-hooks/rules-of-hooks` errors
- ❌ Any component has hooks after early returns
- ❌ Any hooks are called conditionally
- ❌ Features are broken in local testing

## 🎯 Deployment Commands

### Standard Deployment (Recommended)
```bash
npm run deploy
```
This runs validation + build + deploy.

### Manual Deployment Steps
```bash
# 1. Validate
npm run validate

# 2. Build
npm run build

# 3. Deploy (Vercel)
vercel --prod
```

### Emergency Deployment (Last Resort)
```bash
npm run build:skip-validation
vercel --prod
```
**⚠️ WARNING**: Only use in extreme emergencies. Document why you used this.

## 📋 Post-Deployment Verification

After deployment, verify in production:

- [ ] Homepage loads without errors
- [ ] Dashboard loads without errors
- [ ] Check browser console - No React Hooks errors
- [ ] Navigation works (all routes)
- [ ] New features work in production
- [ ] Test on real mobile device (if possible)
- [ ] Check Vercel deployment logs - No errors

## 🐛 If Production Breaks

### Immediate Actions
1. **Check Vercel logs** for specific errors
2. **Check browser console** on production URL
3. **Roll back** to previous deployment if critical
4. **Disable problematic feature** if isolated

### Rollback Command
```bash
# In Vercel dashboard, click "Promote to Production" on previous deployment
```

### Debug Mode
To get better error messages in production:
1. Temporarily change `NODE_ENV=development` in Vercel
2. Deploy
3. Check detailed error messages
4. Fix issue
5. Change back to `NODE_ENV=production`

## 📝 Common Issues & Solutions

### Issue: React Hooks #185 Error
**Solution**:
- Hook called after early return
- Fix by moving all hooks to top of component
- See BUILD_GUIDE.md for examples

### Issue: Build succeeds but production crashes
**Solution**:
- Environment variable mismatch
- Check Vercel environment variables
- Ensure all required env vars are set

### Issue: Features work locally but not in production
**Solution**:
- Check for `process.env.NODE_ENV` conditionals
- Verify production build includes all needed code
- Check for missing dependencies

## 🔄 Continuous Improvement

After each deployment:
- [ ] Document any issues encountered
- [ ] Update this checklist if new checks needed
- [ ] Share learnings with team
- [ ] Update BUILD_GUIDE.md if patterns discovered

---

## 📞 Emergency Contacts

If production is completely broken:
1. Rollback to last known good deployment
2. Investigate issue in development
3. Fix and re-deploy

Remember: **Prevention is better than cure**. Use this checklist every time.

---

Last Updated: 2025-12-28
