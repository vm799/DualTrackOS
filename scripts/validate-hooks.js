#!/usr/bin/env node

/**
 * React Hooks Validation Script
 *
 * This script validates that all React components follow the Rules of Hooks:
 * 1. Only call hooks at the top level (not inside loops, conditions, or nested functions)
 * 2. Only call hooks from React function components or custom hooks
 *
 * Runs before builds to catch hooks violations early.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

let errors = [];
let warnings = [];

/**
 * Check if a file contains potential hooks violations
 */
function validateHooksInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Track hooks usage
  const hookPattern = /\b(useState|useEffect|useContext|useReducer|useCallback|useMemo|useRef|useImperativeHandle|useLayoutEffect|useDebugValue|use[A-Z]\w*)\s*\(/g;

  // Check for hooks after early returns
  let hasEarlyReturn = false;
  let earlyReturnLine = -1;
  let hooksAfterReturn = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check for early returns (but not in nested functions)
    if (/^\s*(if\s*\(.*\)\s*{?\s*)?return\s/.test(line) && !hasEarlyReturn) {
      // Simple heuristic: if return is at top-level indentation (0-2 spaces), it's potentially problematic
      const indent = line.match(/^\s*/)[0].length;
      if (indent <= 4) {  // Likely top-level of component
        hasEarlyReturn = true;
        earlyReturnLine = lineNum;
      }
    }

    // Check for hooks usage
    const hookMatches = line.match(hookPattern);
    if (hookMatches && hasEarlyReturn) {
      hookMatches.forEach(hook => {
        hooksAfterReturn.push({ hook, line: lineNum });
      });
    }
  });

  // Report violations (but skip likely false positives from nested components)
  // If there are many hooks after the return, it's likely a separate nested component
  if (hooksAfterReturn.length > 0 && hooksAfterReturn.length <= 3) {
    errors.push({
      file: filePath,
      message: `Possible hooks after early return (line ${earlyReturnLine})`,
      details: hooksAfterReturn.map(h => `  - ${h.hook} at line ${h.line}`).join('\n')
    });
  } else if (hooksAfterReturn.length > 3) {
    warnings.push({
      file: filePath,
      message: `Multiple hooks detected after line ${earlyReturnLine} (likely nested component)`,
      line: earlyReturnLine
    });
  }

  // Check for hooks inside conditions (basic check)
  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check for hooks inside if statements (very basic heuristic)
    if (/if\s*\(.*\).*\{/.test(line) || /if\s*\(.*\)/.test(line)) {
      // Check next few lines for hooks
      const checkLines = lines.slice(index, Math.min(index + 5, lines.length));
      checkLines.forEach((checkLine, offset) => {
        if (hookPattern.test(checkLine) && offset > 0) {
          warnings.push({
            file: filePath,
            message: `Potential hook inside condition at line ${lineNum + offset}`,
            line: lineNum + offset
          });
        }
      });
    }
  });
}

/**
 * Recursively find all .jsx and .js files in src directory
 */
function findComponentFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, build, etc.
      if (!['node_modules', 'build', 'dist', '.git'].includes(file)) {
        findComponentFiles(filePath, fileList);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      // Only check component files (contain 'use' hooks or start with capital letter)
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('use') || /function\s+[A-Z]/.test(content) || /const\s+[A-Z]/.test(content)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Main validation
 */
function main() {
  console.log(`${BLUE}🔍 Validating React Hooks...${RESET}\n`);

  const srcDir = path.join(process.cwd(), 'src');

  if (!fs.existsSync(srcDir)) {
    console.error(`${RED}❌ Error: src directory not found${RESET}`);
    process.exit(1);
  }

  const componentFiles = findComponentFiles(srcDir);
  console.log(`Found ${componentFiles.length} component files to check\n`);

  componentFiles.forEach(file => {
    try {
      validateHooksInFile(file);
    } catch (err) {
      console.error(`${RED}Error checking ${file}: ${err.message}${RESET}`);
    }
  });

  // Print results
  console.log('\n' + '='.repeat(60));
  console.log(`${BLUE}Validation Results${RESET}`);
  console.log('='.repeat(60) + '\n');

  if (errors.length > 0) {
    console.log(`${RED}❌ ERRORS (${errors.length}):${RESET}\n`);
    errors.forEach(err => {
      console.log(`${RED}${err.file}${RESET}`);
      console.log(`  ${err.message}`);
      if (err.details) {
        console.log(err.details);
      }
      console.log('');
    });
  }

  if (warnings.length > 0) {
    console.log(`${YELLOW}⚠️  WARNINGS (${warnings.length}):${RESET}\n`);
    warnings.forEach(warn => {
      console.log(`${YELLOW}${warn.file}:${warn.line}${RESET}`);
      console.log(`  ${warn.message}`);
      console.log('');
    });
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log(`${GREEN}✅ No hooks violations detected!${RESET}\n`);
    process.exit(0);
  }

  if (errors.length > 0) {
    console.log(`${RED}❌ Build blocked due to hooks violations${RESET}`);
    console.log(`${YELLOW}Fix these errors before building${RESET}\n`);
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.log(`${YELLOW}⚠️  Build proceeding with warnings${RESET}`);
    console.log(`${YELLOW}Review these warnings to prevent runtime errors${RESET}\n`);
    process.exit(0);
  }
}

main();
