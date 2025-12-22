# Sentry Setup Guide

This guide covers setting up Sentry for error monitoring and performance tracking in DualTrack OS.

## 📋 What is Sentry?

Sentry is an error tracking and performance monitoring platform that helps you:
- Track JavaScript errors in production
- Monitor application performance
- Replay user sessions (with privacy protections)
- Get alerted when errors occur
- Debug issues with full stack traces and context

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Sentry Account

1. Go to [sentry.io](https://sentry.io/signup/)
2. Sign up with your email or GitHub
3. Choose the **Free Plan** (50K errors/month, 1 user)

### Step 2: Create Project

1. After signup, click **"Create Project"**
2. Select **React** as your platform
3. Give it a name: **DualTrack OS**
4. Set alert frequency: **On every new issue**
5. Click **"Create Project"**

### Step 3: Get Your DSN

After creating the project, you'll see:
```javascript
Sentry.init({
  dsn: "https://abc123def456@o789.ingest.sentry.io/1234567",
  // ...
});
```

**Copy the DSN** (the long URL starting with `https://`)

### Step 4: Add DSN to Environment Variables

**For Local Development**:

Add to `.env.local`:
```env
REACT_APP_SENTRY_DSN=https://your-actual-dsn-here
REACT_APP_SENTRY_ENABLED=true
```

**For Vercel Production**:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variable:
   - **Name**: `REACT_APP_SENTRY_DSN`
   - **Value**: Your DSN from Step 3
   - **Environment**: Production
3. Add variable:
   - **Name**: `REACT_APP_SENTRY_ENABLED`
   - **Value**: `true`
   - **Environment**: Production

### Step 5: Test It Works

```bash
# Start your app
npm start

# Open browser console and run:
throw new Error("Test Sentry error");

# Check Sentry dashboard - you should see the error appear!
```

**That's it!** Sentry is now tracking errors in your app.

---

## 📖 Detailed Configuration

### Sentry Features Already Configured

Your `src/sentry.js` includes:

#### 1. **Error Tracking**
- Automatically captures unhandled errors
- Captures unhandled promise rejections
- Filters out browser extension errors (noisy)
- Filters out network errors (except critical APIs)

#### 2. **Performance Monitoring**
- Tracks page load times
- Monitors API call performance
- Samples 10% of production traffic (to save quota)

#### 3. **Session Replay**
- Records 10% of normal sessions
- Records 100% of sessions with errors
- Masks all text and media for privacy (GDPR-compliant)

#### 4. **Breadcrumbs**
- Tracks user actions leading up to errors
- Stores last 50 actions
- Includes console logs, clicks, navigation

#### 5. **User Context**
- Attaches user ID and email to errors (after login)
- Helps identify which users are affected

### Manual Error Logging

Use these functions from `src/sentry.js`:

```javascript
import { logError, logMessage, addBreadcrumb } from '../sentry';

// Log an error
try {
  riskyOperation();
} catch (error) {
  logError(error, {
    tags: { section: 'checkout' },
    extra: { userId: user.id }
  });
}

// Log a message
logMessage('User upgraded to Premium', 'info', {
  tags: { event: 'subscription' }
});

// Add breadcrumb for debugging
addBreadcrumb('User clicked checkout button', 'user-action', {
  tier: 'premium'
});
```

### Set User Context

Update `src/hooks/useAuthInitialization.js`:

```javascript
import { setSentryUser } from '../sentry';

// After user logs in
useEffect(() => {
  if (session?.user) {
    setSentryUser(session.user);
  } else {
    setSentryUser(null); // Clear on logout
  }
}, [session]);
```

---

## 🔧 Advanced Configuration

### Source Maps (for readable stack traces)

**Important**: Without source maps, errors show minified code. With source maps, you see your actual code.

#### Option 1: Automatic Upload (Recommended)

1. Install Sentry CLI:
```bash
npm install --save-dev @sentry/cli
```

2. Add to `package.json`:
```json
{
  "scripts": {
    "build": "react-scripts build && sentry-cli releases files $(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') upload-sourcemaps ./build/static/js --url-prefix '~/static/js'"
  }
}
```

3. Create `.sentryclirc`:
```ini
[auth]
token=YOUR_AUTH_TOKEN_FROM_SENTRY_SETTINGS

[defaults]
url=https://sentry.io/
org=your-org-slug
project=dualtrack-os
```

4. Add `.sentryclirc` to `.gitignore`

#### Option 2: Manual Upload

After `npm run build`:
```bash
sentry-cli releases files VERSION upload-sourcemaps ./build/static/js
```

### Release Tracking

Track which version of your app has errors:

```bash
# Before deploying
export VERSION=$(node -p "require('./package.json').version")
sentry-cli releases new $VERSION
sentry-cli releases set-commits $VERSION --auto
sentry-cli releases finalize $VERSION
```

In Vercel, add to deploy script:
```bash
sentry-cli releases deploys $VERSION new -e production
```

### Alerts Configuration

1. Go to **Alerts** in Sentry Dashboard
2. Click **Create Alert Rule**
3. Recommended alert: **"Send email when error occurs more than 10 times in 1 hour"**
4. Add your email
5. Save

---

## 📊 Understanding Sentry Dashboard

### Issues Tab
- Shows all errors grouped by type
- Click an issue to see:
  - Stack trace
  - User affected
  - Breadcrumbs (what user did before error)
  - Session replay (if available)

### Performance Tab
- Page load times
- API call performance
- Slowest transactions
- Database query times (if instrumented)

### Releases Tab
- Errors by app version
- Regression detection (new errors in new versions)
- Commit history

### Replays Tab (NEW!)
- Watch what user did before error
- Privacy-safe (text/media masked)
- Invaluable for debugging

---

## 🎯 Best Practices

### 1. **Tag Errors for Filtering**

```javascript
logError(error, {
  tags: {
    component: 'CycleTracker',
    feature: 'menstrual-tracking',
    tier: user.subscriptionTier
  }
});
```

Then filter in Sentry: `component:CycleTracker tier:premium`

### 2. **Add Context for Debugging**

```javascript
Sentry.setContext('checkout', {
  tier: 'premium',
  billingPeriod: 'annual',
  amount: 290,
  stripeSessionId: session.id
});
```

### 3. **Don't Log PII (Personally Identifiable Information)**

**DO**:
```javascript
logError(error, { userId: user.id });
```

**DON'T**:
```javascript
logError(error, {
  email: user.email, // PII!
  creditCard: '4242...', // PCI violation!
  healthData: cycleInfo // HIPAA concern!
});
```

### 4. **Use Error Boundaries**

Already set up in `src/components/ErrorBoundary.jsx`!

Wrap critical sections:
```jsx
<ErrorBoundary componentName="CycleTracker">
  <CycleTracker />
</ErrorBoundary>
```

### 5. **Sample Production Traffic**

Your config already samples:
- 10% of normal traffic (performance)
- 100% of errors
- 10% of session replays (save quota)

Adjust in `src/sentry.js` if needed.

---

## 💰 Pricing & Quotas

### Free Tier (Developer Plan)
- **Errors**: 5,000 events/month
- **Performance**: 10,000 transactions/month
- **Replays**: 50 sessions/month
- **Users**: 1
- **Data Retention**: 30 days

### Team Plan ($26/month)
- **Errors**: 50,000 events/month
- **Performance**: 100,000 transactions/month
- **Replays**: 500 sessions/month
- **Users**: Unlimited
- **Data Retention**: 90 days

### Expected Usage (10K active users)
- Errors: ~500-1,000/month (0.01% error rate)
- Performance: ~10,000/month (sampled 10%)
- Replays: ~50/month (sampled 10% of errors)

**Verdict**: Free tier is enough for starting out!

---

## 🔐 Privacy & Compliance

### GDPR Compliance

Sentry is GDPR-compliant. Your configuration:
- ✅ Masks all text in session replays
- ✅ Blocks all media in session replays
- ✅ Doesn't log email addresses (use user IDs)
- ✅ 30-day data retention on free tier

### User Data Deletion

When user deletes account:
```javascript
// In your account deletion flow
import Sentry from '@sentry/react';

// Clear user from future errors
Sentry.setUser(null);

// Note: Past errors remain (30 days).
// Contact Sentry support for full GDPR deletion if needed.
```

### Health Data

**DO NOT** log health-sensitive data:
- ❌ Menstrual cycle dates
- ❌ Weight measurements
- ❌ Mood details
- ❌ Voice diary contents

**DO** log:
- ✅ User IDs (not emails)
- ✅ Subscription tiers
- ✅ Feature names
- ✅ Error contexts (non-sensitive)

---

## 🐛 Troubleshooting

### Issue: Errors not appearing in Sentry

**Checklist**:
1. ✅ DSN is set in environment variables
2. ✅ DSN is not the placeholder `YOUR_SENTRY_DSN_HERE`
3. ✅ App is in production mode OR `REACT_APP_SENTRY_ENABLED=true`
4. ✅ Error actually occurred (check browser console)
5. ✅ Not a filtered error (check `beforeSend` in `sentry.js`)

**Debug**:
```javascript
// In browser console after error
console.log(process.env.REACT_APP_SENTRY_DSN); // Should show your DSN
```

### Issue: Too many errors (quota exceeded)

**Solutions**:
1. Increase `ignoreErrors` in `sentry.js`
2. Adjust `beforeSend` filter
3. Lower `tracesSampleRate` (default 0.1 = 10%)
4. Upgrade Sentry plan

### Issue: Stack traces show minified code

**Solution**: Upload source maps (see Advanced Configuration above)

### Issue: Session replays not working

**Check**:
1. Replay integration installed (already in `sentry.js`)
2. Sample rate > 0 (default 0.1 = 10%)
3. Privacy settings not blocking (incognito mode blocks replays)

---

## 📚 Resources

- [Sentry React Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay Guide](https://docs.sentry.io/product/session-replay/)
- [GDPR Compliance](https://sentry.io/legal/dpa/)

---

## ✅ Setup Checklist

Use this for production deployment:

### Pre-Production
- [ ] Sentry account created
- [ ] Project created (platform: React)
- [ ] DSN copied

### Development
- [ ] `.env.local` has `REACT_APP_SENTRY_DSN`
- [ ] Test error logged successfully
- [ ] Error appears in Sentry dashboard
- [ ] User context working (after login)

### Production (Vercel)
- [ ] Environment variable `REACT_APP_SENTRY_DSN` set
- [ ] Environment variable `REACT_APP_SENTRY_ENABLED` = `true`
- [ ] Source maps uploaded (optional but recommended)
- [ ] Alert rules configured
- [ ] Team members added (if on paid plan)

### Post-Production
- [ ] Monitor for first 24 hours
- [ ] Verify errors are being captured
- [ ] Check quota usage
- [ ] Tune filters if too noisy

---

**That's it!** You now have production-grade error monitoring for DualTrack OS.

**Questions?** Check [docs.sentry.io](https://docs.sentry.io) or email support@sentry.io (they're very responsive!)

---

**Last Updated**: December 22, 2025
