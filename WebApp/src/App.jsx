import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./context/AuthContext";
import { StudentsProvider } from "./context/StudentsContext";
import { TeachersProvider } from "./context/TeachersContext";
import { ClassesProvider } from "./context/ClassesContext";
import PrivateRoute from "./components/PrivateRoute";
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from "./constants/routes";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";

// Dashboard
import AdminDashboard from "./pages/AdminDashboard";

// Admin Pages
import ClassesScreen from "./pages/Classes";
import StudentsScreen from "./pages/Students";
import TeachersScreen from "./pages/Teachers";
import ParentsScreen from "./pages/Parents";
import FoodMenuScreen from "./pages/FoodMenu";
import ReportsScreen from "./pages/Reports";
import MonthlyPlansScreen from "./pages/MonthlyPlans";
import LostItemsScreen from "./pages/LostItems";
import FeesScreen from "./pages/Fees";
import HealthScreen from "./pages/Health";
import BoxItemsScreen from "./pages/BoxItems";
import DocumentsScreen from "./pages/Documents";
import PostsScreen from "./pages/Posts";

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
        <StudentsProvider>
          <TeachersProvider>
            <ClassesProvider>
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
                        <AdminDashboard />
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

                  <Route
                    path={PROTECTED_ROUTES.HEALTH}
                    element={
                      <PrivateRoute>
                        <HealthScreen />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path={PROTECTED_ROUTES.BOX_ITEMS}
                    element={
                      <PrivateRoute>
                        <BoxItemsScreen />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path={PROTECTED_ROUTES.DOCUMENTS}
                    element={
                      <PrivateRoute>
                        <DocumentsScreen />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path={PROTECTED_ROUTES.POSTS}
                    element={
                      <PrivateRoute>
                        <PostsScreen />
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
            </ClassesProvider>
          </TeachersProvider>
        </StudentsProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}
