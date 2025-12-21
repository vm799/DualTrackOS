# Google OAuth Setup Guide for DualTrack OS

## 🔐 Setting Up Google Sign-In with Supabase

This guide walks you through setting up Google OAuth authentication for DualTrack OS.

---

## Prerequisites

- [ ] Supabase account (free tier is fine)
- [ ] Google Cloud account (free)
- [ ] DualTrack OS repository cloned locally

---

## Part 1: Create Supabase Project

### Step 1: Create Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if you don't have one)
4. Click "New Project"
5. Fill in:
   - **Name:** DualTrack-OS
   - **Database Password:** (generate a strong password - save it!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free
6. Click "Create new project"
7. Wait 2-3 minutes for project to be provisioned

### Step 2: Get Supabase Credentials
1. In your Supabase project dashboard, click "Settings" (gear icon) in the left sidebar
2. Click "API" under "Configuration"
3. Copy these values:
   - **Project URL:** `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)

### Step 3: Add to .env File
1. In your DualTrack OS project, create a `.env` file in the root directory
2. Add these lines (replace with your actual values):

```bash
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file
4. **IMPORTANT:** Make sure `.env` is in your `.gitignore` (it should be by default)

---

## Part 2: Set Up Google OAuth

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" dropdown at the top
3. Click "New Project"
4. Fill in:
   - **Project name:** DualTrack-OS
   - **Organization:** (leave default or select your org)
5. Click "Create"

### Step 2: Enable Google+ API
1. In the left sidebar, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it
4. Click "Enable"

### Step 3: Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type
3. Click "Create"
4. Fill in **App information:**
   - **App name:** DualTrack OS
   - **User support email:** your-email@example.com
   - **App logo:** (optional - upload lioness logo if desired)
5. Fill in **Developer contact information:**
   - **Email addresses:** your-email@example.com
6. Click "Save and Continue"
7. **Scopes:** Click "Add or Remove Scopes"
   - Select: `userinfo.email` and `userinfo.profile`
   - Click "Update"
   - Click "Save and Continue"
8. **Test users:** (optional for now)
   - Click "Save and Continue"
9. Click "Back to Dashboard"

### Step 4: Create OAuth Client
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. **Application type:** Web application
4. **Name:** DualTrack OS Web Client
5. **Authorized JavaScript origins:**
   - Click "Add URI"
   - Add: `https://your-project.supabase.co`
6. **Authorized redirect URIs:**
   - Click "Add URI"
   - Add: `https://your-project.supabase.co/auth/v1/callback`
   - **IMPORTANT:** Replace `your-project` with your actual Supabase project URL
7. Click "Create"
8. **Save these credentials:**
   - **Client ID:** `123456789-xxxxxxxxxxxxxxxx.apps.googleusercontent.com`
   - **Client Secret:** `GOCSPX-xxxxxxxxxxxxxxxxxxxxx`

---

## Part 3: Connect Google to Supabase

### Step 1: Add Google Provider to Supabase
1. In your Supabase dashboard, go to "Authentication" (key icon) in left sidebar
2. Click "Providers" under "Configuration"
3. Find "Google" in the list
4. Toggle it **ON** (enable it)
5. Fill in:
   - **Client ID (for OAuth):** Paste your Google Client ID
   - **Client Secret (for OAuth):** Paste your Google Client Secret
6. Click "Save"

### Step 2: Configure Email Settings (Optional)
1. In Supabase "Authentication" > "Email Templates"
2. Customize templates if desired (Confirm signup, Magic Link, etc.)
3. Or leave defaults for now

---

## Part 4: Test the Integration

### Step 1: Restart Your App
```bash
# Stop your dev server (Ctrl+C)
# Start it again
npm start
```

### Step 2: Test Sign-In
1. Go to `http://localhost:3000`
2. Click "Sign in with Google"
3. You should be redirected to Google's OAuth consent screen
4. Sign in with your Google account
5. Grant permissions
6. You should be redirected back to DualTrack OS
7. Check if you see "Signed in as your-email@gmail.com" at the bottom

---

## Troubleshooting

### Issue: "Supabase not configured" error
**Solution:** Make sure your `.env` file has the correct values and restart the dev server.

### Issue: "Redirect URI mismatch" error
**Solution:**
1. Check that your Google OAuth redirect URI exactly matches: `https://your-project.supabase.co/auth/v1/callback`
2. Make sure you used your actual Supabase project URL (not "your-project")
3. Wait 5 minutes after adding the URI (Google can take time to propagate changes)

### Issue: "Google+ API not enabled"
**Solution:**
1. Go to Google Cloud Console > APIs & Services > Library
2. Search for "Google+ API"
3. Click "Enable"

### Issue: Sign-in button doesn't do anything
**Solution:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Click "Sign in with Google" again
4. Look for error messages
5. Share the error message with support

### Issue: After signing in, nothing happens
**Solution:**
1. Check Supabase logs: Authentication > Logs
2. Look for failed auth attempts
3. Verify your redirect URI is correct in both Google and Supabase

### Issue: "Invalid domain" error
**Solution:**
1. In Google Cloud Console, go to OAuth consent screen
2. Under "Authorized domains", add: `supabase.co`
3. Save and try again

---

## Security Best Practices

### Production Deployment

When deploying to production (e.g., Vercel, Netlify):

1. **Add production domain to Google OAuth:**
   - Go to Google Cloud Console > Credentials
   - Edit your OAuth client
   - Add your production domain to:
     - Authorized JavaScript origins: `https://your-domain.com`
     - Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`

2. **Set up custom domain for Supabase (optional):**
   - Go to Supabase > Settings > API
   - Click "Custom Domains" (Pro plan required)
   - Or continue using `your-project.supabase.co` redirect

3. **Update .env for production:**
   - In your hosting platform (Vercel/Netlify), add environment variables:
     - `REACT_APP_SUPABASE_URL`
     - `REACT_APP_SUPABASE_ANON_KEY`

4. **OAuth consent screen - Publish app:**
   - Once ready for production, go to OAuth consent screen
   - Click "Publish App"
   - This removes the "unverified app" warning

---

## Additional Configuration

### Enable Email/Password Sign-In (Alternative)
If you want to add email/password auth as an alternative to Google:

1. In Supabase > Authentication > Providers
2. Toggle "Email" ON
3. Configure email templates
4. Add email/password form to your LandingPage component

### Set Up Row Level Security
Protect user data in your database:

1. In Supabase > SQL Editor
2. Run this command:

```sql
-- Enable RLS on user_data table
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own data"
  ON user_data FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON user_data FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON user_data FOR INSERT
  WITH CHECK (auth.uid() = id);
```

---

## Verification Checklist

Before going live, verify:

- [ ] Google OAuth works in development
- [ ] User can sign in successfully
- [ ] User data saves to Supabase
- [ ] User can sign out
- [ ] Production domains added to Google OAuth
- [ ] Environment variables set in production hosting
- [ ] OAuth consent screen published (if going public)
- [ ] Email templates customized (optional)
- [ ] Row Level Security enabled on database tables

---

## Support Resources

- **Supabase Docs:** https://supabase.com/docs/guides/auth/social-login/auth-google
- **Google OAuth Docs:** https://developers.google.com/identity/protocols/oauth2
- **DualTrack OS Issues:** https://github.com/your-repo/DualTrackOS/issues

---

**Setup complete! Users can now sign in with Google.** 🎉
