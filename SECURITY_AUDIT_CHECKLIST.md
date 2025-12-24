# DualTrack OS - Security Audit Checklist

**Purpose**: Comprehensive security review before production launch
**Severity Levels**: 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

---

## 🔴 Critical Security Issues (Must Fix Before Launch)

### 1. Secret Key Exposure

**Check**: No server-side secrets in frontend code

```bash
# Run these checks in your project root
grep -r "sk_live_" src/
grep -r "sk_test_" src/
grep -r "service_role" src/
grep -r "whsec_" src/
```

**Expected**: All commands return no results

**Checklist**:
- [ ] No Stripe secret keys in frontend (`sk_live_` or `sk_test_`)
- [ ] No Supabase service role key in frontend
- [ ] No webhook secrets in frontend (`whsec_`)
- [ ] All secrets are in environment variables or Supabase Edge Functions only

**If any found**: 🔴 **CRITICAL** - Remove immediately, rotate all exposed keys

---

### 2. Environment Files in Git

**Check**: Sensitive files not committed to repository

```bash
# Check if .env files are tracked
git ls-files | grep ".env"

# Check .gitignore
cat .gitignore | grep ".env"
```

**Expected**:
- `.env` files NOT in `git ls-files` output
- `.env*` pattern IS in `.gitignore`

**Checklist**:
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.production` is in `.gitignore` (if exists)
- [ ] `.env` is in `.gitignore`
- [ ] No `.env` files committed to Git history

**If `.env` file found in Git**:
```bash
# Remove from Git (but keep local file)
git rm --cached .env.local
git commit -m "Remove .env.local from Git"
git push

# Rotate ALL keys that were exposed
```

**Severity**: 🔴 **CRITICAL** - Keys may be compromised

---

### 3. Row Level Security (RLS) Enabled

**Check**: All tables have RLS policies

**Go to**: Supabase Dashboard → Table Editor → Select each table → Click "⚙️" → View policies

**Tables to check**:

**user_data**:
- [ ] RLS enabled (toggle at top of table)
- [ ] Policy: `SELECT` - Users can read their own data (`auth.uid() = id`)
- [ ] Policy: `INSERT` - Users can insert their own data (`auth.uid() = id`)
- [ ] Policy: `UPDATE` - Users can update their own data (`auth.uid() = id`)
- [ ] Policy: `DELETE` - Users can delete their own data (`auth.uid() = id`)

**subscriptions**:
- [ ] RLS enabled
- [ ] Policy: `SELECT` - Users can read their own subscriptions (`auth.uid() = user_id`)
- [ ] Policy: `INSERT` - Service role only (for webhooks)
- [ ] Policy: `UPDATE` - Service role only (for webhooks)

**stripe_events**:
- [ ] RLS enabled
- [ ] Policy: `SELECT` - Service role only
- [ ] Policy: `INSERT` - Service role only
- [ ] Policy: `UPDATE` - Service role only

**audit_logs**:
- [ ] RLS enabled
- [ ] Policy: `SELECT` - Users can read their own logs (`auth.uid() = user_id`)
- [ ] Policy: `INSERT` - Service role only

**If any table has RLS disabled or no policies**:

```sql
-- Enable RLS on table
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Create policy (example for user_data)
CREATE POLICY "Users can read their own data"
  ON user_data FOR SELECT
  USING (auth.uid() = id);
```

**Severity**: 🔴 **CRITICAL** - Users can access other users' data

---

### 4. HTTPS Enforcement

**Check**: All requests use HTTPS, no mixed content

**Test**:
1. Open your app in browser
2. Open Developer Tools → Console
3. Look for mixed content warnings

**Checklist**:
- [ ] No mixed content warnings (HTTP resources loaded on HTTPS page)
- [ ] All API calls use HTTPS
- [ ] Supabase URL starts with `https://`
- [ ] Stripe checkout uses HTTPS
- [ ] All external resources (CDNs, images) use HTTPS

**Vercel automatically enforces HTTPS**: ✅

**Severity**: 🔴 **CRITICAL** - Enables man-in-the-middle attacks

---

### 5. Authentication Bypass

**Test**: Cannot access protected routes without authentication

**Manual Test**:
1. Open app in incognito/private browsing
2. Navigate directly to `/dashboard` (without logging in)
3. Expected: Redirected to landing page or login screen
4. Try accessing other protected routes: `/settings`, `/pricing`

**Checklist**:
- [ ] Cannot access dashboard without login
- [ ] Cannot access settings without login
- [ ] Cannot call Edge Functions without auth token
- [ ] Auth token is validated server-side (not just client-side)

**If you can access protected routes without auth**:

Check `src/App.js` (or routing file):
```javascript
// Should have auth check like this:
{user ? <DashboardPage /> : <LandingPage />}

// Or use protected route wrapper:
<ProtectedRoute user={user}>
  <DashboardPage />
</ProtectedRoute>
```

**Severity**: 🔴 **CRITICAL** - Unauthorized access to user data

---

## 🟠 High Priority Security Issues (Fix Before Public Launch)

### 6. API Key Rotation

**Check**: API keys have been rotated recently

**When to rotate**:
- Before production launch
- Every 90 days in production
- If any key was ever exposed (even briefly)

**Checklist**:
- [ ] Supabase anon key rotated before launch
- [ ] Supabase service role key rotated before launch
- [ ] Stripe keys are fresh (not shared with other projects)
- [ ] Sentry DSN is fresh (not shared with other projects)

**How to rotate Supabase keys**:
1. Go to Supabase Dashboard → Settings → API
2. Click "Regenerate" next to each key
3. Update environment variables in Vercel
4. Update Supabase secrets for Edge Functions
5. Redeploy

**Severity**: 🟠 **HIGH** - Reduces risk of compromised keys

---

### 7. Input Validation & Sanitization

**Test**: User inputs cannot execute malicious code

**Test 1: XSS (Cross-Site Scripting)**
```javascript
// Try entering in name field during onboarding:
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
```

**Expected**:
- [ ] Script does not execute
- [ ] Alert does not pop up
- [ ] Input is displayed as plain text (escaped)

**Test 2: SQL Injection**
```javascript
// Try entering in any text input:
' OR '1'='1
'; DROP TABLE user_data; --
```

**Expected**:
- [ ] No database errors
- [ ] Input treated as literal string

**React + Supabase protection**: ✅ (React escapes by default, Supabase uses parameterized queries)

**Checklist**:
- [ ] All user inputs are sanitized
- [ ] React components use `{variable}` (auto-escaped) not `dangerouslySetInnerHTML`
- [ ] No `eval()` or `innerHTML` usage with user data
- [ ] Supabase queries use parameterized inputs

**Severity**: 🟠 **HIGH** - Enables account takeover, data theft

---

### 8. Rate Limiting

**Check**: API endpoints have rate limiting

**Supabase Edge Functions**:
- [ ] Check if rate limiting is enabled (Supabase Dashboard → Edge Functions → Settings)
- [ ] Default: 100 requests/minute per IP (usually sufficient for MVP)

**Stripe**:
- [ ] Stripe has built-in rate limiting ✅

**Checklist**:
- [ ] Edge Functions won't crash under high load
- [ ] Abusive users can't spam checkout endpoints
- [ ] Consider adding Cloudflare for additional DDoS protection (if needed)

**Severity**: 🟠 **HIGH** - Prevents abuse, reduces costs

---

### 9. Error Messages Don't Leak Info

**Test**: Error messages don't expose sensitive information

**Bad Example**:
```
Error: User with email john@example.com not found in database table 'users' at row 42
```

**Good Example**:
```
Login failed. Please check your credentials.
```

**Checklist**:
- [ ] Login errors don't reveal if email exists
- [ ] API errors don't expose database schema
- [ ] Stack traces not shown to users in production
- [ ] Sentry captures detailed errors (for you), users see generic messages

**React Production Build**: ✅ (automatically hides stack traces)

**Severity**: 🟠 **HIGH** - Enables reconnaissance attacks

---

## 🟡 Medium Priority Security Issues (Good Practices)

### 10. Security Headers

**Check**: HTTP security headers are set

**Test**:
```bash
curl -I https://your-app.vercel.app
```

**Expected headers** (already configured in `vercel.json`):
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY`
- [ ] `X-XSS-Protection: 1; mode=block`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- [ ] `Permissions-Policy: camera=(), microphone=(), geolocation=()`

**Already configured**: ✅

**Severity**: 🟡 **MEDIUM** - Defense in depth

---

### 11. Dependency Vulnerabilities

**Check**: No known vulnerabilities in dependencies

```bash
# Check for vulnerabilities
npm audit

# Fix automatically (if safe)
npm audit fix

# Review manually
npm audit --json
```

**Checklist**:
- [ ] No critical vulnerabilities
- [ ] No high vulnerabilities (or all accepted with justification)
- [ ] Dependencies are reasonably up-to-date

**If vulnerabilities found**:
- Review severity and exploitability
- Update packages if fix available
- Document accepted risks if no fix available

**Severity**: 🟡 **MEDIUM** - Depends on specific vulnerability

---

### 12. Session Management

**Test**: Sessions expire appropriately

**Supabase Default**:
- Access token expires: 1 hour
- Refresh token expires: 30 days (configurable)

**Checklist**:
- [ ] Sessions expire after inactivity (Supabase handles this)
- [ ] Logout clears session completely
- [ ] Cannot reuse old session tokens
- [ ] Refresh token rotation enabled (reduces replay attacks)

**Verify**:
1. Log in
2. Wait >1 hour (or manually expire token in Supabase Dashboard)
3. Try accessing protected resource
4. Expected: Prompted to log in again

**Severity**: 🟡 **MEDIUM** - Reduces session hijacking risk

---

### 13. CORS Configuration

**Check**: CORS allows only your domains

**Supabase CORS** (for Edge Functions):
- Default: Allows all origins for Edge Functions (configured in code)

**Check `supabase/functions/_shared/cors.ts`**:
```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // ⚠️ Should be specific domain in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

**Recommendation**: Update to specific domain before launch:
```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-app.vercel.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

**Checklist**:
- [ ] CORS restricts to your domain (or `*` is acceptable for public API)
- [ ] Preflight requests work correctly
- [ ] No CORS errors in browser console

**Severity**: 🟡 **MEDIUM** - Prevents unauthorized cross-origin requests

---

### 14. Logging & Monitoring

**Check**: Security events are logged

**Checklist**:
- [ ] Failed login attempts logged (Supabase Auth logs)
- [ ] Payment failures logged (Stripe + Sentry)
- [ ] Suspicious activity detectable (multiple failed attempts, rapid API calls)
- [ ] Sentry alerts set up for critical errors

**Supabase Logs**:
- Go to: Supabase Dashboard → Logs → Auth
- Can see: Login attempts, signups, password resets

**Stripe Logs**:
- Go to: Stripe Dashboard → Developers → Events
- Can see: All payment events

**Sentry Alerts**:
- Go to: Sentry Dashboard → Alerts
- Set up: Email/Slack alerts for new errors

**Severity**: 🟡 **MEDIUM** - Enables incident response

---

## 🟢 Low Priority Security Issues (Nice-to-Have)

### 15. Content Security Policy (CSP)

**Optional**: Add CSP header to further restrict scripts

**Not configured yet** - Can add to `vercel.json`:
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; ..."
}
```

**Tradeoff**: CSP is very strict and can break functionality if misconfigured. Not critical for MVP.

**Severity**: 🟢 **LOW** - Additional XSS protection

---

### 16. Subresource Integrity (SRI)

**Optional**: Add integrity hashes to external scripts

**Example**:
```html
<script src="https://cdn.example.com/library.js"
  integrity="sha384-..."
  crossorigin="anonymous"></script>
```

**Not critical for MVP** - Only relevant if loading external scripts from CDNs

**Severity**: 🟢 **LOW** - Prevents CDN compromise

---

### 17. Security.txt

**Optional**: Add `/.well-known/security.txt`

**Purpose**: Tells security researchers how to report vulnerabilities

**Example**:
```
Contact: mailto:security@example.com
Expires: 2026-12-31T23:59:59Z
Preferred-Languages: en
```

**Not critical for MVP** - More relevant for larger companies

**Severity**: 🟢 **LOW** - Facilitates responsible disclosure

---

## 🔒 Compliance & Legal Security

### 18. GDPR Compliance (EU Users)

**Checklist**:
- [ ] Privacy Policy mentions data collection
- [ ] Privacy Policy mentions third parties (Supabase, Stripe, Sentry)
- [ ] Users can request data export
- [ ] Users can request data deletion
- [ ] Cookie consent (if using cookies for tracking)

**Data Deletion**:
Currently implemented via:
- Supabase Dashboard → Authentication → Users → Delete user
- Cascade delete configured for related data

**Severity**: Legal requirement for EU users

---

### 19. CCPA Compliance (California Users)

**Checklist**:
- [ ] Privacy Policy mentions California users' rights
- [ ] "Do Not Sell My Personal Information" link (if applicable)
- [ ] Users can opt-out of data sharing

**Current status**: Privacy Policy includes CCPA section ✅

**Severity**: Legal requirement for California users

---

### 20. PCI DSS Compliance (Payment Cards)

**Checklist**:
- [ ] Never store credit card numbers (Stripe handles this) ✅
- [ ] Never store CVV codes ✅
- [ ] Use Stripe Checkout (PCI compliant) ✅
- [ ] All payment data transmitted via HTTPS ✅

**Stripe handles PCI compliance**: ✅

**Severity**: Legal requirement for accepting payments

---

## 📊 Security Audit Score

**Calculate your security score**:

| Category | Critical Issues | High Issues | Medium Issues | Low Issues |
|----------|----------------|-------------|---------------|------------|
| Secret Management | /5 | /1 | /0 | /0 |
| Authentication | /2 | /1 | /2 | /0 |
| Data Protection | /1 | /0 | /2 | /0 |
| Infrastructure | /1 | /2 | /2 | /3 |
| Compliance | /0 | /0 | /0 | /3 |

**Scoring**:
- Critical issue: -20 points each
- High issue: -10 points each
- Medium issue: -5 points each
- Low issue: -2 points each

**Starting score**: 100
**Final score**: 100 - (critical × 20) - (high × 10) - (medium × 5) - (low × 2)

**Grade**:
- 90-100: A (Excellent)
- 80-89: B (Good)
- 70-79: C (Acceptable)
- 60-69: D (Needs improvement)
- Below 60: F (Not production-ready)

---

## ✅ Final Security Sign-Off

**Before launching to production**:

### Must Fix (Cannot launch with these issues)
- [ ] No critical issues (score: 0 critical)
- [ ] Secrets not exposed in frontend
- [ ] RLS enabled on all tables
- [ ] HTTPS enforced everywhere
- [ ] Authentication required for protected routes

### Should Fix (Fix before public launch)
- [ ] No high priority issues (or documented exceptions)
- [ ] API keys rotated
- [ ] Input validation working
- [ ] Error messages don't leak info

### Nice to Fix (Can fix after launch)
- [ ] Medium/low priority issues addressed or documented
- [ ] Security headers configured
- [ ] Dependency vulnerabilities resolved or accepted

---

## 🚨 Incident Response Plan

**If a security issue is discovered after launch**:

1. **Assess severity** (using this checklist)
2. **Take immediate action**:
   - Critical: Take app offline if needed, rotate all keys
   - High: Fix within 24 hours
   - Medium: Fix within 7 days
   - Low: Fix in next release
3. **Notify affected users** (if user data compromised)
4. **Document incident** (what happened, how fixed, lessons learned)
5. **Update security checklist** (prevent recurrence)

---

**Your security audit is complete. Review all findings and fix critical/high issues before launch.** 🔒
