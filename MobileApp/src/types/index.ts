// Global type definitions for EduCare Mobile App

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'parent' | 'teacher' | 'admin';
  profileImage?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface Student {
  _id: string;
  fullName: string;
  enrollmentNumber: string;
  class: string;
  section: string;
  profileImage?: string;
  parentId: string;
  classId: string;
}

export interface Teacher {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  subjects: string[];
  classes: string[];
}

export interface Class {
  _id: string;
  name: string;
  section: string;
  teacherId: string;
  students: Student[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Theme types
export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  card: string;

  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  textOnSecondary: string;

  // Border colors
  border: string;
  borderLight: string;

  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Header colors
  headerBackground: string;
  headerText: string;

  // Tab colors
  tabBackground: string;
  tabActive: string;
  tabInactive: string;

  // Shadow colors
  shadow: string;
}

// Navigation types based on mobile app guidelines
export type RootStackParamList = {
  Auth: undefined;
  ParentApp: undefined;
  TeacherApp: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
};

// Parent Navigation - No tabs, just stack navigation from home
export type ParentStackParamList = {
  ParentHome: undefined;
  BasicInformation: { studentId: string };
  Contacts: { studentId: string };
  WeeklyMenu: { studentId: string };
  WeeklyReport: { studentId: string };
  MonthlyPlan: { studentId: string };
  MyBox: { studentId: string };
  MyDocuments: { studentId: string };
  Activities: { studentId?: string };
  ActivityDetail: { activityId: string };
  Wall: { studentId?: string };
  Notes: { studentId: string };
  LostItems: undefined;
  Health: { studentId: string };
  Payment: { studentId: string };
  Driver: { studentId: string };
  Notifications: undefined;
  Settings: undefined;
};

// Teacher Navigation - No tabs, just stack navigation from home
export type TeacherStackParamList = {
  TeacherHome: undefined;
  OurKids: undefined; // Class list
  StudentProfile: { studentId: string };
  BasicInformation: { studentId: string };
  Contacts: { studentId: string };
  WeeklyMenu: undefined;
  WeeklyReport: undefined; // Teacher can create/edit
  MonthlyPlan: undefined;
  MyBox: undefined; // Teacher can edit for their students
  MyDocuments: { studentId: string };
  Activities: undefined; // Teacher can create/edit
  ActivityDetail: { activityId: string };
  CreateActivity: undefined;
  Wall: undefined; // Teacher can create posts
  CreatePost: undefined;
  Notes: undefined; // Teacher can create/edit notes
  CreateNote: { studentId: string };
  Settings: undefined;
  Notifications: undefined;
};
