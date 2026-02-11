import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CreditCard, UserX } from 'lucide-react';

export default function TermsOfServicePage() {
  const navigate = useNavigate();

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
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-gray-400">Last updated: January 2, 2026</p>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Important Notice
          </h2>
          <p className="text-gray-300">
            By accessing or using DualTrack OS, you agree to be bound by these Terms of Service
            and our Privacy Policy. If you do not agree, please do not use our service.
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 mb-4">
              These Terms of Service ("Terms") govern your access to and use of DualTrack OS
              (the "Service"), a web application provided by DualTrack ("we," "us," or "our").
            </p>
            <p className="text-gray-300 mb-4">
              By creating an account, you represent that you are:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>At least 18 years old</li>
              <li>Capable of entering into a binding contract</li>
              <li>Not prohibited from using the Service under applicable law</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-gray-300 mb-4">
              DualTrack OS is a personal operating system for managing:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Hormonal health and menstrual cycle tracking</li>
              <li>Energy and mood intelligence</li>
              <li>Productivity and task management</li>
              <li>Health and wellness tracking</li>
              <li>AI-powered insights and recommendations</li>
            </ul>
            <p className="text-gray-300">
              We reserve the right to modify, suspend, or discontinue any feature at any time
              without prior notice.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">3. Account Registration</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>You must create an account using Google OAuth</li>
              <li>You are responsible for maintaining account security</li>
              <li>You must provide accurate and complete information</li>
              <li>One person may not maintain multiple free accounts</li>
              <li>You must notify us immediately of any unauthorized access</li>
            </ul>
            <p className="text-gray-300">
              We reserve the right to refuse service or terminate accounts at our discretion.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              4. Subscription Plans & Billing
            </h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">Plan Tiers</h3>
            <div className="space-y-3 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold mb-1">Free Tier</h4>
                <p className="text-sm text-gray-400">Basic features, 7-day history, limited access</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold mb-1">Starter ($4.99/month or $49/year)</h4>
                <p className="text-sm text-gray-400">Full NDM tracking, cycle tracking, voice transcription</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold mb-1">Premium ($9.99/month or $99/year)</h4>
                <p className="text-sm text-gray-400">AI insights, advanced analytics, unlimited history</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold mb-1">Gold ($19.99/month or $199/year)</h4>
                <p className="text-sm text-gray-400">Wearables integration, API access, VIP support</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">Billing Terms</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Subscriptions are billed in advance on a monthly or annual basis</li>
              <li>Payments are processed securely through Stripe</li>
              <li>All fees are in USD unless otherwise stated</li>
              <li>Prices may change with 30 days notice</li>
              <li>No refunds for partial months (see Refund Policy below)</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">AppSumo Lifetime Deals</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Lifetime deals purchased via AppSumo grant permanent access to the specified tier</li>
              <li>Lifetime access is valid as long as DualTrack OS operates</li>
              <li>Lifetime users receive all standard features of their tier</li>
              <li>New premium features may require tier upgrades</li>
              <li>Lifetime deals are non-transferable and non-refundable after 60 days</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Automatic Renewal</h3>
            <p className="text-gray-300 mb-4">
              Subscriptions automatically renew unless cancelled before the renewal date.
              You can cancel anytime from Settings → Subscription.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Refund Policy</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li><strong>30-Day Money Back Guarantee:</strong> Full refund within 30 days of first purchase</li>
              <li><strong>AppSumo Purchases:</strong> 60-day refund period through AppSumo</li>
              <li><strong>Renewals:</strong> No refunds for automatic renewals (cancel before renewal date)</li>
              <li><strong>Downgrades:</strong> Prorated credits applied to account balance</li>
            </ul>
            <p className="text-gray-300">
              To request a refund, email <a href="mailto:support@dualtrack.app" className="text-purple-400 hover:underline">support@dualtrack.app</a> with your account email.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">5. Acceptable Use</h2>
            <p className="text-gray-300 mb-4">You agree NOT to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malware, viruses, or harmful code</li>
              <li>Attempt unauthorized access to our systems</li>
              <li>Scrape, harvest, or collect user data</li>
              <li>Reverse engineer or decompile the Service</li>
              <li>Resell or redistribute the Service</li>
              <li>Use the Service for illegal or fraudulent purposes</li>
              <li>Impersonate others or misrepresent affiliation</li>
            </ul>
            <p className="text-gray-300">
              Violation may result in immediate account termination and legal action.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
            <p className="text-gray-300 mb-4">
              <strong>Our Rights:</strong> All content, features, and functionality of DualTrack OS
              (including but not limited to software, text, graphics, logos, and trademarks) are
              owned by us and protected by copyright, trademark, and other laws.
            </p>
            <p className="text-gray-300 mb-4">
              <strong>Your Content:</strong> You retain ownership of all data you input into
              DualTrack OS. By using the Service, you grant us a limited license to store,
              process, and display your content solely to provide the Service.
            </p>
            <p className="text-gray-300">
              <strong>License to Use:</strong> We grant you a limited, non-exclusive,
              non-transferable license to use the Service for personal, non-commercial purposes.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">7. Medical Disclaimer</h2>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                <strong>DualTrack OS is NOT medical advice.</strong>
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>The Service is for informational and wellness purposes only</li>
                <li>Content is not a substitute for professional medical advice</li>
                <li>Always consult a healthcare provider for medical concerns</li>
                <li>Do not disregard medical advice based on app insights</li>
                <li>In case of emergency, call 911 or local emergency services</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND</li>
              <li>WE ARE NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES</li>
              <li>OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID IN THE PAST 12 MONTHS</li>
              <li>WE ARE NOT RESPONSIBLE FOR DATA LOSS (maintain your own backups)</li>
              <li>WE DO NOT GUARANTEE UNINTERRUPTED OR ERROR-FREE SERVICE</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">9. Indemnification</h2>
            <p className="text-gray-300 mb-4">
              You agree to indemnify and hold harmless DualTrack OS, its affiliates, and
              employees from any claims, damages, or expenses arising from:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Your violation of these Terms</li>
              <li>Your violation of any law or regulation</li>
              <li>Your infringement of third-party rights</li>
              <li>Your use or misuse of the Service</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <UserX className="w-6 h-6" />
              10. Termination
            </h2>
            <p className="text-gray-300 mb-4">
              <strong>By You:</strong> You may cancel your subscription or delete your account
              anytime from Settings. Cancellation stops future billing but does not refund
              the current period.
            </p>
            <p className="text-gray-300 mb-4">
              <strong>By Us:</strong> We may suspend or terminate your account immediately if you:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Violate these Terms</li>
              <li>Engage in fraudulent activity</li>
              <li>Fail to pay subscription fees</li>
              <li>Abuse the Service or other users</li>
            </ul>
            <p className="text-gray-300">
              Upon termination, your right to use the Service ceases immediately. You may
              export your data before deletion (30-day grace period).
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
            <p className="text-gray-300 mb-4">
              We may update these Terms from time to time. We will notify you of material
              changes via email or in-app notification at least 30 days before they take effect.
            </p>
            <p className="text-gray-300">
              Your continued use of the Service after changes constitutes acceptance of the
              new Terms.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">12. Dispute Resolution</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">Informal Resolution</h3>
            <p className="text-gray-300 mb-4">
              Before filing a legal claim, please contact us at{' '}
              <a href="mailto:legal@dualtrack.app" className="text-purple-400 hover:underline">legal@dualtrack.app</a>{' '}
              to resolve the issue informally.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Arbitration Agreement</h3>
            <p className="text-gray-300 mb-4">
              Any disputes arising from these Terms or the Service shall be resolved through
              binding arbitration rather than in court, except you may assert claims in small
              claims court.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Class Action Waiver</h3>
            <p className="text-gray-300">
              You agree to bring claims only in your individual capacity, not as part of a
              class action or representative proceeding.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
            <p className="text-gray-300 mb-4">
              These Terms are governed by the laws of the United States and the State of
              [YOUR STATE], without regard to conflict of law principles.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">14. Severability</h2>
            <p className="text-gray-300">
              If any provision of these Terms is found unenforceable, the remaining provisions
              will continue in full force and effect.
            </p>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">15. Contact Information</h2>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <p className="text-gray-300 mb-2">
                <strong>General Support:</strong>{' '}
                <a href="mailto:support@dualtrack.app" className="text-purple-400 hover:underline">support@dualtrack.app</a>
              </p>
              <p className="text-gray-300 mb-2">
                <strong>Legal Inquiries:</strong>{' '}
                <a href="mailto:legal@dualtrack.app" className="text-purple-400 hover:underline">legal@dualtrack.app</a>
              </p>
              <p className="text-gray-300">
                <strong>Privacy Concerns:</strong>{' '}
                <a href="mailto:privacy@dualtrack.app" className="text-purple-400 hover:underline">privacy@dualtrack.app</a>
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm mb-4">
            These terms were last updated on January 2, 2026
          </p>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => navigate('/privacy')}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
