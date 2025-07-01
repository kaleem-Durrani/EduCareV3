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

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  ParentApp: undefined;
  TeacherApp: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
};

export type ParentTabParamList = {
  Dashboard: undefined;
  Notifications: undefined;
  Settings: undefined;
};

export type TeacherTabParamList = {
  Dashboard: undefined;
  Classes: undefined;
  Settings: undefined;
};

export type ParentStackParamList = {
  ParentDashboard: undefined;
  StudentProfile: { studentId: string };
  BasicInformation: { studentId: string };
  WeeklyReport: { studentId: string };
  MonthlyPlan: { studentId: string };
  Activities: { studentId: string };
  // Add more parent screens as needed
};

export type TeacherStackParamList = {
  TeacherDashboard: undefined;
  ClassList: undefined;
  StudentProfile: { studentId: string };
  // Add more teacher screens as needed
};
