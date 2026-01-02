// Supabase Edge Function: Redeem AppSumo Code
// Endpoint: POST /functions/v1/redeem-appsumo-code
// Activates lifetime subscription based on AppSumo redemption code

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders, handleCors } from '../_shared/cors.ts'

interface RedeemRequest {
  code: string
  planId: 'appsumo_ltd1' | 'appsumo_ltd2' | 'appsumo_ltd3'
}

// Map AppSumo plan IDs to subscription tiers
const PLAN_TIER_MAP = {
  'appsumo_ltd1': 'starter',   // $49 - Starter lifetime
  'appsumo_ltd2': 'premium',   // $99 - Premium lifetime
  'appsumo_ltd3': 'gold',      // $199 - Gold lifetime
}

serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  // Get CORS headers for this request's origin
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized - Please sign in first' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Initialize Supabase client with user's auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const requestBody: RedeemRequest = await req.json()
    const { code, planId } = requestBody

    // Validate inputs
    if (!code || !planId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: code and planId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate code format (AppSumo codes: APPSUMO-XXXX-XXXX)
    const codeUpper = code.toUpperCase().trim()
    if (!codeUpper.match(/^APPSUMO-[A-Z0-9]{4}-[A-Z0-9]{4}$/)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid code format',
          details: 'Code must be in format: APPSUMO-XXXX-XXXX',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate plan ID
    const tier = PLAN_TIER_MAP[planId]
    if (!tier) {
      return new Response(
        JSON.stringify({
          error: 'Invalid plan ID',
          details: `Plan must be one of: ${Object.keys(PLAN_TIER_MAP).join(', ')}`,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use service role client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if code has already been redeemed
    const { data: existingCode, error: checkError } = await supabaseAdmin
      .from('subscriptions')
      .select('id, user_id, subscription_tier, is_lifetime')
      .eq('appsumo_code', codeUpper)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking code:', checkError)
      return new Response(
        JSON.stringify({ error: 'Database error while validating code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (existingCode) {
      const isCurrentUser = existingCode.user_id === user.id
      return new Response(
        JSON.stringify({
          error: 'Code already redeemed',
          details: isCurrentUser
            ? 'You have already redeemed this code'
            : 'This code has been redeemed by another user',
          redeemedBy: isCurrentUser ? 'you' : 'another user',
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user already has a lifetime subscription
    const { data: existingSub } = await supabaseAdmin
      .from('subscriptions')
      .select('subscription_tier, is_lifetime, appsumo_code')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingSub?.is_lifetime) {
      return new Response(
        JSON.stringify({
          error: 'Account already has lifetime access',
          details: `You already have ${existingSub.subscription_tier} lifetime access`,
          existingTier: existingSub.subscription_tier,
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create/update subscription with lifetime access
    const now = new Date().toISOString()
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .upsert(
        {
          user_id: user.id,
          subscription_tier: tier,
          subscription_status: 'active',
          is_lifetime: true,
          appsumo_code: codeUpper,
          appsumo_plan_id: planId,
          billing_period: 'lifetime',
          current_period_start: now,
          current_period_end: null, // Lifetime = no expiration
          cancel_at_period_end: false,
          updated_at: now,
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single()

    if (subError) {
      console.error('Error creating subscription:', subError)
      return new Response(
        JSON.stringify({
          error: 'Failed to activate subscription',
          details: subError.message,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log audit event
    try {
      await supabaseAdmin.rpc('log_audit_event', {
        p_user_id: user.id,
        p_event_type: 'appsumo_code_redeemed',
        p_event_data: {
          code: codeUpper,
          planId,
          tier,
          subscriptionId: subscription.id,
          email: user.email,
        },
      })
    } catch (auditError) {
      // Log but don't fail the request
      console.error('Failed to log audit event:', auditError)
    }

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully activated ${tier} lifetime access!`,
        subscription: {
          tier,
          status: 'active',
          isLifetime: true,
          planId,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  } catch (error) {
    console.error('Unexpected error in redeem-appsumo-code:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
