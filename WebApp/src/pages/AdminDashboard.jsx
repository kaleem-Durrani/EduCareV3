import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";
import { dashboardService } from "../services/dashboard";
import { LoadingSpinner, ErrorMessage, PageLayout } from "../components/common";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    request: fetchStats,
    isLoading,
    error,
    data: stats,
    errorMessage,
  } = useApi(dashboardService.getStats);

  useEffect(() => {
    // Check authentication first
    if (authLoading) return; // Wait for auth to load

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Fetch dashboard stats
    fetchStats();
  }, [isAuthenticated, authLoading, navigate, fetchStats]);

  if (authLoading || isLoading) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <ErrorMessage
          title="Dashboard Error"
          message={errorMessage || "Failed to load dashboard"}
          onRetry={fetchStats}
          className="max-w-md"
        />
      </div>
    );
  }

  return (
    <PageLayout title="Dashboard" subtitle="Welcome to your admin dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Students Card */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-between h-48">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Total Students</h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats?.total_students || 0}
          </p>
        </div>

        {/* Classes Card */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-between h-48">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Total Classes</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.total_classes || 0}
          </p>
        </div>

        {/* Teachers Card */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-between h-48">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Total Teachers</h3>
          <p className="text-3xl font-bold text-green-600">
            {stats?.total_teachers || 0}
          </p>
        </div>

        {/* Fees Card */}
        {/* <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-between h-48">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Fees Collection</h3>
                        <p className="text-3xl font-bold text-yellow-600">$2500</p>
                    </div> */}
      </div>

      {/* Notices Section */}
      {/* <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Notices</h2>
                    <div className="space-y-4">
                        <div className="border-l-4 border-purple-500 pl-4 py-2">
                            <p className="text-sm text-gray-600">Posted on: 20 Feb, 2025</p>
                            <p className="text-gray-900">Parent-Teacher meeting scheduled for next week</p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4 py-2">
                            <p className="text-sm text-gray-600">Posted on: 19 Feb, 2025</p>
                            <p className="text-gray-900">Annual Sports Day announcement</p>
                        </div>
                    </div>
                </div> */}
    </PageLayout>
  );
};

export default AdminDashboard;
