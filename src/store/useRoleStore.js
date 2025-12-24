import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Role Management Store
 *
 * Allows users to define and track the roles they manage
 * No assumptions - each user customizes to their reality
 */
const useRoleStore = create(
  persist(
    (set, get) => ({
      // State
      userRoles: [], // Array of role objects: { id, name, emoji, taskCount }
      showRoleSetup: false,
      hasCompletedRoleSetup: false,

      // Default role suggestions (user can customize)
      defaultRoles: [
        { id: 'executive', name: 'Executive/Leadership', emoji: '💼', suggested: true },
        { id: 'team-mgmt', name: 'Team Management', emoji: '👥', suggested: true },
        { id: 'household', name: 'Household Management', emoji: '🏠', suggested: true },
        { id: 'caregiver', name: 'Caregiver', emoji: '💝', suggested: true },
        { id: 'relationship', name: 'Partner/Relationship', emoji: '💑', suggested: true },
        { id: 'side-business', name: 'Side Business', emoji: '🚀', suggested: true },
        { id: 'creative', name: 'Creative Work', emoji: '🎨', suggested: true },
        { id: 'community', name: 'Community Leadership', emoji: '🌟', suggested: true },
        { id: 'self-care', name: 'Self-Care', emoji: '💆', suggested: true },
      ],

      // Actions
      setShowRoleSetup: (show) => set({ showRoleSetup: show }),

      setUserRoles: (roles) => set({ userRoles: roles }),

      addRole: (role) => set((state) => ({
        userRoles: [...state.userRoles, { ...role, taskCount: 0 }]
      })),

      removeRole: (roleId) => set((state) => ({
        userRoles: state.userRoles.filter(r => r.id !== roleId)
      })),

      updateRoleTaskCount: (roleId, count) => set((state) => ({
        userRoles: state.userRoles.map(role =>
          role.id === roleId ? { ...role, taskCount: count } : role
        )
      })),

      incrementRoleTaskCount: (roleId) => set((state) => ({
        userRoles: state.userRoles.map(role =>
          role.id === roleId ? { ...role, taskCount: (role.taskCount || 0) + 1 } : role
        )
      })),

      completeRoleSetup: () => set({ hasCompletedRoleSetup: true, showRoleSetup: false }),

      // Get total mental load
      getTotalMentalLoad: () => {
        const state = get();
        return state.userRoles.reduce((sum, role) => sum + (role.taskCount || 0), 0);
      },

      // Get self-care percentage
      getSelfCarePercentage: () => {
        const state = get();
        const totalTasks = state.getTotalMentalLoad();
        if (totalTasks === 0) return 0;

        const selfCareRole = state.userRoles.find(r => r.id === 'self-care');
        const selfCareTasks = selfCareRole?.taskCount || 0;

        return Math.round((selfCareTasks / totalTasks) * 100);
      },

      // Check if self-care is neglected
      isSelfCareNeglected: () => {
        const state = get();
        return state.getSelfCarePercentage() < 10 && state.getTotalMentalLoad() > 5;
      },

      // Reset all task counts (e.g., at end of day)
      resetAllTaskCounts: () => set((state) => ({
        userRoles: state.userRoles.map(role => ({ ...role, taskCount: 0 }))
      })),
    }),
    {
      name: 'role-storage', // localStorage key
      partialPersist: (state) => ({
        userRoles: state.userRoles,
        hasCompletedRoleSetup: state.hasCompletedRoleSetup,
      }),
    }
  )
);

export default useRoleStore;
