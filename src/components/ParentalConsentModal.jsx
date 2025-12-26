import React from 'react';
import { AlertTriangle, X, Check, ArrowLeft } from 'lucide-react';

/**
 * ParentalConsentModal
 *
 * Displayed when user enters age < 18
 * Requires parental consent acknowledgment before continuing
 */
const ParentalConsentModal = ({ darkMode, onConsent, onGoBack }) => {
  const handleConsent = () => {
    localStorage.setItem('dualtrack-parental-consent-given', 'true');
    onConsent();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className={`relative max-w-md w-full mx-4 p-6 rounded-2xl shadow-2xl ${
        darkMode ? 'bg-gray-800 border-2 border-orange-500/30' : 'bg-white border-2 border-orange-300'
      }`}>
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-full ${
            darkMode ? 'bg-orange-500/20' : 'bg-orange-100'
          }`}>
            <AlertTriangle size={40} className="text-orange-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className={`text-2xl font-bold text-center mb-3 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Parental Consent Required
        </h2>

        {/* Message */}
        <div className={`space-y-3 mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <p className="text-center">
            DualTrack OS is designed for adults and contains health tracking features.
          </p>
          <p className="text-center font-medium">
            If you're under 18, please get parental or guardian consent before continuing.
          </p>
        </div>

        {/* Important Notice */}
        <div className={`p-4 rounded-lg mb-6 ${
          darkMode ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'
        }`}>
          <p className={`text-sm ${darkMode ? 'text-orange-200' : 'text-orange-800'}`}>
            <strong>Note:</strong> This app tracks nutrition, movement, and mindfulness data.
            Please ensure a parent or guardian is aware you're using this app.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleConsent}
            className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Check size={20} />
            I have parental consent
          </button>

          <button
            onClick={onGoBack}
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <ArrowLeft size={20} />
            Go back
          </button>
        </div>

        {/* Footer note */}
        <p className={`text-xs text-center mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          By clicking "I have parental consent", you confirm that a parent or guardian is aware of your use of this app.
        </p>
      </div>
    </div>
  );
};

export default ParentalConsentModal;
