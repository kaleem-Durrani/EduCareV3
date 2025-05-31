import { useEffect } from "react";
import { Row, Col, Typography, Space } from "antd";
import useApi from "../../hooks/useApi";
import { adminService } from "../../services/index";
import AdminLayout from "../../components/Layout/AdminLayout";
import StatsCards from "./components/StatsCards";
import RecentActivities from "./components/RecentActivities";
import QuickActions from "./components/QuickActions";

const { Title } = Typography;

const AdminDashboard = () => {
  // Fetch dashboard statistics using our new API structure
  const {
    data: stats,
    isLoading: loading,
    request,
  } = useApi(adminService.getNumbers);

  useEffect(() => {
    request();
  }, []);

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Page Header */}
        <Title level={2}>Admin Dashboard</Title>

        {/* Statistics Cards */}
        <StatsCards stats={stats} loading={loading} />

        {/* Main Content Grid */}
        <Row gutter={[24, 24]}>
          {/* Quick Actions */}
          <Col xs={24} lg={12}>
            <QuickActions />
          </Col>

          {/* Recent Activities */}
          <Col xs={24} lg={12}>
            <RecentActivities />
          </Col>
        </Row>
      </Space>
    </AdminLayout>
  );
};

export default AdminDashboard;
