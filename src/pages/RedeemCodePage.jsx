import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../services/dataService';

export default function RedeemCodePage() {
  const [code, setCode] = useState('');
  const [planId, setPlanId] = useState('appsumo_ltd1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const subscription = useStore((state) => state.subscription);

  const handleRedeem = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get auth token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setError('Please sign in first');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      // Call redemption endpoint
      const response = await fetch(
        `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/redeem-appsumo-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            code: code.toUpperCase().trim(),
            planId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to redeem code');
      }

      // Success!
      setSuccess(true);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard?appsumo_success=true');
        // Force reload to refresh subscription state
        window.location.reload();
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCode = (value) => {
    // Auto-format as user types: APPSUMO-XXXX-XXXX
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (cleaned.length === 0) return '';
    if (cleaned.length <= 7) return cleaned;
    if (cleaned.length <= 11) {
      return `${cleaned.slice(0, 7)}-${cleaned.slice(7)}`;
    }
    return `${cleaned.slice(0, 7)}-${cleaned.slice(7, 11)}-${cleaned.slice(11, 15)}`;
  };

  const handleCodeChange = (e) => {
    const formatted = formatCode(e.target.value);
    setCode(formatted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center p-4">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full border border-purple-500/30">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Redeem AppSumo Code
          </h1>
          <p className="text-gray-400">
            Enter your AppSumo code to activate your lifetime deal
          </p>
        </div>

        {success ? (
          <div className="bg-green-900/50 border border-green-500 rounded-xl p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-200 mb-2">
              Code Redeemed Successfully!
            </h3>
            <p className="text-green-300 text-sm">
              Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleRedeem} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                AppSumo Code
              </label>
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="APPSUMO-XXXX-XXXX"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono tracking-wider text-center text-lg"
                required
                maxLength={19}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: APPSUMO-XXXX-XXXX
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Plan Tier
              </label>
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="appsumo_ltd1">Tier 1 - Starter Lifetime ($49)</option>
                <option value="appsumo_ltd2">Tier 2 - Premium Lifetime ($99)</option>
                <option value="appsumo_ltd3">Tier 3 - Gold Lifetime ($199)</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-200 font-semibold text-sm mb-1">
                    Redemption Failed
                  </h4>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !code.match(/^APPSUMO-[A-Z0-9]{4}-[A-Z0-9]{4}$/)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redeeming Code...
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5" />
                  Redeem Code
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-400">
              Don't have an AppSumo code?
            </p>
            <a
              href="https://appsumo.com/products/dualtrack"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            >
              Get your lifetime deal on AppSumo →
            </a>
          </div>

          {subscription && subscription.subscription_tier !== 'free' && (
            <div className="mt-4 bg-blue-900/30 border border-blue-500/50 rounded-lg p-3 text-center">
              <p className="text-blue-300 text-sm">
                Current plan: <span className="font-semibold capitalize">{subscription.subscription_tier}</span>
                {subscription.is_lifetime && ' (Lifetime)'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
