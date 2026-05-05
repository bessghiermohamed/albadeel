export type UserRole = "student" | "teacher" | "admin";

export type SubjectStatus = "not_started" | "in_progress" | "completed";

export type ViewType =
  | "home"
  | "dashboard"
  | "subjects"
  | "subject-detail"
  | "search"
  | "about"
  | "planner"
  | "timer"
  | "resources";

export interface Subject {
  id: string;
  nameAr: string;
  nameEn?: string;
  code: string;
  semester: 1 | 2;
  isShared: boolean;
  category: string;
  description?: string;
  driveLink?: string;
  icon?: string;
  color?: string;
  order: number;
}

export interface SubjectProgress {
  subjectId: string;
  status: SubjectStatus;
  progress: number;
  notes?: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  date: string; // ISO date string
  duration: number; // minutes
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string; // ISO date when unlocked
  condition: string; // description of unlock condition
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface DashboardStats {
  totalSubjects: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  overallProgress: number;
}

export interface WeeklyGoal {
  id: string;
  subjectId: string;
  targetHours: number;
  completedHours: number;
  description: string;
  completed: boolean;
  createdAt: string;
}
