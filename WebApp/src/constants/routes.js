// Application route constants
export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_REGISTER: '/Adminregister',

  // Admin Routes
  ADMIN: {
    DASHBOARD: '/Admin/dashboard',
    STUDENTS: '/Admin/students',
    STUDENT_DETAIL: (id) => `/Admin/students/${id}`,
    STUDENT_CREATE: '/Admin/students/create',
    STUDENT_EDIT: (id) => `/Admin/students/${id}/edit`,
    
    TEACHERS: '/Admin/teachers',
    TEACHER_DETAIL: (id) => `/Admin/teachers/${id}`,
    TEACHER_CREATE: '/Admin/teachers/create',
    TEACHER_EDIT: (id) => `/Admin/teachers/${id}/edit`,
    
    CLASSES: '/Admin/classes',
    CLASS_DETAIL: (id) => `/Admin/classes/${id}`,
    CLASS_CREATE: '/Admin/classes/create',
    CLASS_EDIT: (id) => `/Admin/classes/${id}/edit`,
    
    PARENTS: '/Admin/parents',
    PARENT_DETAIL: (id) => `/Admin/parents/${id}`,
    PARENT_CREATE: '/Admin/parents/create',
    PARENT_EDIT: (id) => `/Admin/parents/${id}/edit`,
    
    FOOD_MENU: '/Admin/food',
    FOOD_MENU_CREATE: '/Admin/food/create',
    FOOD_MENU_EDIT: (id) => `/Admin/food/${id}/edit`,
    
    FEES: '/Admin/fees',
    FEE_DETAIL: (id) => `/Admin/fees/${id}`,
    FEE_CREATE: '/Admin/fees/create',
    FEE_EDIT: (id) => `/Admin/fees/${id}/edit`,
    
    REPORTS: '/Admin/reports',
    REPORT_ATTENDANCE: '/Admin/reports/attendance',
    REPORT_FEES: '/Admin/reports/fees',
    REPORT_PERFORMANCE: '/Admin/reports/performance',
    
    LOST_ITEMS: '/Admin/lostitems',
    LOST_ITEM_DETAIL: (id) => `/Admin/lostitems/${id}`,
    LOST_ITEM_CREATE: '/Admin/lostitems/create',
    LOST_ITEM_EDIT: (id) => `/Admin/lostitems/${id}/edit`,
    
    MONTHLY_PLANS: '/Admin/plans',
    MONTHLY_PLAN_DETAIL: (id) => `/Admin/plans/${id}`,
    MONTHLY_PLAN_CREATE: '/Admin/plans/create',
    MONTHLY_PLAN_EDIT: (id) => `/Admin/plans/${id}/edit`,
  },

  // Teacher Routes (for future use)
  TEACHER: {
    DASHBOARD: '/teacher/dashboard',
    CLASSES: '/teacher/classes',
    STUDENTS: '/teacher/students',
    ATTENDANCE: '/teacher/attendance',
    GRADES: '/teacher/grades',
  },

  // Parent Routes (for future use)
  PARENT: {
    DASHBOARD: '/parent/dashboard',
    CHILDREN: '/parent/children',
    FEES: '/parent/fees',
    REPORTS: '/parent/reports',
    COMMUNICATION: '/parent/communication',
  },

  // Student Routes (for future use)
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    PROFILE: '/student/profile',
    GRADES: '/student/grades',
    ATTENDANCE: '/student/attendance',
    ASSIGNMENTS: '/student/assignments',
  },
};

// Route groups for easier management
export const ROUTE_GROUPS = {
  PUBLIC: [ROUTES.HOME, ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.ADMIN_REGISTER],
  ADMIN: Object.values(ROUTES.ADMIN).filter(route => typeof route === 'string'),
  TEACHER: Object.values(ROUTES.TEACHER),
  PARENT: Object.values(ROUTES.PARENT),
  STUDENT: Object.values(ROUTES.STUDENT),
};

// Protected route patterns
export const PROTECTED_ROUTE_PATTERNS = {
  ADMIN: '/Admin/*',
  TEACHER: '/teacher/*',
  PARENT: '/parent/*',
  STUDENT: '/student/*',
};

// Navigation menu items
export const ADMIN_MENU_ITEMS = [
  {
    label: 'Dashboard',
    path: ROUTES.ADMIN.DASHBOARD,
    icon: 'dashboard',
  },
  {
    label: 'Students',
    path: ROUTES.ADMIN.STUDENTS,
    icon: 'users',
  },
  {
    label: 'Teachers',
    path: ROUTES.ADMIN.TEACHERS,
    icon: 'user-check',
  },
  {
    label: 'Classes',
    path: ROUTES.ADMIN.CLASSES,
    icon: 'book-open',
  },
  {
    label: 'Parents',
    path: ROUTES.ADMIN.PARENTS,
    icon: 'users',
  },
  {
    label: 'Food Menu',
    path: ROUTES.ADMIN.FOOD_MENU,
    icon: 'utensils',
  },
  {
    label: 'Fees',
    path: ROUTES.ADMIN.FEES,
    icon: 'credit-card',
  },
  {
    label: 'Reports',
    path: ROUTES.ADMIN.REPORTS,
    icon: 'bar-chart',
  },
  {
    label: 'Lost Items',
    path: ROUTES.ADMIN.LOST_ITEMS,
    icon: 'search',
  },
  {
    label: 'Monthly Plans',
    path: ROUTES.ADMIN.MONTHLY_PLANS,
    icon: 'calendar',
  },
];
