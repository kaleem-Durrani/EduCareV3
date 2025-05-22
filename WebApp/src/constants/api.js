// API endpoint constants
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/login", // ✅ Working
    LOGOUT: "/api/logout", // ❌ MISSING - Need to implement in backend
    VERIFY_TOKEN: "/api/verify-token", // ✅ Working
    REFRESH_TOKEN: "/api/refresh-token", // ❌ MISSING - Need to implement in backend
    REGISTER: "/api/register", // ✅ Working
    UPDATE_PROFILE: "/api/update-profile", // ✅ Working
    FORGOT_PASSWORD: "/api/forgot-password", // ✅ Working
  },

  // Dashboard
  DASHBOARD: {
    STATS: "/api/numbers", // ✅ Working
    RECENT_ACTIVITIES: "/api/recent-activities", // ❌ MISSING - Need to implement in backend
  },

  // Students
  STUDENTS: {
    LIST: "/api/students", // ✅ Working (role-based, NO pagination)
    CREATE: "/api/student", // ✅ Working
    GET_BY_ID: (id) => `/api/student/${id}/basic-info-for-teacher`, // ✅ Working
    UPDATE: (id) => `/api/student/${id}`, // ✅ Working (uses rollNum)
    DELETE: (id) => `/api/student/${id}`, // ❌ MISSING - Need soft delete in backend
    ENROLL: (id) => `/api/students/${id}/enroll`, // ✅ Working
    TRANSFER: (id) => `/api/students/${id}/transfer`, // ✅ Working
    WITHDRAW: (id) => `/api/students/${id}/withdraw`, // ✅ Working
    ENROLLMENT_HISTORY: (id) => `/api/students/${id}/enrollment-history`, // ✅ Working
    BASIC_INFO_PARENT: (id) => `/api/student/${id}/basic-info`, // ✅ Working
    PARENT_STUDENTS: "/api/parent/students", // ✅ Working
    SEARCH: "/api/students/search", // ❌ MISSING - Need search in backend
    BULK_IMPORT: "/api/students/bulk-import", // ❌ MISSING - Need bulk import in backend
    EXPORT: "/api/students/export", // ❌ MISSING - Need export in backend
  },

  // Teachers
  TEACHERS: {
    LIST: "/api/teachers/all", // Backend uses /teachers/all
    CREATE: "/api/teacher/create", // Backend uses /teacher/create
    GET_BY_ID: (id) => `/api/teacher/${id}`, // Note: Backend doesn't have get by ID
    UPDATE: (id) => `/api/teacher/${id}`, // Note: Backend doesn't have update
    DELETE: (id) => `/api/teacher/${id}`, // Note: Backend doesn't have delete
    SEARCH: "/api/teachers/search", // Note: Backend doesn't have search
  },

  // Classes
  CLASSES: {
    LIST: "/api/classes", // Note: Backend doesn't have list endpoint
    CREATE: "/api/classes",
    GET_BY_ID: (id) => `/api/classes/${id}`, // Note: Backend doesn't have get by ID
    UPDATE: (id) => `/api/classes/${id}`,
    DELETE: (id) => `/api/classes/${id}`, // Note: Backend doesn't have delete endpoint
    ADD_TEACHER: (id) => `/api/classes/${id}/teachers`,
    REMOVE_TEACHER: (id) => `/api/classes/${id}/teachers/remove`,
    ADD_STUDENT: (id) => `/api/classes/${id}/students`,
    REMOVE_STUDENT: (id) => `/api/classes/${id}/students/remove`,
    GET_STUDENTS: (id) => `/api/classes/${id}/students`,
    GET_TEACHERS: (id) => `/api/classes/${id}/teachers`,
  },

  // Parents
  PARENTS: {
    LIST: "/api/parents", // Note: Backend doesn't have list endpoint
    CREATE: "/api/parent/create",
    GET_BY_ID: (id) => `/api/parent/${id}`, // Note: Backend doesn't have get by ID
    UPDATE: (id) => `/api/parent/${id}`, // Note: Backend doesn't have update
    DELETE: (id) => `/api/parent/${id}`, // Note: Backend doesn't have delete
    GET_CHILDREN: (id) => `/api/parent/${id}/children`,
  },

  // Food Menu
  FOOD_MENU: {
    LIST: "/api/menu/weekly", // Backend uses /menu/weekly
    CREATE: "/api/menu/weekly",
    GET_BY_ID: (id) => `/api/menu/weekly/${id}`,
    UPDATE: (id) => `/api/menu/weekly/${id}`,
    DELETE: (id) => `/api/menu/weekly/${id}`,
    GET_CURRENT: "/api/menu/weekly/current",
  },

  // Fees
  FEES: {
    LIST: "/api/fees", // Note: Backend doesn't have list endpoint
    CREATE: "/api/fees/create",
    GET_BY_ID: (id) => `/api/fees/${id}`, // Note: Backend doesn't have get by ID
    UPDATE: (id) => `/api/fees/${id}`, // Note: Backend doesn't have update
    DELETE: (id) => `/api/fees/${id}`, // Note: Backend doesn't have delete
    PAY: (id) => `/api/fees/${id}/pay`, // Note: Backend doesn't have pay endpoint
    GET_STUDENT_FEES: (studentId) => `/api/fees/student/${studentId}`,
    GET_CLASS_FEES: (classId) => `/api/fees/class/${classId}`,
  },

  // Reports (Weekly Reports)
  REPORTS: {
    CREATE_WEEKLY: "/api/reports/weekly",
    GET_WEEKLY: (studentId) => `/api/reports/weekly/${studentId}`,
    UPDATE_WEEKLY: (reportId) => `/api/reports/weekly/${reportId}`,
    CREATE_BATCH: (studentId) => `/api/reports/weekly/batch/${studentId}`,
    // Note: Backend doesn't have attendance, fees-collection, etc. endpoints
  },

  // Lost Items
  LOST_ITEMS: {
    LIST: "/api/lost-items", // Note: Backend doesn't have list endpoint
    CREATE: "/api/lost-items/create",
    GET_BY_ID: (id) => `/api/lost-items/${id}`, // Note: Backend doesn't have get by ID
    UPDATE: (id) => `/api/lost-items/${id}`, // Note: Backend doesn't have update
    DELETE: (id) => `/api/lost-items/${id}`, // Note: Backend doesn't have delete
    MARK_FOUND: (id) => `/api/lost-items/${id}/found`, // Note: Backend doesn't have mark found
  },

  // Monthly Plans
  MONTHLY_PLANS: {
    LIST: (classId) => `/api/plans/monthly/${classId}/list`,
    CREATE: "/api/plans/monthly",
    GET_BY_ID: (classId) => `/api/plans/monthly/${classId}`,
    UPDATE: (planId) => `/api/plans/monthly/${planId}`,
    DELETE: (planId) => `/api/plans/monthly/${planId}`,
  },

  // Activities
  ACTIVITIES: {
    LIST: (classId) => `/api/activities/class/${classId}`,
    CREATE: "/api/activities",
    GET_BY_ID: (id) => `/api/activities/${id}`,
    UPDATE: (id) => `/api/activities/${id}`,
    DELETE: (id) => `/api/activities/${id}`,
  },

  // Posts
  POSTS: {
    LIST: "/api/posts",
    CREATE: "/api/posts",
    UPDATE: (id) => `/api/posts/${id}`,
    DELETE: (id) => `/api/posts/${id}`,
  },

  // Health
  HEALTH: {
    CREATE: "/api/health/create",
    GET_BY_STUDENT: (studentId) => `/api/health/student/${studentId}`,
    UPDATE: (id) => `/api/health/${id}`,
    DELETE: (id) => `/api/health/${id}`,
  },

  // Documents
  DOCUMENTS: {
    CREATE: "/api/documents/create",
    GET_BY_STUDENT: (studentId) => `/api/documents/student/${studentId}`,
    UPDATE: (id) => `/api/documents/${id}`,
    DELETE: (id) => `/api/documents/${id}`,
  },

  // Boxes (Lunch Boxes)
  BOXES: {
    CREATE: "/api/boxes/create",
    GET_BY_STUDENT: (studentId) => `/api/boxes/student/${studentId}`,
    UPDATE: (id) => `/api/boxes/${id}`,
    DELETE: (id) => `/api/boxes/${id}`,
  },

  // File Upload (Note: Backend doesn't have these endpoints)
  UPLOAD: {
    IMAGE: "/api/upload/image",
    DOCUMENT: "/api/upload/document",
    BULK_STUDENTS: "/api/upload/bulk-students",
  },
};
