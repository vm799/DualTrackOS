# DualTrack OS

**The operating system for busy professionals running dual careers without burning out.**

## 🎯 What It Does

DualTrack OS helps you:
- Track your Non-Negotiable Daily Minimums (NDM)
- Manage dual careers (corporate + consultancy/side business)
- Monitor health vitals and prevent burnout
- Optimize exercise and wellness routines
- Track nutrition with blood sugar stability
- Get AI-powered insights on your patterns
- Receive adaptive recommendations based on energy and mood
- Grow your personal spirit animal avatar as you practice self-care

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables (Optional - for Supabase/Stripe features)

**IMPORTANT: Never commit `.env` or `.env.local` files to git!**

Create a `.env.local` file in the root directory:
```bash
# Copy the example file
cp .env.example .env.local
```

Then edit `.env.local` with your actual API keys:
```bash
# Supabase Configuration
# Get these from: https://app.supabase.com/project/YOUR_PROJECT/settings/api
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-actual-anon-key-here

# Stripe Configuration
# Get these from: https://dashboard.stripe.com/apikeys
REACT_APP_STRIPE_STARTER_PAYMENT_LINK=https://buy.stripe.com/your-actual-link
```

**Security Notes:**
- ✅ `.env.local` is in `.gitignore` and will never be committed
- ✅ `.env.example` contains placeholder values (safe to commit)
- ❌ Never commit real API keys or secrets to git
- ❌ Never share your `.env.local` file

### 3. Start Development Server
```bash
npm start
```

### 4. Build for Production
```bash
npm run build
```

### 5. Deploy to Vercel
```bash
npm run deploy
```

## 📱 Features

### Dashboard
- Real-time daily score (0-100)
- Streak tracking for motivation
- Energy level monitoring
- Burnout alert system (green/yellow/red)
- Apple Health integration
- Voice check-ins with AI transcription

### Exercise Library
- HIIT workouts optimized for hormonal health
- Live workout timer with audio cues
- Strength training circuits
- Recovery yoga
- Completion tracking

### Nutrition Tracking
- Quick meal logging with photo upload
- Protein tracking (personalized to your weight)
- Pre-made meal templates
- Blood sugar optimization tips

### Health & Wellness Intelligence
- Energy and mood tracking (3x daily)
- Smart suggestions based on energy + mood combinations
- Adaptive recommendations for your current state
- Pattern detection and prediction
- Spirit animal avatar that grows with your self-care

### Weekly Intelligence
- Pattern detection (energy, sleep, productivity)
- AI coaching insights
- Burnout risk assessment
- Progress tracking across all domains

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Lucide React (icons)
- Tailwind CSS (styling via CDN)
- LocalStorage (data persistence)
- Supabase (authentication + cloud sync)
- Stripe (payments via payment links)

**Future:**
- OpenAI API (AI coaching)
- Supabase PostgreSQL (advanced queries)
- React Native (mobile apps)
- Real-time notifications

## 📊 Project Structure
```
dualtrack-os/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.jsx              # Main app component
│   ├── index.js
│   └── index.css
├── docs/
│   ├── ARCHITECTURE.md
│   ├── BUSINESS-PLAN.md
│   └── LAUNCH-GUIDE.md
├── package.json
└── README.md
```

## 🎯 Roadmap

**Phase 1: MVP (Current)**
- ✅ Core dashboard with spirit animal
- ✅ NDM tracking with actionable modals
- ✅ Exercise library
- ✅ Food logging with photo upload
- ✅ Energy + mood intelligence
- ✅ Smart suggestions engine
- ✅ Weekly insights
- ✅ Data persistence

**Phase 2: Backend (Weeks 2-4)**
- ✅ User authentication (Supabase Google OAuth)
- ✅ Cloud data sync (Supabase)
- ✅ Payment integration (Stripe)
- [ ] Real AI coaching
- [ ] Apple Health API integration
- [ ] Google Fit integration

**Phase 3: Mobile Apps (Weeks 5-8)**
- [ ] Convert to React Native
- [ ] iOS App Store submission
- [ ] Android Play Store submission
- [ ] Push notifications
- [ ] HealthKit/Google Fit native integration

**Phase 4: Monetization (Month 3)**
- [ ] Free tier (basic tracking)
- [ ] Premium tier ($9.99/mo)
- [ ] Pro tier ($29.99/mo)
- [ ] Enterprise white-label

## 💰 Business Model

**Target Market:**
- Busy professionals managing dual careers
- Corporate leaders building side businesses
- ADHD/neurodivergent high-performers
- Health-conscious individuals seeking work-life balance
- Professionals navigating career transitions and health changes

**Revenue Streams:**
1. Consumer subscriptions (B2C) - $19/month Starter plan
2. Corporate wellness programs (B2B)
3. Coaching certification program
4. API licensing

## 🤝 Contributing

This is currently a solo founder project. Contributions welcome after MVP launch.

## �� License

Proprietary - All rights reserved

## ��‍💻 About the Founder

Built by a busy professional who's:
- Head of Solution Design at a major financial institution
- Building an AI automation consultancy
- Managing ADHD
- Refusing to burn out
- Living proof the system works

## �� Contact

- Website: https://dualtrack.app (coming soon)
- LinkedIn: [Your LinkedIn]
- Email: [Your Email]

---

**You're not failing at work-life balance. The system is broken. Let's build a better one.**
