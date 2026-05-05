import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ViewType, SubjectProgress, SubjectStatus, UserRole, StudySession, Achievement, WeeklyGoal } from "./types";

interface AppState {
  // Navigation
  currentView: ViewType;
  selectedSubjectId: string | null;
  selectedSemester: 1 | 2;

  // User
  userName: string;
  userRole: UserRole;
  hasOnboarded: boolean;

  // Progress
  progress: SubjectProgress[];
  subjectNotes: Record<string, string>;

  // Study Sessions
  studySessions: StudySession[];

  // Achievements
  achievements: Achievement[];

  // Search
  searchQuery: string;
  searchCategory: string;

  // Weekly Goals
  weeklyGoals: WeeklyGoal[];

  // Countdowns
  countdowns: Array<{id: string; title: string; targetDate: string; createdAt: string}>;

  // Notifications
  notifications: Array<{id: string; type: 'study_reminder' | 'achievement' | 'streak_warning'; title: string; message: string; read: boolean; createdAt: string}>;

  // UI
  sidebarOpen: boolean;
  theme: "light" | "dark";
  chatOpen: boolean;
  favorites: string[];
  favoriteQuotes: number[];

  // Actions
  setView: (view: ViewType) => void;
  selectSubject: (id: string) => void;
  setSelectedSemester: (semester: 1 | 2) => void;
  setUserName: (name: string) => void;
  setUserRole: (role: UserRole) => void;
  completeOnboarding: () => void;
  updateProgress: (subjectId: string, status: SubjectStatus, progress: number) => void;
  setSubjectNotes: (subjectId: string, notes: string) => void;
  addStudySession: (session: StudySession) => void;
  removeStudySession: (id: string) => void;
  toggleStudySession: (id: string) => void;
  unlockAchievement: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSearchCategory: (category: string) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  toggleChat: () => void;
  toggleFavorite: (subjectId: string) => void;
  toggleFavoriteQuote: (index: number) => void;
  addWeeklyGoal: (goal: WeeklyGoal) => void;
  toggleWeeklyGoal: (id: string) => void;
  removeWeeklyGoal: (id: string) => void;
  addCountdown: (countdown: {id: string; title: string; targetDate: string; createdAt: string}) => void;
  removeCountdown: (id: string) => void;
  addNotification: (notification: {id: string; type: 'study_reminder' | 'achievement' | 'streak_warning'; title: string; message: string; read: boolean; createdAt: string}) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  resetProgress: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentView: "home",
      selectedSubjectId: null,
      selectedSemester: 1,

      // User
      userName: "طالب",
      userRole: "student",
      hasOnboarded: false,

      // Progress
      progress: [],
      subjectNotes: {},

      // Study Sessions
      studySessions: [],

      // Achievements
      achievements: [],

      // Search
      searchQuery: "",
      searchCategory: "",

      // Weekly Goals
      weeklyGoals: [],

      // Countdowns
      countdowns: [],

      // Notifications
      notifications: [],

      // UI
      sidebarOpen: false,
      theme: "light",
      chatOpen: false,
      favorites: [],
      favoriteQuotes: [],

      // Actions
      setView: (view) => set({ currentView: view }),

      selectSubject: (id) =>
        set({ selectedSubjectId: id, currentView: "subject-detail" }),

      setSelectedSemester: (semester) => set({ selectedSemester: semester }),

      setUserName: (name) => set({ userName: name }),

      setUserRole: (role) => set({ userRole: role }),

      completeOnboarding: () => set({ hasOnboarded: true }),

      updateProgress: (subjectId, status, progress) =>
        set((state) => {
          const existing = state.progress.find((p) => p.subjectId === subjectId);
          let newProgress: SubjectProgress[];
          if (existing) {
            newProgress = state.progress.map((p) =>
              p.subjectId === subjectId ? { ...p, status, progress } : p
            );
          } else {
            newProgress = [...state.progress, { subjectId, status, progress }];
          }

          // Check for achievement unlocks
          const completedCount = newProgress.filter(p => p.status === "completed").length;
          const inProgressCount = newProgress.filter(p => p.status === "in_progress").length;
          const newAchievements = [...state.achievements];

          const tryUnlock = (id: string) => {
            if (!newAchievements.find(a => a.id === id)) {
              newAchievements.push({
                id,
                title: id === "first_step" ? "الخطوة الأولى" :
                       id === "getting_started" ? "بداية الانطلاق" :
                       id === "halfway" ? "نصف الطريق" :
                       id === "almost_there" ? "عتبة التخرج" :
                       id === "graduate" ? "خريج متفوق" : id,
                description:
                  id === "first_step" ? "أكملت مادتك الأولى" :
                  id === "getting_started" ? "بدأت 5 مواد" :
                  id === "halfway" ? "أكملت نصف المواد" :
                  id === "almost_there" ? "أكملت 20 مادة" :
                  id === "graduate" ? "أكملت جميع المواد الـ 24" : "",
                icon: "🏆",
                unlockedAt: new Date().toISOString(),
                condition: id,
              });
            }
          };

          if (completedCount >= 1) tryUnlock("first_step");
          if (inProgressCount >= 5 || completedCount >= 1 && inProgressCount + completedCount >= 5) tryUnlock("getting_started");
          if (completedCount >= 12) tryUnlock("halfway");
          if (completedCount >= 20) tryUnlock("almost_there");
          if (completedCount >= 24) tryUnlock("graduate");

          return { progress: newProgress, achievements: newAchievements };
        }),

      setSubjectNotes: (subjectId, notes) =>
        set((state) => ({
          subjectNotes: { ...state.subjectNotes, [subjectId]: notes },
        })),

      addStudySession: (session) =>
        set((state) => ({
          studySessions: [...state.studySessions, session],
        })),

      removeStudySession: (id) =>
        set((state) => ({
          studySessions: state.studySessions.filter((s) => s.id !== id),
        })),

      toggleStudySession: (id) =>
        set((state) => ({
          studySessions: state.studySessions.map((s) =>
            s.id === id ? { ...s, completed: !s.completed } : s
          ),
        })),

      unlockAchievement: (id) =>
        set((state) => {
          if (state.achievements.find((a) => a.id === id)) return state;
          return {
            achievements: [
              ...state.achievements,
              {
                id,
                title: id,
                description: "",
                icon: "🏆",
                unlockedAt: new Date().toISOString(),
                condition: id,
              },
            ],
          };
        }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setSearchCategory: (category) => set({ searchCategory: category }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),

      toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),

      toggleFavorite: (subjectId) =>
        set((state) => ({
          favorites: state.favorites.includes(subjectId)
            ? state.favorites.filter((id) => id !== subjectId)
            : [...state.favorites, subjectId],
        })),

      toggleFavoriteQuote: (index) =>
        set((state) => ({
          favoriteQuotes: state.favoriteQuotes.includes(index)
            ? state.favoriteQuotes.filter((i) => i !== index)
            : [...state.favoriteQuotes, index],
        })),

      addWeeklyGoal: (goal) =>
        set((state) => ({
          weeklyGoals: [...state.weeklyGoals, goal],
        })),

      toggleWeeklyGoal: (id) =>
        set((state) => ({
          weeklyGoals: state.weeklyGoals.map((g) =>
            g.id === id ? { ...g, completed: !g.completed, completedHours: g.completed ? 0 : g.targetHours } : g
          ),
        })),

      removeWeeklyGoal: (id) =>
        set((state) => ({
          weeklyGoals: state.weeklyGoals.filter((g) => g.id !== id),
        })),

      addCountdown: (countdown) =>
        set((state) => ({
          countdowns: [...state.countdowns, countdown],
        })),

      removeCountdown: (id) =>
        set((state) => ({
          countdowns: state.countdowns.filter((c) => c.id !== id),
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      resetProgress: () => set({ progress: [], achievements: [], studySessions: [], subjectNotes: {}, weeklyGoals: [], countdowns: [], notifications: [] }),
    }),
    {
      name: "albadeel-storage",
      partialize: (state) => ({
        userName: state.userName,
        userRole: state.userRole,
        hasOnboarded: state.hasOnboarded,
        progress: state.progress,
        subjectNotes: state.subjectNotes,
        studySessions: state.studySessions,
        achievements: state.achievements,
        favorites: state.favorites,
        favoriteQuotes: state.favoriteQuotes,
        weeklyGoals: state.weeklyGoals,
        countdowns: state.countdowns,
        notifications: state.notifications,
        theme: state.theme,
      }),
    }
  )
);
