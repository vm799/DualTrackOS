// Supabase Edge Function: Stripe Webhook Handler
// Endpoint: POST /functions/v1/stripe-webhook
// Handles all Stripe webhook events

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.11.0?target=deno'

// Initialize Stripe
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

// Initialize Supabase Admin Client (has service_role permissions)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Get raw body for signature verification
    const body = await req.text()

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret!)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response(JSON.stringify({ error: 'Webhook signature verification failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check if we've already processed this event (idempotency)
    const { data: existingEvent } = await supabaseAdmin
      .from('stripe_events')
      .select('id, processed')
      .eq('id', event.id)
      .single()

    if (existingEvent?.processed) {
      console.log(`Event ${event.id} already processed, skipping`)
      return new Response(JSON.stringify({ received: true, skipped: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Store event in database
    await supabaseAdmin
      .from('stripe_events')
      .upsert({
        id: event.id,
        type: event.type,
        data: event.data as any,
        processed: false,
      })

    // Handle the event
    console.log(`Processing event: ${event.type}`)

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
          break

        case 'customer.subscription.created':
          await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
          break

        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
          break

        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
          break

        case 'invoice.paid':
          await handleInvoicePaid(event.data.object as Stripe.Invoice)
          break

        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
          break

        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      // Mark event as processed
      await supabaseAdmin
        .from('stripe_events')
        .update({ processed: true, processed_at: new Date().toISOString() })
        .eq('id', event.id)

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })

    } catch (handlerError) {
      // Log error but don't mark as processed (will retry)
      console.error(`Error handling event ${event.type}:`, handlerError)

      await supabaseAdmin
        .from('stripe_events')
        .update({
          error: handlerError instanceof Error ? handlerError.message : 'Unknown error',
        })
        .eq('id', event.id)

      return new Response(
        JSON.stringify({ error: 'Event processing failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

// ============================================================================
// Event Handlers
// ============================================================================

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id)

  const userId = session.metadata?.supabase_user_id
  if (!userId) {
    console.error('No supabase_user_id in session metadata')
    return
  }

  // Get subscription details from Stripe
  if (session.subscription && typeof session.subscription === 'string') {
    const subscription = await stripe.subscriptions.retrieve(session.subscription)
    await upsertSubscription(userId, subscription)
  }

  // Log audit event
  await supabaseAdmin.rpc('log_audit_event', {
    p_user_id: userId,
    p_event_type: 'checkout.completed',
    p_event_data: {
      session_id: session.id,
      subscription_id: session.subscription,
    },
  })
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id)

  const userId = subscription.metadata?.supabase_user_id
  if (!userId) {
    console.error('No supabase_user_id in subscription metadata')
    return
  }

  await upsertSubscription(userId, subscription)

  // Log audit event
  await supabaseAdmin.rpc('log_audit_event', {
    p_user_id: userId,
    p_event_type: 'subscription.created',
    p_event_data: {
      subscription_id: subscription.id,
      tier: subscription.metadata?.tier,
    },
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id)

  const userId = subscription.metadata?.supabase_user_id
  if (!userId) {
    console.error('No supabase_user_id in subscription metadata')
    return
  }

  await upsertSubscription(userId, subscription)

  // Log audit event
  await supabaseAdmin.rpc('log_audit_event', {
    p_user_id: userId,
    p_event_type: 'subscription.updated',
    p_event_data: {
      subscription_id: subscription.id,
      status: subscription.status,
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id)

  const userId = subscription.metadata?.supabase_user_id
  if (!userId) {
    console.error('No supabase_user_id in subscription metadata')
    return
  }

  // Update subscription to cancelled
  await supabaseAdmin
    .from('subscriptions')
    .update({
      subscription_status: 'cancelled',
      subscription_tier: 'free',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  // Log audit event
  await supabaseAdmin.rpc('log_audit_event', {
    p_user_id: userId,
    p_event_type: 'subscription.deleted',
    p_event_data: {
      subscription_id: subscription.id,
    },
  })
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('Invoice paid:', invoice.id)

  const subscriptionId = invoice.subscription
  if (!subscriptionId || typeof subscriptionId !== 'string') return

  // Update subscription status to active
  await supabaseAdmin
    .from('subscriptions')
    .update({ subscription_status: 'active' })
    .eq('stripe_subscription_id', subscriptionId)
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id)

  const subscriptionId = invoice.subscription
  if (!subscriptionId || typeof subscriptionId !== 'string') return

  // Update subscription status to past_due
  await supabaseAdmin
    .from('subscriptions')
    .update({ subscription_status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId)

  // TODO: Send email notification to user
}

// ============================================================================
// Helper Functions
// ============================================================================

async function upsertSubscription(userId: string, subscription: Stripe.Subscription) {
  const currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString()
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString()

  const trialStart = subscription.trial_start
    ? new Date(subscription.trial_start * 1000).toISOString()
    : null
  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null

  const canceledAt = subscription.canceled_at
    ? new Date(subscription.canceled_at * 1000).toISOString()
    : null

  // Get tier from metadata or default to free
  const tier = subscription.metadata?.tier || 'free'
  const billingPeriod = subscription.metadata?.billingPeriod || 'monthly'

  // Get price information
  const priceId = subscription.items.data[0]?.price.id
  const amountTotal = subscription.items.data[0]?.price.unit_amount || 0
  const currency = subscription.items.data[0]?.price.currency || 'usd'

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      subscription_tier: tier,
      subscription_status: subscription.status,
      billing_period: billingPeriod,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: canceledAt,
      trial_start: trialStart,
      trial_end: trialEnd,
      price_id: priceId,
      amount_total: amountTotal,
      currency: currency,
    }, {
      onConflict: 'user_id',
    })

  if (error) {
    console.error('Error upserting subscription:', error)
    throw error
  }

  console.log(`Subscription upserted for user ${userId}`)
}
