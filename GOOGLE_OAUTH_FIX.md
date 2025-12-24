# Google OAuth Fix Guide

**Issue**: Google sign-in not working
**Root Cause**: OAuth requires Supabase configuration in Google Cloud Console
**Status**: Code is correct, just needs setup

---

## ✅ Current Implementation (Already Correct)

The code in `src/services/dataService.js` is correct:

```javascript
export const signInWithGoogle = async () => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not configured. Cannot sign in.');
    return { error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) {
      console.error('Google OAuth error:', error);
      return { error };
    }

    return { data };
  } catch (e) {
    console.error('Exception during Google sign in:', e);
    return { error: e };
  }
};
```

**This code is production-ready.** The "fix" is completing the OAuth setup.

---

## 🔧 What Needs to Be Done (Setup Only)

### Option 1: Follow Existing Guide (Recommended)

We already have a comprehensive guide: `docs/GOOGLE_OAUTH_SETUP.md`

**Steps**:
1. Read `docs/GOOGLE_OAUTH_SETUP.md`
2. Complete all steps (takes 10-15 minutes)
3. Test Google sign-in

---

### Option 2: Quick Setup (TL;DR)

If you want the fastest path:

#### Step 1: Supabase Dashboard
1. Go to https://supabase.com → Your project
2. Click **Authentication** → **Providers**
3. Enable **Google**
4. Leave this tab open (you'll need values from Step 2)

#### Step 2: Google Cloud Console
1. Go to https://console.cloud.google.com
2. Create new project: "Strong Woman OS"
3. Enable **Google+ API** (APIs & Services → Library)
4. Create **OAuth consent screen** (External, add app name)
5. Create **OAuth 2.0 Client ID**:
   - Type: Web application
   - Authorized JavaScript origins: `https://[your-project].supabase.co`
   - Authorized redirect URIs: `https://[your-project].supabase.co/auth/v1/callback`
6. Copy **Client ID** and **Client Secret**

#### Step 3: Back to Supabase
1. Paste **Client ID** into Supabase Google provider settings
2. Paste **Client Secret** into Supabase Google provider settings
3. Click **Save**

#### Step 4: Test
1. Run your app locally: `npm start`
2. Click "Sign in with Google"
3. Should redirect to Google login → redirect back to `/dashboard`

---

## 🚨 Common Issues

### Issue 1: "Redirect URI mismatch"
**Cause**: Google Cloud redirect URI doesn't match Supabase
**Fix**: Ensure redirect URI is exactly:
```
https://[your-project-ref].supabase.co/auth/v1/callback
```
(Replace `[your-project-ref]` with your actual Supabase project ref)

---

### Issue 2: "Supabase not configured" error
**Cause**: Missing environment variables
**Fix**: Ensure `.env.local` has:
```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

---

### Issue 3: OAuth works locally but not in production
**Cause**: Vercel environment variables not set
**Fix**: Add Supabase URL and anon key to Vercel (see `VERCEL_DEPLOYMENT_GUIDE.md`)

---

### Issue 4: User redirected but not logged in
**Cause**: Supabase session not persisting
**Fix**: Check `src/App.js` has proper auth state listener:
```javascript
useEffect(() => {
  const { data: { subscription } } = onAuthStateChange((event, session) => {
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  });

  return () => subscription.unsubscribe();
}, []);
```

**Status**: This is already implemented in your app ✅

---

## 📊 OAuth Flow Diagram

```
User clicks "Sign in with Google"
          ↓
signInWithGoogle() called
          ↓
Supabase checks: Is Google OAuth configured?
          ↓
   Yes → Redirect to Google login
          ↓
User logs in with Google
          ↓
Google redirects to: https://[project].supabase.co/auth/v1/callback
          ↓
Supabase validates & creates session
          ↓
Supabase redirects to: /dashboard (from redirectTo option)
          ↓
App.js detects session → sets user state
          ↓
User is logged in ✅
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Google OAuth enabled in Supabase Dashboard (Authentication → Providers)
- [ ] OAuth Client ID created in Google Cloud Console
- [ ] Redirect URI matches Supabase callback URL exactly
- [ ] Environment variables set in `.env.local`
- [ ] Test: Click "Sign in with Google" → redirects to Google
- [ ] Test: After Google login → redirects to `/dashboard`
- [ ] Test: User state is set in app (check React DevTools)
- [ ] Test: Refresh page → user stays logged in (session persists)

---

## 🎯 Priority

**Priority**: Medium

**Why not urgent?**
- App works without Google OAuth (users can enter without signing in)
- Users can use the app with localStorage (no auth required for MVP)
- Google OAuth is a nice-to-have for data sync, not a blocker

**When to prioritize?**
- Before public launch (professional auth flow)
- If you want cross-device sync (requires auth + Supabase)
- If you want to track users (requires auth)

---

## 📝 Summary

**What to do**: Follow `docs/GOOGLE_OAUTH_SETUP.md` (10-15 minutes)
**Code changes needed**: None (code is already correct)
**When to do**: Before public launch, not urgent for beta

---

**Your Google OAuth code is already production-ready. Just complete the setup guide.** ✅
