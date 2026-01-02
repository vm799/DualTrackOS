import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Gift, Zap, Shield, CreditCard, HelpCircle } from 'lucide-react';

const FAQSection = ({ icon: Icon, title, items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Icon className="w-6 h-6 text-purple-400" />
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/70 transition-colors"
            >
              <span className="font-semibold text-gray-100">{item.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-purple-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 border-t border-gray-700 bg-gray-900/50">
                <div className="text-gray-300 space-y-2">{item.answer}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function FAQPage() {
  const navigate = useNavigate();

  const appsumoFAQs = [
    {
      question: 'How do I redeem my AppSumo code?',
      answer: (
        <>
          <p>1. Sign in to DualTrack OS (or create an account)</p>
          <p>2. Go to <a href="/redeem" className="text-purple-400 hover:underline">dualtrack.app/redeem</a></p>
          <p>3. Enter your AppSumo code (format: APPSUMO-XXXX-XXXX)</p>
          <p>4. Select your plan tier (LTD1, LTD2, or LTD3)</p>
          <p>5. Click "Redeem Code" - you'll instantly get lifetime access!</p>
        </>
      ),
    },
    {
      question: "What's included in each AppSumo tier?",
      answer: (
        <div className="space-y-4">
          <div>
            <p className="font-semibold mb-1">LTD Tier 1 - Starter Lifetime ($49)</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Full NDM (Non-Negotiable Daily Minimums) tracking</li>
              <li>Basic cycle tracking with phase recommendations</li>
              <li>Voice diary transcription (100 hours/month)</li>
              <li>1 year of history retention</li>
              <li>Pomodoro timer & task management</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">LTD Tier 2 - Premium Lifetime ($99)</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Everything in Starter +</li>
              <li>AI-powered insights and recommendations</li>
              <li>Advanced cycle tracking with pattern analysis</li>
              <li>Unlimited history retention</li>
              <li>Priority email support</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">LTD Tier 3 - Gold Lifetime ($199)</p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Everything in Premium +</li>
              <li>Wearables integration (when available)</li>
              <li>API access for custom integrations</li>
              <li>VIP support with dedicated channel</li>
              <li>Early access to all new features</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      question: 'Can I upgrade my AppSumo tier later?',
      answer: (
        <>
          <p>Yes! Email us at <a href="mailto:support@dualtrack.app" className="text-purple-400 hover:underline">support@dualtrack.app</a> with:</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Your current AppSumo code</li>
            <li>The tier you want to upgrade to</li>
          </ul>
          <p className="mt-2">We'll provide upgrade pricing (you'll pay the difference between tiers).</p>
        </>
      ),
    },
    {
      question: 'Is this really lifetime access?',
      answer: (
        <>
          <p className="mb-2">
            <strong>Yes, 100% lifetime access.</strong> As long as DualTrack OS exists as a service,
            your account will have full access to your purchased tier.
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>No monthly fees. Ever.</li>
            <li>No expiration date</li>
            <li>All future updates to your tier included</li>
            <li>Non-transferable (tied to your account)</li>
          </ul>
        </>
      ),
    },
    {
      question: 'What if I want a refund?',
      answer: (
        <>
          <p className="mb-2">
            <strong>60-day money-back guarantee</strong> through AppSumo (not through us).
          </p>
          <p>To request a refund:</p>
          <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
            <li>Go to your AppSumo account</li>
            <li>Find your DualTrack OS purchase</li>
            <li>Click "Request Refund" (within 60 days)</li>
          </ol>
          <p className="mt-2 text-sm text-gray-400">
            Note: After 60 days, all AppSumo sales are final.
          </p>
        </>
      ),
    },
    {
      question: 'My code says "already redeemed" - what do I do?',
      answer: (
        <>
          <p className="mb-2">This happens if:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>You already used this code on your account (check Settings → Subscription)</li>
            <li>Someone else redeemed it (code was compromised)</li>
            <li>Typo in the code (check format: APPSUMO-XXXX-XXXX)</li>
          </ul>
          <p className="mt-3">
            If you didn't redeem it, contact AppSumo support immediately - they'll issue a new code.
          </p>
        </>
      ),
    },
  ];

  const technicalFAQs = [
    {
      question: "I can't log in - what should I do?",
      answer: (
        <>
          <p className="mb-2">Try these steps:</p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Clear your browser cache and cookies</li>
            <li>Try incognito/private browsing mode</li>
            <li>Make sure you're using the same Google account</li>
            <li>Check if browser extensions are blocking the login</li>
            <li>Try a different browser</li>
          </ol>
          <p className="mt-3">
            Still stuck? Email <a href="mailto:support@dualtrack.app" className="text-purple-400 hover:underline">support@dualtrack.app</a>
          </p>
        </>
      ),
    },
    {
      question: 'My data disappeared - where did it go?',
      answer: (
        <>
          <p className="mb-2">Common causes:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Wrong account:</strong> Check which Google account you're logged in with</li>
            <li><strong>Cache cleared:</strong> Data syncs from cloud - refresh the page</li>
            <li><strong>Browser issue:</strong> Try a different browser</li>
          </ul>
          <p className="mt-3">
            Your data is safely stored in the cloud. If you still can't see it, contact support.
          </p>
        </>
      ),
    },
    {
      question: 'Does DualTrack OS work on mobile?',
      answer: (
        <>
          <p className="mb-2">
            <strong>Yes!</strong> DualTrack OS is a Progressive Web App (PWA) that works on any device:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>iPhone/iPad:</strong> Open in Safari → Share → "Add to Home Screen"</li>
            <li><strong>Android:</strong> Open in Chrome → Menu → "Install App"</li>
            <li>Works offline after first load</li>
            <li>Syncs automatically when back online</li>
          </ul>
        </>
      ),
    },
    {
      question: 'Is my data private and secure?',
      answer: (
        <>
          <p className="mb-2"><strong>Absolutely.</strong> We take security seriously:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>All data encrypted in transit (HTTPS) and at rest</li>
            <li>Row-level security (you can only see your data)</li>
            <li>No passwords stored (Google OAuth only)</li>
            <li>Regular security audits</li>
            <li>We NEVER sell your data</li>
          </ul>
          <p className="mt-3">
            Read our full <a href="/privacy" className="text-purple-400 hover:underline">Privacy Policy</a>
          </p>
        </>
      ),
    },
    {
      question: 'Can I export my data?',
      answer: (
        <>
          <p className="mb-2">Yes! Your data is always yours.</p>
          <p>To export:</p>
          <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
            <li>Go to Settings → Data & Privacy</li>
            <li>Click "Export Data"</li>
            <li>Download as JSON file</li>
          </ol>
          <p className="mt-3 text-sm text-gray-400">
            You can also request a full data export by emailing support.
          </p>
        </>
      ),
    },
  ];

  const productFAQs = [
    {
      question: 'What makes DualTrack OS different from other wellness apps?',
      answer: (
        <>
          <p className="mb-2"><strong>DualTrack OS is built for women with variable energy.</strong></p>
          <p className="mb-2">Unlike generic productivity apps, we understand:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Your energy fluctuates with your hormonal cycle</li>
            <li>ADHD and neurodivergence affect planning</li>
            <li>Dual careers require flexible systems</li>
            <li>Self-care isn't selfish - it's strategic</li>
          </ul>
          <p className="mt-3">
            We sync productivity with biology, not fight against it.
          </p>
        </>
      ),
    },
    {
      question: 'Do I need to track my cycle manually?',
      answer: (
        <>
          <p className="mb-2">
            <strong>For now, yes.</strong> Quick daily check-ins (30 seconds) give you:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Current cycle phase</li>
            <li>Energy level tracking</li>
            <li>Symptom patterns</li>
            <li>Phase-based recommendations</li>
          </ul>
          <p className="mt-3">
            <strong>Coming soon (Gold tier):</strong> Automatic cycle detection via wearables.
          </p>
        </>
      ),
    },
    {
      question: 'What are "Non-Negotiable Daily Minimums" (NDM)?',
      answer: (
        <>
          <p className="mb-2">
            NDMs are your bare minimum self-care practices that keep you functional, no matter what.
          </p>
          <p className="mb-2">Examples:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Drink 64oz water</li>
            <li>15-minute walk</li>
            <li>Protein with breakfast</li>
            <li>No screens after 10pm</li>
          </ul>
          <p className="mt-3">
            DualTrack OS helps you define and track YOUR minimums, so you never drop below baseline.
          </p>
        </>
      ),
    },
    {
      question: 'Is this app only for women?',
      answer: (
        <>
          <p className="mb-2">
            DualTrack OS is designed primarily for women managing hormonal fluctuations, but
            anyone with variable energy can benefit:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>ADHD folks managing executive function</li>
            <li>Chronic illness warriors</li>
            <li>Burnout recovery</li>
            <li>Shift workers with irregular schedules</li>
          </ul>
          <p className="mt-3">
            If your energy isn't constant, this system will help.
          </p>
        </>
      ),
    },
  ];

  const billingFAQs = [
    {
      question: 'How do I cancel my subscription?',
      answer: (
        <>
          <p className="mb-2">For monthly/annual subscriptions (not AppSumo):</p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Go to Settings → Subscription</li>
            <li>Click "Cancel Subscription"</li>
            <li>Confirm cancellation</li>
          </ol>
          <p className="mt-3">
            You'll keep access until the end of your current billing period.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            <strong>AppSumo lifetime users:</strong> Your access never expires - no cancellation needed!
          </p>
        </>
      ),
    },
    {
      question: 'Can I downgrade from Gold to Premium?',
      answer: (
        <>
          <p>Yes! Email <a href="mailto:support@dualtrack.app" className="text-purple-400 hover:underline">support@dualtrack.app</a> with your request.</p>
          <p className="mt-2">
            You'll get a prorated credit applied to your account balance.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Note: AppSumo lifetime deals cannot be downgraded (they're already one-time purchases).
          </p>
        </>
      ),
    },
    {
      question: 'Do you offer discounts for annual plans?',
      answer: (
        <>
          <p className="mb-2"><strong>Yes!</strong> Annual plans save you 17%:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Starter: $49/year (vs $59.88 monthly)</li>
            <li>Premium: $99/year (vs $119.88 monthly)</li>
            <li>Gold: $199/year (vs $239.88 monthly)</li>
          </ul>
          <p className="mt-3">
            <strong>Best deal:</strong> AppSumo lifetime access (pay once, use forever!)
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-purple-400 hover:text-purple-300 mb-4 flex items-center gap-2 transition-colors"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <HelpCircle className="w-10 h-10" />
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400">Get answers to common questions about DualTrack OS</p>
        </div>

        {/* Quick Links */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-3">Jump to section:</h2>
          <div className="grid grid-cols-2 gap-3">
            <a href="#appsumo" className="text-purple-400 hover:text-purple-300 text-sm">→ AppSumo Redemption</a>
            <a href="#technical" className="text-purple-400 hover:text-purple-300 text-sm">→ Technical Support</a>
            <a href="#product" className="text-purple-400 hover:text-purple-300 text-sm">→ Product Questions</a>
            <a href="#billing" className="text-purple-400 hover:text-purple-300 text-sm">→ Billing & Subscriptions</a>
          </div>
        </div>

        {/* FAQ Sections */}
        <div id="appsumo">
          <FAQSection icon={Gift} title="AppSumo Lifetime Deals" items={appsumoFAQs} />
        </div>

        <div id="technical">
          <FAQSection icon={Zap} title="Technical Support" items={technicalFAQs} />
        </div>

        <div id="product">
          <FAQSection icon={Shield} title="Product Questions" items={productFAQs} />
        </div>

        <div id="billing">
          <FAQSection icon={CreditCard} title="Billing & Subscriptions" items={billingFAQs} />
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
          <p className="text-gray-300 mb-6">
            We're here to help! Reach out and we'll respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@dualtrack.app"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Email Support
            </a>
            <button
              onClick={() => navigate('/redeem')}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Redeem AppSumo Code
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-6 text-sm">
            <button
              onClick={() => navigate('/privacy')}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/terms')}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
