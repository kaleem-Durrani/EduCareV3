// API URLs from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// Authentication & User Management
export const AUTH_ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_TOKEN: "/verify-token",
  UPDATE_PROFILE: "/update-profile",
};

// Admin Dashboard
export const ADMIN_ENDPOINTS = {
  GET_NUMBERS: "/numbers",
};

// Classes Management
export const CLASS_ENDPOINTS = {
  CREATE_CLASS: "/classes",
  UPDATE_CLASS: (classId) => `/classes/${classId}`,
  ADD_TEACHER: (classId) => `/classes/${classId}/teachers`,
  REMOVE_TEACHER: (classId, teacherId) =>
    `/classes/${classId}/teachers/${teacherId}`,
  ADD_STUDENT: (classId) => `/classes/${classId}/students`,
  REMOVE_STUDENT: (classId, studentId) =>
    `/classes/${classId}/students/${studentId}`,
  GET_ALL_CLASSES: "/classes",
  GET_ENROLLED_TEACHER_CLASSES: "/classes/enrolled-teacher",
  GET_CLASS_BY_ID: (classId) => `/classes/${classId}`,
  GET_CLASS_ROSTER: (classId) => `/classes/${classId}/roster`,
};

// Students Management
export const STUDENT_ENDPOINTS = {
  GET_ALL_STUDENTS: "/students",
  CREATE_STUDENT: "/student",
  UPDATE_STUDENT: (studentId) => `/student/${studentId}`,
  ENROLL_STUDENT: (studentId) => `/student/${studentId}/enroll`,
  GET_ENROLLMENT_HISTORY: (studentId) =>
    `/student/${studentId}/enrollment-history`,
  TRANSFER_STUDENT: (studentId) => `/student/${studentId}/transfer`,
  WITHDRAW_STUDENT: (studentId) => `/student/${studentId}/withdraw`,
  GET_BASIC_INFO_PARENT: (studentId) =>
    `/student/${studentId}/basic-info-parent`,
  GET_BASIC_INFO_TEACHER: (studentId) =>
    `/student/${studentId}/basic-info-teacher`,
  GET_PARENT_STUDENTS: "/students/parent",
};

// Teachers Management
export const TEACHER_ENDPOINTS = {
  GET_ALL_TEACHERS: "/teachers/all",
  CREATE_TEACHER: "/teacher/create",
};

// Parents Management
export const PARENT_ENDPOINTS = {
  GET_ALL_PARENTS: "/parents/all",
  CREATE_STUDENT_PARENT_RELATION: "/student-parent",
};

// Weekly Menu Management
export const MENU_ENDPOINTS = {
  CREATE_WEEKLY_MENU: "/menu/weekly",
  GET_CURRENT_WEEKLY_MENU: "/menu/weekly",
  UPDATE_WEEKLY_MENU: (menuId) => `/menu/weekly/${menuId}`,
  DELETE_WEEKLY_MENU: (menuId) => `/menu/weekly/${menuId}`,
};

// Reports Management
export const REPORT_ENDPOINTS = {
  CREATE_WEEKLY_REPORT: "/reports/weekly",
  GET_WEEKLY_REPORTS: (studentId) => `/reports/weekly/${studentId}`,
  UPDATE_WEEKLY_REPORT: (reportId) => `/reports/weekly/${reportId}`,
  CREATE_BATCH_REPORTS: (studentId) => `/reports/weekly/batch/${studentId}`,
};

// Monthly Plans Management
export const PLAN_ENDPOINTS = {
  CREATE_MONTHLY_PLAN: "/plans/monthly",
  GET_MONTHLY_PLAN: (classId) => `/plans/monthly/${classId}`,
  UPDATE_MONTHLY_PLAN: (planId) => `/plans/monthly/${planId}`,
  DELETE_MONTHLY_PLAN: (planId) => `/plans/monthly/${planId}`,
  LIST_MONTHLY_PLANS: (classId) => `/plans/monthly/${classId}/list`,
};

// Activities Management
export const ACTIVITY_ENDPOINTS = {
  GET_CLASS_ACTIVITIES: (classId) => `/activities/class/${classId}`,
  GET_ACTIVITY_BY_ID: (activityId) => `/activities/${activityId}`,
  CREATE_ACTIVITY: "/activities",
  UPDATE_ACTIVITY: (activityId) => `/activities/${activityId}`,
  DELETE_ACTIVITY: (activityId) => `/activities/${activityId}`,
};

// Health Management
export const HEALTH_ENDPOINTS = {
  GET_HEALTH_METRICS: (studentId) => `/health/metrics/${studentId}`,
  CREATE_HEALTH_METRIC: (studentId) => `/health/metrics/${studentId}`,
  UPDATE_HEALTH_METRIC: (studentId, metricId) =>
    `/health/metrics/${studentId}/${metricId}`,
  GET_HEALTH_INFO: (studentId) => `/health/info/${studentId}`,
  UPDATE_HEALTH_INFO: (studentId) => `/health/info/${studentId}`,
};

// Fees Management
export const FEE_ENDPOINTS = {
  GET_STUDENT_FEES: (studentId) => `/fees/${studentId}`,
  CREATE_FEE: "/fees",
  UPDATE_FEE_STATUS: (feeId) => `/fees/${feeId}/status`,
  GET_FEE_SUMMARY: (studentId) => `/fees/summary/${studentId}`,
};

// Box Items Management
export const BOX_ENDPOINTS = {
  GET_BOX_ITEMS: "/box/items",
  GET_STUDENT_BOX_STATUS: (studentId) => `/box/student/${studentId}`,
  UPDATE_STUDENT_BOX_STATUS: (studentId) => `/box/student/${studentId}`,
};

// Documents Management
export const DOCUMENT_ENDPOINTS = {
  GET_DOCUMENT_TYPES: "/documents/types",
  CREATE_DOCUMENT_TYPE: "/documents/types",
  UPDATE_DOCUMENT_TYPE: (typeId) => `/documents/types/${typeId}`,
  DELETE_DOCUMENT_TYPE: (typeId) => `/documents/types/${typeId}`,
  GET_STUDENT_DOCUMENTS: (studentId) => `/documents/student/${studentId}`,
  UPDATE_STUDENT_DOCUMENTS: (studentId) => `/documents/student/${studentId}`,
};

// Posts Management
export const POST_ENDPOINTS = {
  GET_ALL_POSTS: "/posts",
  CREATE_POST: "/posts",
  UPDATE_POST: (postId) => `/posts/${postId}`,
  DELETE_POST: (postId) => `/posts/${postId}`,
};

// Lost Items Management
export const LOST_ITEM_ENDPOINTS = {
  GET_ALL_LOST_ITEMS: "/lost-items",
  GET_LOST_ITEM_BY_ID: (itemId) => `/lost-items/${itemId}`,
  CREATE_LOST_ITEM: "/lost-items",
  UPDATE_LOST_ITEM: (itemId) => `/lost-items/${itemId}`,
  DELETE_LOST_ITEM: (itemId) => `/lost-items/${itemId}`,
  GET_ITEM_IMAGE: (itemId) => `/lost-items/${itemId}/image`,
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};
