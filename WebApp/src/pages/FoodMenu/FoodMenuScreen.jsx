import { useState, useEffect } from "react";
import {
  Button,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  message,
  Popconfirm,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import useApi from "../../hooks/useApi";
import { menuService } from "../../services/index";
import AdminLayout from "../../components/Layout/AdminLayout";
import MenuTable from "./components/MenuTable";
import MenuFormModal from "./components/MenuFormModal";

const { Title } = Typography;

export default function FoodMenuScreen() {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Fetch menu data
  const {
    data: menuData,
    isLoading: loading,
    request: fetchMenu,
  } = useApi(menuService.getCurrentWeeklyMenu);

  // Create menu API
  const { request: createMenuRequest, isLoading: creating } = useApi(
    menuService.createWeeklyMenu
  );

  // Update menu API
  const { request: updateMenuRequest, isLoading: updating } = useApi(
    ({ id, data }) => menuService.updateWeeklyMenu(id, data)
  );

  // Delete menu API
  const { request: deleteMenuRequest, isLoading: deleting } = useApi(
    menuService.deleteWeeklyMenu
  );

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleCreateMenu = async (values) => {
    try {
      await createMenuRequest(values);
      message.success("Menu created successfully!");
      setIsCreateModalVisible(false);
      fetchMenu();
    } catch (error) {
      message.error("Failed to create menu");
    }
  };

  const handleUpdateMenu = async (values) => {
    try {
      await updateMenuRequest({ id: menuData._id, data: values });
      message.success("Menu updated successfully!");
      setIsEditModalVisible(false);
      fetchMenu();
    } catch (error) {
      message.error("Failed to update menu");
    }
  };

  const handleDeleteMenu = async () => {
    try {
      await deleteMenuRequest(menuData._id);
      message.success("Menu deleted successfully!");
      fetchMenu();
    } catch (error) {
      message.error("Failed to delete menu");
    }
  };

  const handleCreate = () => {
    setIsCreateModalVisible(true);
  };

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleCancelCreate = () => {
    setIsCreateModalVisible(false);
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
  };

  // Calculate statistics
  const totalDays = menuData?.menuData?.length || 0;
  const totalItems =
    menuData?.menuData?.reduce(
      (sum, day) => sum + (day.items?.length || 0),
      0
    ) || 0;
  const avgItemsPerDay =
    totalDays > 0 ? Math.round((totalItems / totalDays) * 10) / 10 : 0;

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Food Menu Management</Title>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Menu Days"
                value={totalDays}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Items"
                value={totalItems}
                prefix={<AppstoreOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Avg Items/Day"
                value={avgItemsPerDay}
                prefix={<AppstoreOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Menu Content */}
        <Card>
          <div style={{ marginBottom: 16 }}>
            <Space>
              {!menuData ? (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  Create Weekly Menu
                </Button>
              ) : (
                <>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                  >
                    Edit Menu
                  </Button>
                  <Popconfirm
                    title="Delete Menu"
                    description="Are you sure you want to delete this menu?"
                    onConfirm={handleDeleteMenu}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      loading={deleting}
                    >
                      Delete Menu
                    </Button>
                  </Popconfirm>
                </>
              )}
            </Space>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              Loading menu...
            </div>
          ) : menuData ? (
            <MenuTable menuData={menuData} />
          ) : (
            <Empty
              description="No menu found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                Create First Menu
              </Button>
            </Empty>
          )}
        </Card>

        {/* Create Menu Modal */}
        <MenuFormModal
          visible={isCreateModalVisible}
          onCancel={handleCancelCreate}
          onSubmit={handleCreateMenu}
          loading={creating}
          title="Create Weekly Menu"
          mode="create"
        />

        {/* Edit Menu Modal */}
        <MenuFormModal
          visible={isEditModalVisible}
          onCancel={handleCancelEdit}
          onSubmit={handleUpdateMenu}
          loading={updating}
          title="Edit Weekly Menu"
          mode="edit"
          initialData={menuData}
        />
      </Space>
    </AdminLayout>
  );
}
