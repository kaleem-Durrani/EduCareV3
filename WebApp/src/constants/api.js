// API endpoint constants
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    VERIFY_TOKEN: '/api/verify-token',
    REFRESH_TOKEN: '/api/refresh-token',
    REGISTER: '/api/register',
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/api/numbers',
    RECENT_ACTIVITIES: '/api/recent-activities',
  },

  // Students
  STUDENTS: {
    LIST: '/api/students',
    CREATE: '/api/students',
    GET_BY_ID: (id) => `/api/students/${id}`,
    UPDATE: (id) => `/api/students/${id}`,
    DELETE: (id) => `/api/students/${id}`,
    SEARCH: '/api/students/search',
    BULK_IMPORT: '/api/students/bulk-import',
    EXPORT: '/api/students/export',
  },

  // Teachers
  TEACHERS: {
    LIST: '/api/teachers',
    CREATE: '/api/teachers',
    GET_BY_ID: (id) => `/api/teachers/${id}`,
    UPDATE: (id) => `/api/teachers/${id}`,
    DELETE: (id) => `/api/teachers/${id}`,
    SEARCH: '/api/teachers/search',
  },

  // Classes
  CLASSES: {
    LIST: '/api/classes',
    CREATE: '/api/classes',
    GET_BY_ID: (id) => `/api/classes/${id}`,
    UPDATE: (id) => `/api/classes/${id}`,
    DELETE: (id) => `/api/classes/${id}`,
    ASSIGN_TEACHER: (id) => `/api/classes/${id}/assign-teacher`,
    ASSIGN_STUDENTS: (id) => `/api/classes/${id}/assign-students`,
  },

  // Parents
  PARENTS: {
    LIST: '/api/parents',
    CREATE: '/api/parents',
    GET_BY_ID: (id) => `/api/parents/${id}`,
    UPDATE: (id) => `/api/parents/${id}`,
    DELETE: (id) => `/api/parents/${id}`,
    GET_CHILDREN: (id) => `/api/parents/${id}/children`,
  },

  // Food Menu
  FOOD_MENU: {
    LIST: '/api/food-menu',
    CREATE: '/api/food-menu',
    GET_BY_ID: (id) => `/api/food-menu/${id}`,
    UPDATE: (id) => `/api/food-menu/${id}`,
    DELETE: (id) => `/api/food-menu/${id}`,
    GET_WEEKLY: '/api/food-menu/weekly',
    GET_MONTHLY: '/api/food-menu/monthly',
  },

  // Fees
  FEES: {
    LIST: '/api/fees',
    CREATE: '/api/fees',
    GET_BY_ID: (id) => `/api/fees/${id}`,
    UPDATE: (id) => `/api/fees/${id}`,
    DELETE: (id) => `/api/fees/${id}`,
    PAY: (id) => `/api/fees/${id}/pay`,
    GET_STUDENT_FEES: (studentId) => `/api/students/${studentId}/fees`,
  },

  // Reports
  REPORTS: {
    ATTENDANCE: '/api/reports/attendance',
    FEES_COLLECTION: '/api/reports/fees-collection',
    STUDENT_PERFORMANCE: '/api/reports/student-performance',
    TEACHER_PERFORMANCE: '/api/reports/teacher-performance',
    MONTHLY_SUMMARY: '/api/reports/monthly-summary',
  },

  // Lost Items
  LOST_ITEMS: {
    LIST: '/api/lost-items',
    CREATE: '/api/lost-items',
    GET_BY_ID: (id) => `/api/lost-items/${id}`,
    UPDATE: (id) => `/api/lost-items/${id}`,
    DELETE: (id) => `/api/lost-items/${id}`,
    MARK_FOUND: (id) => `/api/lost-items/${id}/found`,
  },

  // Monthly Plans
  MONTHLY_PLANS: {
    LIST: '/api/monthly-plans',
    CREATE: '/api/monthly-plans',
    GET_BY_ID: (id) => `/api/monthly-plans/${id}`,
    UPDATE: (id) => `/api/monthly-plans/${id}`,
    DELETE: (id) => `/api/monthly-plans/${id}`,
    GET_BY_MONTH: (year, month) => `/api/monthly-plans/${year}/${month}`,
  },

  // File Upload
  UPLOAD: {
    IMAGE: '/api/upload/image',
    DOCUMENT: '/api/upload/document',
    BULK_STUDENTS: '/api/upload/bulk-students',
  },
};
