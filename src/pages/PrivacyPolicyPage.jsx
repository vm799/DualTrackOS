import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, Server, Trash2, Download } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: January 2, 2026</p>
        </div>

        {/* Quick Summary */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Quick Summary
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li>✅ We only collect data necessary to run the service</li>
            <li>✅ Your health data is encrypted and never sold</li>
            <li>✅ You can export or delete your data anytime</li>
            <li>✅ We use Google OAuth for secure authentication</li>
            <li>✅ We use cookies only for essential features and analytics</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6" />
              1. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">Information You Provide</h3>
            <p className="text-gray-300 mb-4">
              When you use DualTrack OS, you voluntarily provide:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li><strong>Account Information:</strong> Email address, name (via Google OAuth)</li>
              <li><strong>Health Data:</strong> Cycle tracking, energy levels, mood, symptoms</li>
              <li><strong>Activity Data:</strong> Exercise logs, nutrition tracking, daily check-ins</li>
              <li><strong>Voice Recordings:</strong> Voice diary entries (stored encrypted)</li>
              <li><strong>Preference Data:</strong> App settings, notification preferences</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Information Collected Automatically</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent (via Google Analytics)</li>
              <li><strong>Device Information:</strong> Browser type, operating system, screen resolution</li>
              <li><strong>Error Logs:</strong> Technical errors and crash reports (via Sentry)</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Server className="w-6 h-6" />
              2. How We Use Your Information
            </h2>
            <p className="text-gray-300 mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Provide and improve the DualTrack OS service</li>
              <li>Sync your data across devices</li>
              <li>Generate personalized insights and recommendations</li>
              <li>Process payments and manage subscriptions (via Stripe)</li>
              <li>Send important service updates and notifications</li>
              <li>Analyze app usage to improve features</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6" />
              3. How We Protect Your Information
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li><strong>Encryption:</strong> All data is encrypted in transit (HTTPS) and at rest</li>
              <li><strong>Row Level Security:</strong> Database access is restricted to your own data</li>
              <li><strong>Secure Authentication:</strong> OAuth 2.0 via Google (no passwords stored)</li>
              <li><strong>Regular Security Audits:</strong> Ongoing monitoring for vulnerabilities</li>
              <li><strong>Limited Access:</strong> Only authorized personnel can access infrastructure</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. Third-Party Services</h2>
            <p className="text-gray-300 mb-4">
              We use trusted third-party services to operate DualTrack OS:
            </p>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Supabase (Database & Auth)</h4>
                <p className="text-sm text-gray-400">Stores your encrypted data. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Privacy Policy</a></p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Stripe (Payments)</h4>
                <p className="text-sm text-gray-400">Processes payments securely. We never see your credit card. <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Privacy Policy</a></p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Google Analytics</h4>
                <p className="text-sm text-gray-400">Tracks anonymous usage data. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Privacy Policy</a></p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Sentry (Error Tracking)</h4>
                <p className="text-sm text-gray-400">Monitors technical errors. PII is masked. <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Privacy Policy</a></p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">5. Cookies and Tracking</h2>
            <p className="text-gray-300 mb-4">We use cookies for:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li><strong>Essential Cookies:</strong> Authentication, session management (required)</li>
              <li><strong>Analytics Cookies:</strong> Google Analytics for usage tracking (optional)</li>
              <li><strong>Preference Cookies:</strong> Remember your settings (optional)</li>
            </ul>
            <p className="text-gray-300">
              You can control cookie preferences via our cookie consent banner or browser settings.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Download className="w-6 h-6" />
              6. Your Data Rights
            </h2>
            <p className="text-gray-300 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li><strong>Access:</strong> Request a copy of your data (Settings → Export Data)</li>
              <li><strong>Rectification:</strong> Update or correct your information</li>
              <li><strong>Deletion:</strong> Delete your account and all data (Settings → Delete Account)</li>
              <li><strong>Portability:</strong> Export your data in JSON format</li>
              <li><strong>Withdraw Consent:</strong> Opt out of analytics or marketing</li>
              <li><strong>Object:</strong> Object to certain data processing</li>
            </ul>
            <p className="text-gray-300">
              To exercise these rights, email us at <a href="mailto:privacy@dualtrack.app" className="text-purple-400 hover:underline">privacy@dualtrack.app</a>
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Trash2 className="w-6 h-6" />
              7. Data Retention
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>We retain your data as long as your account is active</li>
              <li>After account deletion, data is permanently erased within 30 days</li>
              <li>Backup copies are purged within 90 days</li>
              <li>Legal/compliance data may be retained longer if required by law</li>
              <li>Anonymous analytics data may be retained indefinitely</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
            <p className="text-gray-300 mb-4">
              DualTrack OS is not intended for users under 18. We do not knowingly collect
              data from children. If you believe a child has provided us information, contact
              us immediately at <a href="mailto:privacy@dualtrack.app" className="text-purple-400 hover:underline">privacy@dualtrack.app</a>
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
            <p className="text-gray-300 mb-4">
              Your data may be processed in the United States or other countries where our
              service providers operate. We ensure appropriate safeguards are in place
              (e.g., Standard Contractual Clauses for EU data).
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-300 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of
              material changes via email or in-app notification. Your continued use after
              changes constitutes acceptance.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              For privacy-related questions or concerns:
            </p>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-300">
                <strong>Email:</strong> <a href="mailto:privacy@dualtrack.app" className="text-purple-400 hover:underline">privacy@dualtrack.app</a><br />
                <strong>Support:</strong> <a href="mailto:support@dualtrack.app" className="text-purple-400 hover:underline">support@dualtrack.app</a>
              </p>
            </div>
          </section>

          {/* GDPR/CCPA */}
          <section className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">GDPR & CCPA Compliance</h2>
            <p className="text-gray-300 mb-4">
              <strong>For EU/EEA Residents (GDPR):</strong> You have enhanced rights including
              data portability, erasure, and restriction of processing. We are the data controller.
            </p>
            <p className="text-gray-300">
              <strong>For California Residents (CCPA):</strong> We do not sell your personal
              information. You have the right to opt-out of sale and request disclosure of
              data collection practices.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm mb-4">
            This privacy policy was last updated on January 2, 2026
          </p>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => navigate('/terms')}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Terms of Service
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
