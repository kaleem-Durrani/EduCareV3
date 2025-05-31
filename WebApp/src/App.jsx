import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from "./constants/routes";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";

// Dashboard
import Dashboard from "./pages/Dashboard";

// Admin Pages
import ClassesScreen from "./pages/ClassesScreen";
import StudentsScreen from "./pages/StudentsScreen";
import TeachersScreen from "./pages/TeachersScreen";
import ParentsScreen from "./pages/ParentsScreen";
import FoodMenuScreen from "./pages/FoodMenuScreen";
import ReportsScreen from "./pages/ReportsScreen";
import MonthlyPlansScreen from "./pages/MonthlyPlans";
import LostItemsScreen from "./pages/LostItemsScreen";
import FeesScreen from "./pages/FeesScreen";

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: "#1890ff",
    borderRadius: 6,
    colorBgContainer: "#ffffff",
  },
  components: {
    Layout: {
      siderBg: "#ffffff",
      headerBg: "#ffffff",
    },
  },
};

export default function App() {
  return (
    <ConfigProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path={PUBLIC_ROUTES.HOME} element={<Home />} />
            <Route path={PUBLIC_ROUTES.LOGIN} element={<Login />} />
            <Route path={PUBLIC_ROUTES.REGISTER} element={<Register />} />

            {/* Protected Routes */}
            <Route
              path={PROTECTED_ROUTES.DASHBOARD}
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path={PROTECTED_ROUTES.STUDENTS}
              element={
                <PrivateRoute>
                  <StudentsScreen />
                </PrivateRoute>
              }
            />

            <Route
              path={PROTECTED_ROUTES.TEACHERS}
              element={
                <PrivateRoute>
                  <TeachersScreen />
                </PrivateRoute>
              }
            />

            <Route
              path={PROTECTED_ROUTES.PARENTS}
              element={
                <PrivateRoute>
                  <ParentsScreen />
                </PrivateRoute>
              }
            />

            <Route
              path={PROTECTED_ROUTES.CLASSES}
              element={
                <PrivateRoute>
                  <ClassesScreen />
                </PrivateRoute>
              }
            />

            <Route
              path={PROTECTED_ROUTES.FOOD_MENU}
              element={
                <PrivateRoute>
                  <FoodMenuScreen />
                </PrivateRoute>
              }
            />

            <Route
              path={PROTECTED_ROUTES.REPORTS}
              element={
                <PrivateRoute>
                  <ReportsScreen />
                </PrivateRoute>
              }
            />

            <Route
              path={PROTECTED_ROUTES.MONTHLY_PLANS}
              element={
                <PrivateRoute>
                  <MonthlyPlansScreen />
                </PrivateRoute>
              }
            />

            <Route
              path={PROTECTED_ROUTES.LOST_ITEMS}
              element={
                <PrivateRoute>
                  <LostItemsScreen />
                </PrivateRoute>
              }
            />

            <Route
              path={PROTECTED_ROUTES.FEES}
              element={
                <PrivateRoute>
                  <FeesScreen />
                </PrivateRoute>
              }
            />

            {/* Catch all route */}
            <Route
              path="*"
              element={<Navigate to={PUBLIC_ROUTES.HOME} replace />}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}
