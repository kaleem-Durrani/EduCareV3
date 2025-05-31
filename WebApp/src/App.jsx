import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './pages/components/AdminLAyout';
import ClassesScreen from './pages/ClassesScreen';
import StudentsScreen from './pages/StudentScreen';
import TeachersScreen from './pages/TeachersScreen';
import FoodMenuScreen from './pages/FoodMenuScreen';
import ReportsScreen from './pages/ReportsScreen';
import MonthlyPlansScreen from './pages/MonthlyPlans';
import LostItemsScreen from './pages/LostItemsScreen';
import FeesScreen from './pages/FeesScreen';
import ParentsScreen from './pages/ParentsScreen';
import AdminRegister from './pages/AdminRegister';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Adminregister" element={<AdminRegister />} />
        {/* <Route path="/Admin/dashboard" element={<AdminDashboard />} /> */}
        <Route path="/Admin/dashboard" element={
            <AdminLayout>
                <AdminDashboard />
            </AdminLayout>

        } />
        <Route path="/Admin/classes" element={
            <AdminLayout>
                <ClassesScreen />
            </AdminLayout>
        } />
        <Route path="/Admin/students" element={
            <AdminLayout>
                <StudentsScreen />
            </AdminLayout>
        } />
        <Route path="/Admin/teachers" element={
            <AdminLayout>
                <TeachersScreen />
            </AdminLayout>
        } />
        <Route path="/Admin/parents" element={
            <AdminLayout>
                <ParentsScreen />
            </AdminLayout>
        } />
        <Route path="/Admin/food" element={
            <AdminLayout>
                <FoodMenuScreen />
            </AdminLayout>
        } />
        <Route path="/Admin/reports" element={
            <AdminLayout>
                <ReportsScreen />
            </AdminLayout>
        } />
        <Route path="/Admin/plans" element={
            <AdminLayout>
                <MonthlyPlansScreen />
            </AdminLayout>
        } />
        <Route path="/Admin/lostitems" element={
            <AdminLayout>
                <LostItemsScreen />
            </AdminLayout>
        } />
        <Route path="/Admin/fees" element={
            <AdminLayout>
                <FeesScreen />
            </AdminLayout>
        } />
      </Routes>
    </Router>
  );
}