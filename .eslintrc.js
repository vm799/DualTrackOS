module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  // Note: react-hooks plugin is already included in react-app preset
  rules: {
    // CRITICAL: Enforce React Hooks rules as ERRORS (not warnings)
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Additional safety rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
  },
  overrides: [
    {
      // Relax rules for test files (don't block builds)
      files: ['**/__tests__/**/*', '**/*.test.js', '**/*.test.jsx'],
      rules: {
        'testing-library/no-render-in-setup': 'warn', // Don't block builds
      }
    }
  ]
};
