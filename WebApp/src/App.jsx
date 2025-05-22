import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminRoute } from "./components/auth/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { ROUTES } from "./constants/routes";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./pages/components/AdminLayout";
import ClassesScreen from "./pages/ClassesScreen";
import StudentsScreen from "./pages/StudentScreen";
import TeachersScreen from "./pages/TeachersScreen";
import FoodMenuScreen from "./pages/FoodMenuScreen";
import ReportsScreen from "./pages/ReportsScreen";
import MonthlyPlansScreen from "./pages/MonthlyPlans";
import LostItemsScreen from "./pages/LostItemsScreen";
import FeesScreen from "./pages/FeesScreen";
import ParentsScreen from "./pages/ParentsScreen";
import AdminRegister from "./pages/AdminRegister";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.ADMIN_REGISTER} element={<AdminRegister />} />

            {/* Protected Admin Routes */}
            <Route
              path={ROUTES.ADMIN.DASHBOARD}
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN.CLASSES}
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ClassesScreen />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN.STUDENTS}
              element={
                <AdminRoute>
                  <AdminLayout>
                    <StudentsScreen />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN.TEACHERS}
              element={
                <AdminRoute>
                  <AdminLayout>
                    <TeachersScreen />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN.PARENTS}
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ParentsScreen />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN.FOOD_MENU}
              element={
                <AdminRoute>
                  <AdminLayout>
                    <FoodMenuScreen />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN.REPORTS}
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ReportsScreen />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN.MONTHLY_PLANS}
              element={
                <AdminRoute>
                  <AdminLayout>
                    <MonthlyPlansScreen />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN.LOST_ITEMS}
              element={
                <AdminRoute>
                  <AdminLayout>
                    <LostItemsScreen />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN.FEES}
              element={
                <AdminRoute>
                  <AdminLayout>
                    <FeesScreen />
                  </AdminLayout>
                </AdminRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
