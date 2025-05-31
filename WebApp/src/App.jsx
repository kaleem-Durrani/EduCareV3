import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// Auth Pages
import Login from "./pages/Auth/Login";
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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/students"
              element={
                <PrivateRoute>
                  <StudentsScreen />
                </PrivateRoute>
              }
            />

            <Route
              path="/teachers"
              element={
                <PrivateRoute>
                  <TeachersScreen />
                </PrivateRoute>
              }
            />

            <Route
              path="/parents"
              element={
                <PrivateRoute>
                  <ParentsScreen />
                </PrivateRoute>
              }
            />

            <Route
              path="/classes"
              element={
                <PrivateRoute>
                  <ClassesScreen />
                </PrivateRoute>
              }
            />

            <Route
              path="/food-menu"
              element={
                <PrivateRoute>
                  <FoodMenuScreen />
                </PrivateRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <ReportsScreen />
                </PrivateRoute>
              }
            />

            <Route
              path="/monthly-plans"
              element={
                <PrivateRoute>
                  <MonthlyPlansScreen />
                </PrivateRoute>
              }
            />

            <Route
              path="/lost-items"
              element={
                <PrivateRoute>
                  <LostItemsScreen />
                </PrivateRoute>
              }
            />

            <Route
              path="/fees"
              element={
                <PrivateRoute>
                  <FeesScreen />
                </PrivateRoute>
              }
            />

            {/* Redirect old routes */}
            <Route
              path="/Admin/*"
              element={<Navigate to="/dashboard" replace />}
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}
