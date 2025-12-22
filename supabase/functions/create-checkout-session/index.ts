// Supabase Edge Function: Create Stripe Checkout Session
// Endpoint: POST /functions/v1/create-checkout-session

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.11.0?target=deno'
import { corsHeaders, handleCors } from '../_shared/cors.ts'

// Initialize Stripe
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

// Stripe Price IDs from environment
const PRICE_IDS = {
  starter: {
    monthly: Deno.env.get('STRIPE_STARTER_MONTHLY_PRICE_ID'),
    annual: Deno.env.get('STRIPE_STARTER_ANNUAL_PRICE_ID'),
  },
  premium: {
    monthly: Deno.env.get('STRIPE_PREMIUM_MONTHLY_PRICE_ID'),
    annual: Deno.env.get('STRIPE_PREMIUM_ANNUAL_PRICE_ID'),
  },
  gold: {
    monthly: Deno.env.get('STRIPE_GOLD_MONTHLY_PRICE_ID'),
    annual: Deno.env.get('STRIPE_GOLD_ANNUAL_PRICE_ID'),
  },
}

interface CheckoutRequest {
  tier: 'starter' | 'premium' | 'gold'
  billingPeriod: 'monthly' | 'annual'
  successUrl?: string
  cancelUrl?: string
}

serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Initialize Supabase client with user's auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Get authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Parse request body
    const requestBody: CheckoutRequest = await req.json()
    const { tier, billingPeriod, successUrl, cancelUrl } = requestBody

    // Validate inputs
    if (!tier || !billingPeriod) {
      return new Response(JSON.stringify({ error: 'Missing required fields: tier, billingPeriod' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!['starter', 'premium', 'gold'].includes(tier)) {
      return new Response(JSON.stringify({ error: 'Invalid tier' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!['monthly', 'annual'].includes(billingPeriod)) {
      return new Response(JSON.stringify({ error: 'Invalid billing period' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get price ID
    const priceId = PRICE_IDS[tier]?.[billingPeriod]
    if (!priceId) {
      return new Response(JSON.stringify({ error: 'Price ID not configured for this tier/period' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Check if user already has a Stripe customer ID
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: existingSubscription } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = existingSubscription?.stripe_customer_id

    // Create or retrieve Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID to database
      await supabaseAdmin
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          subscription_tier: 'free',
          subscription_status: 'active',
        })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${req.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}&upgrade_success=true`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/pricing?upgrade_cancelled=true`,
      metadata: {
        supabase_user_id: user.id,
        tier,
        billingPeriod,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          tier,
          billingPeriod,
        },
      },
    })

    // Log audit event
    await supabaseAdmin.rpc('log_audit_event', {
      p_user_id: user.id,
      p_event_type: 'checkout.session.created',
      p_event_data: {
        tier,
        billingPeriod,
        session_id: session.id,
      },
    })

    // Return session URL
    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error creating checkout session:', error)

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
