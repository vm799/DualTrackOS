# Supabase Edge Functions

Backend API implemented as Deno-based serverless functions.

## Available Functions

### 1. `create-checkout-session`
Creates a Stripe Checkout session for subscription purchases.

**Endpoint**: `POST /functions/v1/create-checkout-session`

**Authentication**: Required (Bearer token)

**Request Body**:
```json
{
  "tier": "starter" | "premium" | "gold",
  "billingPeriod": "monthly" | "annual",
  "successUrl": "https://yourdomain.com/success", // optional
  "cancelUrl": "https://yourdomain.com/cancel"    // optional
}
```

**Response**:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### 2. `stripe-webhook`
Handles Stripe webhook events for subscription management.

**Endpoint**: `POST /functions/v1/stripe-webhook`

**Authentication**: Stripe signature verification

**Events Handled**:
- `checkout.session.completed` - User completed payment
- `customer.subscription.created` - New subscription created
- `customer.subscription.updated` - Subscription changed (upgrade/downgrade)
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.paid` - Payment successful
- `invoice.payment_failed` - Payment failed

## Setup

### Prerequisites

1. **Supabase CLI** installed
   ```bash
   npm install -g supabase
   ```

2. **Supabase Project** with database migrations applied
   - See `/supabase/README.md` for database setup

3. **Stripe Account** with products configured
   - See `/docs/STRIPE_SETUP_GUIDE.md`

### Step 1: Configure Environment Variables

Edge Functions need environment variables configured in Supabase.

#### Set Secrets via CLI

```bash
# Stripe Configuration
supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Stripe Price IDs (get from Stripe Dashboard → Products)
supabase secrets set STRIPE_STARTER_MONTHLY_PRICE_ID=price_XXXXXXXX
supabase secrets set STRIPE_STARTER_ANNUAL_PRICE_ID=price_XXXXXXXX
supabase secrets set STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_XXXXXXXX
supabase secrets set STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_XXXXXXXX
supabase secrets set STRIPE_GOLD_MONTHLY_PRICE_ID=price_XXXXXXXX
supabase secrets set STRIPE_GOLD_ANNUAL_PRICE_ID=price_XXXXXXXX

# Supabase Configuration (auto-populated, verify they exist)
supabase secrets set SUPABASE_URL=https://YOUR_PROJECT.supabase.co
supabase secrets set SUPABASE_ANON_KEY=YOUR_ANON_KEY
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

#### Set Secrets via Dashboard

1. Go to: https://app.supabase.com/project/YOUR_PROJECT/settings/functions
2. Click "Edge Functions" → "Secrets"
3. Add each secret one by one

### Step 2: Deploy Functions

#### Deploy All Functions

```bash
# From project root
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

#### Deploy Specific Function

```bash
supabase functions deploy create-checkout-session
```

#### Deploy with Logs

```bash
supabase functions deploy create-checkout-session --debug
```

### Step 3: Configure Stripe Webhook

1. Go to Stripe Dashboard: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. **Endpoint URL**:
   ```
   https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook
   ```
4. **Events to send**: Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_...`)
7. Set as environment variable:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
   ```

### Step 4: Test Functions

#### Test create-checkout-session

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/create-checkout-session \
  -H "Authorization: Bearer YOUR_USER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "starter",
    "billingPeriod": "monthly"
  }'
```

#### Test stripe-webhook (using Stripe CLI)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to local function
stripe listen --forward-to https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook

# Trigger test events
stripe trigger checkout.session.completed
```

## Local Development

### Run Functions Locally

```bash
# Start local Supabase (requires Docker)
supabase start

# Serve functions locally
supabase functions serve create-checkout-session --env-file .env.local

# In another terminal, test
curl -X POST http://localhost:54321/functions/v1/create-checkout-session \
  -H "Authorization: Bearer YOUR_LOCAL_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"tier": "starter", "billingPeriod": "monthly"}'
```

### Local Environment Variables

Create `.env.local` in `/supabase/`:

```bash
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LOCAL_WEBHOOK_SECRET
STRIPE_STARTER_MONTHLY_PRICE_ID=price_XXXXXXXX
STRIPE_STARTER_ANNUAL_PRICE_ID=price_XXXXXXXX
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_XXXXXXXX
STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_XXXXXXXX
STRIPE_GOLD_MONTHLY_PRICE_ID=price_XXXXXXXX
STRIPE_GOLD_ANNUAL_PRICE_ID=price_XXXXXXXX
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=YOUR_LOCAL_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_LOCAL_SERVICE_ROLE_KEY
```

## Monitoring

### View Function Logs

#### Via CLI
```bash
supabase functions logs create-checkout-session --tail
supabase functions logs stripe-webhook --tail
```

#### Via Dashboard
1. Go to: https://app.supabase.com/project/YOUR_PROJECT/logs/functions
2. Select function from dropdown
3. View real-time logs

### Common Log Entries

```
✅ Checkout session created: cs_test_...
✅ Subscription upserted for user <uuid>
✅ Event checkout.session.completed processed
❌ Webhook signature verification failed
❌ No supabase_user_id in subscription metadata
```

## Debugging

### Function Not Deploying

```bash
# Check syntax errors
deno check supabase/functions/create-checkout-session/index.ts

# Redeploy with verbose logging
supabase functions deploy create-checkout-session --debug
```

### Webhook Not Receiving Events

1. Check webhook is active in Stripe Dashboard
2. Verify signing secret is correct:
   ```bash
   supabase secrets list
   ```
3. Check Stripe webhook logs: https://dashboard.stripe.com/webhooks
4. Test with Stripe CLI:
   ```bash
   stripe listen --forward-to https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook
   ```

### Subscription Not Updating

1. Check `stripe_events` table for errors:
   ```sql
   SELECT * FROM stripe_events WHERE processed = false ORDER BY created_at DESC;
   ```
2. Check function logs for errors
3. Verify RLS policies allow service_role to update subscriptions:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'subscriptions';
   ```

### User Not Authenticated

Error: `"error": "Unauthorized"`

**Solution**: Ensure you're passing the user's access token:
```javascript
const { data: { session } } = await supabase.auth.getSession()
const response = await fetch('https://YOUR_PROJECT.supabase.co/functions/v1/create-checkout-session', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ tier: 'starter', billingPeriod: 'monthly' })
})
```

## Security Notes

1. ✅ **Authentication Required**: All endpoints verify user auth token
2. ✅ **Signature Verification**: Webhook verifies Stripe signature
3. ✅ **Idempotency**: Events processed only once (tracked in `stripe_events` table)
4. ✅ **Service Role Only**: Subscription updates require service_role (RLS enforced)
5. ✅ **Audit Logging**: All subscription events logged to `audit_logs`
6. ⚠️ **CORS**: Currently allows all origins (`*`) - change to your domain in production

### Production Checklist

Before going live:
- [ ] Update CORS to only allow your domain (edit `_shared/cors.ts`)
- [ ] Use production Stripe keys (not test keys)
- [ ] Configure Stripe webhook for production domain
- [ ] Set up monitoring alerts for function errors
- [ ] Test full payment flow end-to-end
- [ ] Verify RLS policies are enabled on all tables
- [ ] Enable Supabase function logs retention (Settings → Logs)

## Next Steps

1. ✅ Edge Functions deployed
2. ⏭️ Update React app to call Edge Functions instead of client-side Stripe
3. ⏭️ Test full checkout flow
4. ⏭️ Set up Sentry error monitoring
5. ⏭️ Add rate limiting to Edge Functions

## Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Documentation](https://deno.land/manual)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
