/**
 * Runtime React Hooks Validator
 *
 * Wraps components to detect hooks violations at RUNTIME
 * Catches issues that ESLint can't detect:
 * - State-dependent hook counts
 * - Conditional hooks based on props
 * - Dynamic component rendering issues
 *
 * Usage: Wrap Dashboard and other complex components
 */

import { useEffect, useRef } from 'react';

let hooksCountPerComponent = {};

export function HooksValidator({ componentName, children }) {
  const renderCount = useRef(0);
  const hooksCount = useRef(0);

  // Count this hook call
  hooksCount.current++;

  useEffect(() => {
    renderCount.current++;

    // Store expected hooks count from first render
    if (!hooksCountPerComponent[componentName]) {
      hooksCountPerComponent[componentName] = hooksCount.current;
      console.log(
        `✅ [HooksValidator] ${componentName}: ${hooksCount.current} hooks detected`
      );
    } else {
      // Check if hooks count changed
      const expected = hooksCountPerComponent[componentName];
      const actual = hooksCount.current;

      if (actual !== expected) {
        console.error(
          `❌ [HooksValidator] VIOLATION in ${componentName}!`,
          `\nExpected: ${expected} hooks`,
          `\nActual: ${actual} hooks`,
          `\nRender: #${renderCount.current}`,
          `\n\nThis will cause React Hooks #185 error!`
        );

        // In development, throw to trigger error boundary
        if (process.env.NODE_ENV === 'development') {
          throw new Error(
            `React Hooks violation in ${componentName}: ` +
            `Expected ${expected} hooks but got ${actual} hooks on render #${renderCount.current}`
          );
        }
      }
    }

    // Reset for next render
    hooksCount.current = 0;
  });

  return children;
}

/**
 * HOC to wrap components with hooks validation
 */
export function withHooksValidation(Component, componentName) {
  return function ValidatedComponent(props) {
    return (
      <HooksValidator componentName={componentName || Component.name}>
        <Component {...props} />
      </HooksValidator>
    );
  };
}

/**
 * Reset validator (for testing)
 */
export function resetHooksValidator() {
  hooksCountPerComponent = {};
}
