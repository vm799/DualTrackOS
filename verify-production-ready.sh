#!/bin/bash

# DualTrack OS - Production Readiness Verification Script
# This script checks if your app is ready for production deployment
# Run with: bash verify-production-ready.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0
WARN=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}DualTrack OS Production Readiness Check${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to print pass
pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASS++))
}

# Function to print fail
fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAIL++))
}

# Function to print warning
warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARN++))
}

# Function to print info
info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# ===================================
# 1. Environment Files Check
# ===================================
echo -e "\n${BLUE}[1/8] Checking environment files...${NC}"

if [ -f ".env.local" ]; then
    pass ".env.local exists"

    # Check if it has required variables
    if grep -q "REACT_APP_SUPABASE_URL" .env.local; then
        pass "REACT_APP_SUPABASE_URL found in .env.local"
    else
        fail "REACT_APP_SUPABASE_URL missing from .env.local"
    fi

    if grep -q "REACT_APP_SUPABASE_ANON_KEY" .env.local; then
        pass "REACT_APP_SUPABASE_ANON_KEY found in .env.local"
    else
        fail "REACT_APP_SUPABASE_ANON_KEY missing from .env.local"
    fi
else
    fail ".env.local not found"
    info "Create .env.local with your Supabase credentials"
fi

# Check .gitignore
if grep -q ".env" .gitignore 2>/dev/null; then
    pass ".env* in .gitignore (good!)"
else
    fail ".env not in .gitignore - SECURITY RISK!"
fi

# ===================================
# 2. Git Repository Check
# ===================================
echo -e "\n${BLUE}[2/8] Checking git repository...${NC}"

# Check if .env files are committed
if git ls-files 2>/dev/null | grep -q ".env"; then
    fail ".env file is tracked by git - SECURITY RISK!"
    info "Run: git rm --cached .env.local && git commit -m 'Remove .env from git'"
else
    pass "No .env files in git (good!)"
fi

# Check for hardcoded secrets in source code
if grep -r "sk_live_" src/ 2>/dev/null | grep -v node_modules; then
    fail "Found hardcoded Stripe live key in source code - CRITICAL!"
else
    pass "No Stripe live keys in source code"
fi

if grep -r "sk_test_" src/ 2>/dev/null | grep -v node_modules; then
    warn "Found Stripe test key in source code - should be in env vars"
else
    pass "No Stripe test keys in source code"
fi

if grep -r "service_role" src/ 2>/dev/null | grep -v node_modules | grep -v "SUPABASE_SERVICE_ROLE_KEY"; then
    fail "Found service role key in source code - CRITICAL!"
else
    pass "No service role keys in source code"
fi

# ===================================
# 3. Dependencies Check
# ===================================
echo -e "\n${BLUE}[3/8] Checking dependencies...${NC}"

if [ -f "package.json" ]; then
    pass "package.json found"

    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        pass "node_modules exists"
    else
        warn "node_modules not found - run 'npm install'"
    fi

    # Check for known vulnerabilities
    if command -v npm &> /dev/null; then
        info "Checking for vulnerabilities (this may take a minute)..."
        if npm audit --audit-level=high 2>&1 | grep -q "found 0 vulnerabilities"; then
            pass "No high/critical vulnerabilities found"
        else
            warn "Vulnerabilities found - run 'npm audit' to review"
        fi
    fi
else
    fail "package.json not found"
fi

# ===================================
# 4. Build Check
# ===================================
echo -e "\n${BLUE}[4/8] Checking build...${NC}"

if [ -d "build" ]; then
    pass "Build directory exists"

    # Check build size
    BUILD_SIZE=$(du -sh build 2>/dev/null | cut -f1)
    if [ -n "$BUILD_SIZE" ]; then
        info "Build size: $BUILD_SIZE"

        # Warn if build is very large (>10MB compressed)
        BUILD_SIZE_MB=$(du -sm build | cut -f1)
        if [ "$BUILD_SIZE_MB" -gt 10 ]; then
            warn "Build is large (${BUILD_SIZE_MB}MB) - consider code splitting"
        else
            pass "Build size is reasonable"
        fi
    fi
else
    warn "Build directory not found - run 'npm run build' to test production build"
fi

# ===================================
# 5. Documentation Check
# ===================================
echo -e "\n${BLUE}[5/8] Checking documentation...${NC}"

# Check for deployment guides
if [ -f "VERCEL_DEPLOYMENT_GUIDE.md" ]; then
    pass "Vercel deployment guide exists"
else
    warn "VERCEL_DEPLOYMENT_GUIDE.md not found"
fi

if [ -f "EDGE_FUNCTIONS_DEPLOYMENT.md" ]; then
    pass "Edge Functions deployment guide exists"
else
    warn "EDGE_FUNCTIONS_DEPLOYMENT.md not found"
fi

# Check for legal docs
if [ -f "legal/PRIVACY_POLICY.md" ]; then
    pass "Privacy Policy exists"

    # Check if it has placeholders
    if grep -q "\[Your Company Name\]" legal/PRIVACY_POLICY.md 2>/dev/null; then
        warn "Privacy Policy has placeholders - customize before launch"
    else
        pass "Privacy Policy appears customized"
    fi
else
    fail "Privacy Policy missing - LEGAL RISK!"
fi

if [ -f "legal/TERMS_OF_SERVICE.md" ]; then
    pass "Terms of Service exists"

    # Check if it has placeholders
    if grep -q "\[Your Company Name\]" legal/TERMS_OF_SERVICE.md 2>/dev/null; then
        warn "Terms of Service has placeholders - customize before launch"
    else
        pass "Terms of Service appears customized"
    fi
else
    fail "Terms of Service missing - LEGAL RISK!"
fi

# ===================================
# 6. Supabase Check
# ===================================
echo -e "\n${BLUE}[6/8] Checking Supabase configuration...${NC}"

# Check if supabase CLI is installed
if command -v supabase &> /dev/null; then
    pass "Supabase CLI installed"

    # Check if project is linked
    if [ -f ".supabase/config.toml" ]; then
        pass "Supabase project linked"
    else
        warn "Supabase project not linked - run 'supabase link'"
    fi
else
    warn "Supabase CLI not installed - install with: npm install -g supabase"
fi

# Check for migration files
if [ -d "supabase/migrations" ]; then
    MIGRATION_COUNT=$(ls -1 supabase/migrations/*.sql 2>/dev/null | wc -l)
    if [ "$MIGRATION_COUNT" -gt 0 ]; then
        pass "Database migrations exist ($MIGRATION_COUNT files)"
    else
        warn "No migration files found - database may not be set up"
    fi
else
    warn "supabase/migrations directory not found"
fi

# Check for Edge Functions
if [ -d "supabase/functions" ]; then
    if [ -d "supabase/functions/create-checkout-session" ]; then
        pass "create-checkout-session Edge Function exists"
    else
        warn "create-checkout-session function not found"
    fi

    if [ -d "supabase/functions/stripe-webhook" ]; then
        pass "stripe-webhook Edge Function exists"
    else
        warn "stripe-webhook function not found"
    fi
else
    warn "supabase/functions directory not found"
fi

# ===================================
# 7. Vercel Configuration Check
# ===================================
echo -e "\n${BLUE}[7/8] Checking Vercel configuration...${NC}"

if [ -f "vercel.json" ]; then
    pass "vercel.json exists"

    # Check if it has env references
    if grep -q "supabase_url" vercel.json; then
        pass "vercel.json references supabase_url secret"
    else
        warn "vercel.json doesn't reference supabase_url"
    fi

    # Check for security headers
    if grep -q "X-Content-Type-Options" vercel.json; then
        pass "Security headers configured in vercel.json"
    else
        warn "Security headers not found in vercel.json"
    fi
else
    warn "vercel.json not found - create one for Vercel deployment"
fi

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    pass "Vercel CLI installed"
else
    warn "Vercel CLI not installed - install with: npm install -g vercel"
fi

# ===================================
# 8. Testing Check
# ===================================
echo -e "\n${BLUE}[8/8] Checking tests...${NC}"

if [ -d "src/__tests__" ] || [ -d "src/store/__tests__" ]; then
    pass "Test directories exist"

    # Count test files
    TEST_COUNT=$(find src -name "*.test.js" -o -name "*.test.jsx" 2>/dev/null | wc -l)
    if [ "$TEST_COUNT" -gt 0 ]; then
        pass "Found $TEST_COUNT test file(s)"
    else
        warn "No test files found"
    fi
else
    warn "No test directories found"
fi

# Check if jest is configured
if grep -q "\"test\"" package.json 2>/dev/null; then
    pass "Test script configured in package.json"
else
    warn "No test script in package.json"
fi

# ===================================
# Summary
# ===================================
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}========================================${NC}"

TOTAL=$((PASS + FAIL + WARN))
echo -e "Total checks: $TOTAL"
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo -e "${YELLOW}Warnings: $WARN${NC}"

# Calculate percentage
if [ "$TOTAL" -gt 0 ]; then
    PERCENTAGE=$((PASS * 100 / TOTAL))
    echo -e "\nScore: $PERCENTAGE%"

    if [ "$FAIL" -eq 0 ]; then
        if [ "$WARN" -eq 0 ]; then
            echo -e "\n${GREEN}✓ Production ready! All checks passed.${NC}"
            echo -e "${GREEN}You can proceed with deployment.${NC}"
            exit 0
        else
            echo -e "\n${YELLOW}⚠ Almost ready. Fix warnings before public launch.${NC}"
            echo -e "${YELLOW}You can proceed with beta testing.${NC}"
            exit 0
        fi
    else
        echo -e "\n${RED}✗ Not production ready. Fix failed checks before deploying.${NC}"
        echo -e "${RED}Critical issues must be resolved.${NC}"
        exit 1
    fi
fi

# ===================================
# Next Steps
# ===================================
echo -e "\n${BLUE}Next Steps:${NC}"
echo -e "1. Fix any failed checks above"
echo -e "2. Review warnings and address if possible"
echo -e "3. Run 'npm run build' to verify production build"
echo -e "4. Follow deployment guides:"
echo -e "   - VERCEL_DEPLOYMENT_GUIDE.md"
echo -e "   - EDGE_FUNCTIONS_DEPLOYMENT.md"
echo -e "5. Run end-to-end tests (see PRODUCTION_TESTING_PLAN.md)"
echo -e "6. Review SECURITY_AUDIT_CHECKLIST.md"
echo -e "\n${BLUE}For detailed testing: See PRODUCTION_TESTING_PLAN.md${NC}"
echo -e "${BLUE}For security audit: See SECURITY_AUDIT_CHECKLIST.md${NC}"
