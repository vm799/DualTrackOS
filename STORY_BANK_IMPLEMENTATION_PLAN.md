# Story Bank Feature - PhD-Level Implementation Plan

## Executive Summary
Building a comprehensive Story Bank system for daily story documentation with voice transcription, AI-powered news integration, and structured retrieval capabilities.

---

## 1. Architecture Overview

### Core Components
```
┌─────────────────────────────────────────────────────────────┐
│                     Story Bank System                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Voice UI   │  │  Text Editor │  │  AI News     │      │
│  │  Component   │  │  Component   │  │  Fetcher     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         └──────────────────┴──────────────────┘              │
│                            │                                  │
│                  ┌─────────▼─────────┐                       │
│                  │  Story Service    │                       │
│                  │  (Business Logic) │                       │
│                  └─────────┬─────────┘                       │
│                            │                                  │
│         ┌──────────────────┼──────────────────┐             │
│         │                  │                  │              │
│  ┌──────▼───────┐  ┌──────▼──────┐  ┌───────▼──────┐      │
│  │  Zustand     │  │  IndexedDB  │  │  Supabase    │      │
│  │  Store       │  │  (Local)    │  │  (Cloud)     │      │
│  └──────────────┘  └─────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Web Speech  │  │  OpenAI      │  │  News API    │      │
│  │  API         │  │  Whisper API │  │  Integration │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema Design

### IndexedDB Schema (Local-First)
```javascript
// Store: stories
{
  id: string (UUID),
  userId: string,

  // Story Structure (5W1H)
  title: string,
  who: string[],           // Characters involved
  what: string,            // What happened
  where: string,           // Location/setting
  when: string,            // Time/date context
  why: string,             // Purpose/motivation
  how: string,             // How it unfolded
  dialogue: object[],      // Structured dialogue

  // Metadata
  storyDate: Date,         // Date story happened
  createdAt: Date,
  updatedAt: Date,

  // Rich Content
  tags: string[],
  mood: string,            // emotional tone
  category: string,        // personal, work, family, etc.

  // Voice
  audioBlob: Blob,         // original recording
  audioUrl: string,        // object URL
  transcriptionSource: 'web-speech' | 'whisper',

  // AI Enhancement
  aiSummary: string,       // AI-generated summary
  speakingTips: string[],  // AI-generated speaking tips

  // Organization
  isFavorite: boolean,
  isArchived: boolean,

  // Sync
  syncedToCloud: boolean,
  cloudId: string
}

// Store: newsStories
{
  id: string (UUID),

  // News Content
  title: string,
  summary: string,
  fullText: string,
  sourceUrl: string,
  source: string,          // publisher name

  // AI/Tech Focus
  category: 'ai' | 'tech' | 'business' | 'general',
  topics: string[],        // extracted topics

  // User Notes
  userNotes: string,       // personal commentary
  speakingAngle: string,   // how to use in presentations

  // Metadata
  publishedAt: Date,
  savedAt: Date,

  // Organization
  isFavorite: boolean,
  tags: string[]
}
```

### Supabase Schema (Cloud Backup & Sync)
```sql
-- Table: stories
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- Story Structure
  title TEXT NOT NULL,
  who JSONB DEFAULT '[]',
  what TEXT,
  where_location TEXT,
  when_context TEXT,
  why TEXT,
  how TEXT,
  dialogue JSONB DEFAULT '[]',

  -- Metadata
  story_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Rich Content
  tags TEXT[] DEFAULT '{}',
  mood TEXT,
  category TEXT,

  -- Voice
  audio_url TEXT,
  transcription_source TEXT,

  -- AI Enhancement
  ai_summary TEXT,
  speaking_tips JSONB DEFAULT '[]',

  -- Organization
  is_favorite BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,

  -- Indexes
  CONSTRAINT stories_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_story_date ON stories(story_date DESC);
CREATE INDEX idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX idx_stories_tags ON stories USING GIN(tags);

-- Table: news_stories
CREATE TABLE news_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  title TEXT NOT NULL,
  summary TEXT,
  full_text TEXT,
  source_url TEXT,
  source TEXT,

  category TEXT,
  topics TEXT[] DEFAULT '{}',

  user_notes TEXT,
  speaking_angle TEXT,

  published_at TIMESTAMPTZ,
  saved_at TIMESTAMPTZ DEFAULT NOW(),

  is_favorite BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',

  CONSTRAINT news_stories_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_news_user_id ON news_stories(user_id);
CREATE INDEX idx_news_published_at ON news_stories(published_at DESC);
```

---

## 3. Voice Transcription Strategy

### Tier 1: Web Speech API (Free, Real-time)
- **Pros**: Free, real-time, works offline
- **Cons**: Browser-dependent, accuracy varies
- **Use Case**: Default option for quick entries

### Tier 2: OpenAI Whisper API (Premium)
- **Pros**: High accuracy, multiple languages, punctuation
- **Cons**: Costs ~$0.006/minute, requires upload
- **Use Case**: Premium tier for high-quality transcription

### Implementation
```javascript
class VoiceTranscriptionService {
  constructor() {
    this.webSpeechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  // Real-time Web Speech API
  startWebSpeech(onTranscript, onFinal) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');

      if (event.results[event.results.length - 1].isFinal) {
        onFinal(transcript);
      } else {
        onTranscript(transcript);
      }
    };

    recognition.start();
    return recognition;
  }

  // OpenAI Whisper API (Premium)
  async transcribeWithWhisper(audioBlob) {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      },
      body: formData
    });

    const data = await response.json();
    return data.text;
  }
}
```

---

## 4. AI News Integration

### News Sources
1. **News API** (newsapi.org) - Free tier: 100 requests/day
2. **Google News RSS** - Free, unlimited
3. **HackerNews API** - Free, tech-focused
4. **OpenAI GPT-4** - Summarization & topic extraction

### News Fetching Strategy
```javascript
class NewsService {
  async fetchAINews() {
    // Fetch from multiple sources
    const sources = await Promise.all([
      this.fetchNewsAPI('artificial intelligence'),
      this.fetchHackerNews('ai'),
      this.fetchGoogleNews('AI technology')
    ]);

    // Deduplicate and rank
    const articles = this.deduplicateAndRank(sources.flat());

    // AI-enhance top 5
    const enhanced = await Promise.all(
      articles.slice(0, 5).map(article => this.enhanceWithAI(article))
    );

    return enhanced;
  }

  async enhanceWithAI(article) {
    const prompt = `
      Analyze this news article and provide:
      1. A 2-sentence summary
      2. Key speaking points (3-5 bullet points)
      3. A unique angle for presentations

      Article: ${article.title}
      ${article.content}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    return {
      ...article,
      aiSummary: response.choices[0].message.content,
      enhancedAt: new Date()
    };
  }
}
```

---

## 5. Implementation Roadmap

### Phase 1: Foundation (Week 1)
**Goal**: Basic story entry and storage

**Tasks**:
1. Create Zustand store for Story Bank
2. Implement IndexedDB wrapper
3. Build basic Story Editor component
4. Add manual 5W1H input fields
5. Local storage and retrieval

**Deliverables**:
- Users can create and save stories locally
- Basic CRUD operations
- No breaking changes to existing features

### Phase 2: Voice Integration (Week 2)
**Goal**: Voice input with Web Speech API

**Tasks**:
1. Build VoiceRecorder component
2. Integrate Web Speech API
3. Auto-populate fields from transcript
4. Add audio playback
5. Implement voice-to-text fallback

**Deliverables**:
- Voice recording and transcription
- Real-time transcript display
- Audio storage in IndexedDB

### Phase 3: AI News Integration (Week 3)
**Goal**: Daily AI/tech news curation

**Tasks**:
1. Implement News API integration
2. Build news fetching service
3. Create NewsStoryCard component
4. Add daily news digest
5. Implement save-to-story-bank

**Deliverables**:
- Daily AI news feed
- Save news stories for reference
- Tag and categorize news

### Phase 4: Cloud Sync (Week 4)
**Goal**: Supabase backup and multi-device sync

**Tasks**:
1. Set up Supabase tables
2. Implement sync service
3. Handle conflict resolution
4. Add cloud backup toggle
5. Migration from local to cloud

**Deliverables**:
- Cloud backup of all stories
- Cross-device synchronization
- Offline-first architecture

### Phase 5: AI Enhancement (Week 5)
**Goal**: AI-powered insights and tips

**Tasks**:
1. Integrate OpenAI GPT-4
2. Generate story summaries
3. Extract speaking tips
4. Improve storytelling suggestions
5. Add Whisper API (premium)

**Deliverables**:
- AI-generated summaries
- Speaking coach tips
- Premium transcription option

### Phase 6: Analytics & Search (Week 6)
**Goal**: Powerful search and insights

**Tasks**:
1. Build full-text search
2. Implement tag-based filtering
3. Create story analytics dashboard
4. Add progress tracking (365-day goal)
5. Export capabilities (PDF, JSON)

**Deliverables**:
- Fast search across all stories
- Visual progress tracking
- Export and backup options

---

## 6. Component Architecture

### File Structure
```
src/
├── pages/
│   └── StoryBankPage.jsx              # Main story bank page
│
├── components/
│   ├── StoryBank/
│   │   ├── StoryEditor.jsx            # 5W1H structured editor
│   │   ├── VoiceRecorder.jsx          # Voice recording UI
│   │   ├── StoryCard.jsx              # Story display card
│   │   ├── StoryList.jsx              # List/grid view
│   │   ├── StorySearch.jsx            # Search and filters
│   │   ├── NewsDigest.jsx             # Daily news section
│   │   ├── NewsStoryCard.jsx          # News display
│   │   ├── StoryAnalytics.jsx         # Progress & insights
│   │   └── DialogueEditor.jsx         # Dialogue input
│   │
│   └── shared/
│       ├── AudioPlayer.jsx            # Playback component
│       └── TagEditor.jsx              # Tag management
│
├── store/
│   ├── useStoryBankStore.js           # Story bank state
│   └── useNewsStore.js                # News state
│
├── services/
│   ├── storyService.js                # Story CRUD
│   ├── voiceService.js                # Voice transcription
│   ├── newsService.js                 # News fetching
│   ├── syncService.js                 # Cloud sync
│   └── aiService.js                   # AI enhancements
│
├── db/
│   ├── indexedDB.js                   # IndexedDB wrapper
│   └── migrations.js                  # DB migrations
│
└── utils/
    ├── storyParser.js                 # Parse voice to 5W1H
    ├── dateUtils.js                   # Date formatting
    └── exportUtils.js                 # Export stories
```

---

## 7. Integration Points (No Breaking Changes)

### Safe Integration Strategy

1. **New Route**: `/story-bank` (doesn't affect existing routes)
2. **New Store**: `useStoryBankStore` (isolated from existing stores)
3. **New Database**: `storybank` IndexedDB (separate from existing data)
4. **Optional Feature**: Behind feature flag if needed
5. **Bottom Navigation**: Add as new icon (non-intrusive)

### Feature Flag (Optional Safety)
```javascript
// constants/features.js
export const FEATURES = {
  STORY_BANK: true,  // Toggle on/off
  STORY_BANK_VOICE: true,
  STORY_BANK_AI_NEWS: true,
  STORY_BANK_CLOUD_SYNC: false  // Enable after testing
};
```

---

## 8. Technology Stack

### Core Technologies
- **Frontend**: React 18 with TypeScript (optional)
- **State**: Zustand (consistent with app)
- **Local DB**: IndexedDB via Dexie.js
- **Cloud DB**: Supabase
- **Voice**: Web Speech API + OpenAI Whisper
- **AI**: OpenAI GPT-4 Turbo
- **News**: News API + HackerNews API
- **Audio**: MediaRecorder API

### Dependencies to Add
```json
{
  "dexie": "^3.2.4",
  "dexie-react-hooks": "^1.1.7",
  "@supabase/supabase-js": "^2.39.0",
  "openai": "^4.24.1",
  "date-fns": "^3.0.6",
  "react-markdown": "^9.0.1",
  "fuse.js": "^7.0.0"
}
```

---

## 9. Risk Mitigation

### Potential Risks & Solutions

| Risk | Impact | Mitigation |
|------|--------|------------|
| Voice API browser incompatibility | High | Fallback to text input, graceful degradation |
| IndexedDB quota exceeded | Medium | Implement pagination, cloud sync, data compression |
| API rate limits (News, OpenAI) | Medium | Caching, request throttling, free tier management |
| Breaking existing features | High | Isolated modules, feature flags, thorough testing |
| Poor voice transcription accuracy | Medium | Manual editing, Whisper API upgrade path |
| Data loss | High | Auto-save, cloud backup, export options |

---

## 10. Success Metrics

### User Engagement
- Stories created per user per week
- Voice recording adoption rate
- News stories saved per week
- Return rate to story bank

### Technical Performance
- Voice transcription accuracy (>85%)
- Page load time (<2s)
- Search response time (<100ms)
- Sync success rate (>99%)

### Business Goals
- Reach 365 stories in 1 year (1 per day)
- Premium upgrade rate (Whisper API)
- Feature satisfaction score (>4.5/5)

---

## 11. Next Steps

1. **Review & Approve**: Review this plan with stakeholders
2. **Environment Setup**: Configure API keys, Supabase project
3. **Phase 1 Sprint**: Start with basic story editor (Week 1)
4. **Daily Standups**: Track progress, adjust plan
5. **User Testing**: Beta test with 5-10 users per phase
6. **Iterate**: Gather feedback and refine

---

## Appendix: Code Examples

### A. Zustand Store Example
```javascript
// store/useStoryBankStore.js
import create from 'zustand';
import { persist } from 'zustand/middleware';

const useStoryBankStore = create(
  persist(
    (set, get) => ({
      stories: [],
      newsStories: [],
      currentStory: null,
      filters: {
        category: 'all',
        dateRange: 'all',
        tags: []
      },

      // Story Actions
      addStory: (story) => set((state) => ({
        stories: [story, ...state.stories]
      })),

      updateStory: (id, updates) => set((state) => ({
        stories: state.stories.map(s =>
          s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s
        )
      })),

      deleteStory: (id) => set((state) => ({
        stories: state.stories.filter(s => s.id !== id)
      })),

      // Search
      searchStories: (query) => {
        const stories = get().stories;
        return stories.filter(s =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.what.toLowerCase().includes(query.toLowerCase())
        );
      },

      // Progress
      getProgress: () => {
        const stories = get().stories;
        const thisYear = new Date().getFullYear();
        const thisYearStories = stories.filter(s =>
          new Date(s.storyDate).getFullYear() === thisYear
        );
        return {
          total: thisYearStories.length,
          target: 365,
          percentage: (thisYearStories.length / 365) * 100
        };
      }
    }),
    {
      name: 'story-bank-storage',
      version: 1
    }
  )
);

export default useStoryBankStore;
```

### B. Voice Recorder Component Example
```javascript
// components/StoryBank/VoiceRecorder.jsx
import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';

const VoiceRecorder = ({ onTranscript, onAudioSaved }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorder = useRef(null);
  const recognition = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    // Start audio recording
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' });
      onAudioSaved(blob);
      chunks.current = [];
    };

    mediaRecorder.current.start();

    // Start transcription
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;

    recognition.current.onresult = (event) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;

      if (event.results[current].isFinal) {
        setTranscript(prev => prev + transcriptText + ' ');
        onTranscript(transcript + transcriptText);
      }
    };

    recognition.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    recognition.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="voice-recorder">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`btn-voice ${isRecording ? 'recording' : ''}`}
      >
        {isRecording ? <Square /> : <Mic />}
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {transcript && (
        <div className="transcript-preview">
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
```

---

**END OF IMPLEMENTATION PLAN**
