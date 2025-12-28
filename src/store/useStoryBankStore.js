import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Story Bank Store
 *
 * Manages personal stories and daily news for storytelling practice
 * Following Vin Scully's methodology: Document 1 story/day using 5W1H framework
 *
 * Features:
 * - Personal story bank (365 stories/year goal)
 * - Daily AI/tech news curation
 * - Voice transcription support
 * - Search and filtering
 * - Progress tracking
 */
const useStoryBankStore = create(
  persist(
    (set, get) => ({
      // ========================================
      // STATE
      // ========================================

      // Personal Stories
      stories: [],
      currentStory: null,

      // News Stories
      newsStories: [],
      lastNewsFetch: null,

      // UI State
      filters: {
        category: 'all',        // all, personal, work, family, etc.
        dateRange: 'all',       // all, today, week, month, year
        tags: [],
        searchQuery: ''
      },

      viewMode: 'grid',         // grid, list, timeline
      sortBy: 'date-desc',      // date-desc, date-asc, title

      // Progress
      yearlyGoal: 365,

      // ========================================
      // STORY ACTIONS
      // ========================================

      /**
       * Add a new story to the bank
       */
      addStory: (story) => {
        const newStory = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          syncedToCloud: false,
          isFavorite: false,
          isArchived: false,
          tags: [],
          ...story
        };

        set((state) => ({
          stories: [newStory, ...state.stories],
          currentStory: newStory
        }));

        return newStory;
      },

      /**
       * Update an existing story
       */
      updateStory: (id, updates) => {
        set((state) => ({
          stories: state.stories.map(story =>
            story.id === id
              ? { ...story, ...updates, updatedAt: new Date().toISOString() }
              : story
          ),
          currentStory: state.currentStory?.id === id
            ? { ...state.currentStory, ...updates }
            : state.currentStory
        }));
      },

      /**
       * Delete a story
       */
      deleteStory: (id) => {
        set((state) => ({
          stories: state.stories.filter(story => story.id !== id),
          currentStory: state.currentStory?.id === id ? null : state.currentStory
        }));
      },

      /**
       * Set current story being edited
       */
      setCurrentStory: (story) => set({ currentStory: story }),

      /**
       * Toggle favorite status
       */
      toggleFavorite: (id) => {
        set((state) => ({
          stories: state.stories.map(story =>
            story.id === id
              ? { ...story, isFavorite: !story.isFavorite }
              : story
          )
        }));
      },

      /**
       * Archive/unarchive story
       */
      toggleArchive: (id) => {
        set((state) => ({
          stories: state.stories.map(story =>
            story.id === id
              ? { ...story, isArchived: !story.isArchived }
              : story
          )
        }));
      },

      // ========================================
      // NEWS ACTIONS
      // ========================================

      /**
       * Add news stories
       */
      addNewsStories: (newsStories) => {
        const newStories = newsStories.map(story => ({
          id: crypto.randomUUID(),
          savedAt: new Date().toISOString(),
          isFavorite: false,
          tags: [],
          ...story
        }));

        set((state) => ({
          newsStories: [...newStories, ...state.newsStories],
          lastNewsFetch: new Date().toISOString()
        }));
      },

      /**
       * Save a news story to personal story bank
       */
      saveNewsAsStory: (newsId) => {
        const newsStory = get().newsStories.find(n => n.id === newsId);
        if (!newsStory) return;

        const story = {
          title: newsStory.title,
          what: newsStory.summary,
          who: [],
          where: 'News',
          when: newsStory.publishedAt,
          why: newsStory.speakingAngle || '',
          how: '',
          dialogue: [],
          category: 'news',
          tags: ['news', 'ai', ...newsStory.topics || []],
          storyDate: new Date().toISOString(),
          sourceUrl: newsStory.sourceUrl
        };

        return get().addStory(story);
      },

      /**
       * Delete news story
       */
      deleteNewsStory: (id) => {
        set((state) => ({
          newsStories: state.newsStories.filter(news => news.id !== id)
        }));
      },

      // ========================================
      // SEARCH & FILTER
      // ========================================

      /**
       * Set search query
       */
      setSearchQuery: (query) => {
        set((state) => ({
          filters: { ...state.filters, searchQuery: query }
        }));
      },

      /**
       * Set filters
       */
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters }
        }));
      },

      /**
       * Clear all filters
       */
      clearFilters: () => {
        set({
          filters: {
            category: 'all',
            dateRange: 'all',
            tags: [],
            searchQuery: ''
          }
        });
      },

      /**
       * Get filtered stories
       */
      getFilteredStories: () => {
        const { stories, filters, sortBy } = get();
        let filtered = [...stories];

        // Filter by archived
        filtered = filtered.filter(s => !s.isArchived);

        // Filter by category
        if (filters.category !== 'all') {
          filtered = filtered.filter(s => s.category === filters.category);
        }

        // Filter by tags
        if (filters.tags.length > 0) {
          filtered = filtered.filter(s =>
            filters.tags.some(tag => s.tags?.includes(tag))
          );
        }

        // Filter by date range
        if (filters.dateRange !== 'all') {
          const now = new Date();
          const ranges = {
            today: 1,
            week: 7,
            month: 30,
            year: 365
          };

          const daysAgo = ranges[filters.dateRange];
          if (daysAgo) {
            const cutoff = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(s =>
              new Date(s.createdAt) >= cutoff
            );
          }
        }

        // Filter by search query
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(s =>
            s.title?.toLowerCase().includes(query) ||
            s.what?.toLowerCase().includes(query) ||
            s.who?.some(person => person.toLowerCase().includes(query)) ||
            s.tags?.some(tag => tag.toLowerCase().includes(query))
          );
        }

        // Sort
        filtered.sort((a, b) => {
          switch (sortBy) {
            case 'date-desc':
              return new Date(b.storyDate || b.createdAt) - new Date(a.storyDate || a.createdAt);
            case 'date-asc':
              return new Date(a.storyDate || a.createdAt) - new Date(b.storyDate || b.createdAt);
            case 'title':
              return (a.title || '').localeCompare(b.title || '');
            default:
              return 0;
          }
        });

        return filtered;
      },

      /**
       * Search stories (full-text)
       */
      searchStories: (query) => {
        const stories = get().stories;
        const lowerQuery = query.toLowerCase();

        return stories.filter(s =>
          s.title?.toLowerCase().includes(lowerQuery) ||
          s.what?.toLowerCase().includes(lowerQuery) ||
          s.where?.toLowerCase().includes(lowerQuery) ||
          s.why?.toLowerCase().includes(lowerQuery) ||
          s.how?.toLowerCase().includes(lowerQuery) ||
          s.who?.some(person => person.toLowerCase().includes(lowerQuery)) ||
          s.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
          s.dialogue?.some(d => d.text?.toLowerCase().includes(lowerQuery))
        );
      },

      // ========================================
      // ANALYTICS & PROGRESS
      // ========================================

      /**
       * Get yearly progress toward 365-story goal
       */
      getYearlyProgress: () => {
        const { stories, yearlyGoal } = get();
        const currentYear = new Date().getFullYear();

        const thisYearStories = stories.filter(s => {
          const storyYear = new Date(s.storyDate || s.createdAt).getFullYear();
          return storyYear === currentYear && !s.isArchived;
        });

        return {
          count: thisYearStories.length,
          target: yearlyGoal,
          percentage: Math.round((thisYearStories.length / yearlyGoal) * 100),
          remaining: yearlyGoal - thisYearStories.length,
          daysElapsed: Math.floor((new Date() - new Date(currentYear, 0, 1)) / (1000 * 60 * 60 * 24)),
          daysRemaining: Math.floor((new Date(currentYear, 11, 31) - new Date()) / (1000 * 60 * 60 * 24)),
          onTrack: thisYearStories.length >= Math.floor((Date.now() - new Date(currentYear, 0, 1)) / (1000 * 60 * 60 * 24))
        };
      },

      /**
       * Get story statistics
       */
      getStats: () => {
        const { stories } = get();

        // Category breakdown
        const categoryCount = {};
        stories.forEach(s => {
          const cat = s.category || 'uncategorized';
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });

        // Tag cloud
        const tagCount = {};
        stories.forEach(s => {
          s.tags?.forEach(tag => {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          });
        });

        // Monthly breakdown
        const monthlyCount = {};
        stories.forEach(s => {
          const month = new Date(s.storyDate || s.createdAt).toISOString().slice(0, 7);
          monthlyCount[month] = (monthlyCount[month] || 0) + 1;
        });

        return {
          total: stories.length,
          favorites: stories.filter(s => s.isFavorite).length,
          archived: stories.filter(s => s.isArchived).length,
          withVoice: stories.filter(s => s.audioUrl).length,
          categories: categoryCount,
          tags: tagCount,
          byMonth: monthlyCount,
          averagePerWeek: stories.length / Math.max(1, Math.floor((Date.now() - new Date(stories[stories.length - 1]?.createdAt || Date.now())) / (1000 * 60 * 60 * 24 * 7)))
        };
      },

      /**
       * Get all unique tags
       */
      getAllTags: () => {
        const { stories } = get();
        const allTags = new Set();

        stories.forEach(s => {
          s.tags?.forEach(tag => allTags.add(tag));
        });

        return Array.from(allTags).sort();
      },

      /**
       * Get all unique categories
       */
      getAllCategories: () => {
        const { stories } = get();
        const categories = new Set();

        stories.forEach(s => {
          if (s.category) categories.add(s.category);
        });

        return Array.from(categories).sort();
      },

      // ========================================
      // UI ACTIONS
      // ========================================

      setViewMode: (mode) => set({ viewMode: mode }),
      setSortBy: (sortBy) => set({ sortBy }),

      // ========================================
      // UTILITY
      // ========================================

      /**
       * Export all stories as JSON
       */
      exportStories: () => {
        const { stories } = get();
        const data = {
          exportDate: new Date().toISOString(),
          version: '1.0',
          storiesCount: stories.length,
          stories: stories
        };

        return JSON.stringify(data, null, 2);
      },

      /**
       * Import stories from JSON
       */
      importStories: (jsonString) => {
        try {
          const data = JSON.parse(jsonString);
          const imported = data.stories || [];

          set((state) => ({
            stories: [...state.stories, ...imported]
          }));

          return { success: true, count: imported.length };
        } catch (error) {
          console.error('Import failed:', error);
          return { success: false, error: error.message };
        }
      }
    }),
    {
      name: 'story-bank-storage',
      version: 1,
      // Only persist stories, not UI state
      partialize: (state) => ({
        stories: state.stories,
        newsStories: state.newsStories,
        lastNewsFetch: state.lastNewsFetch,
        yearlyGoal: state.yearlyGoal
      })
    }
  )
);

export default useStoryBankStore;
