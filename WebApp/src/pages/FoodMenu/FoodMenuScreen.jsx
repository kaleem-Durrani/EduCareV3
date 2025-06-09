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
  Table,
  Tag,
  Dropdown,
  Input,
  Select,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import useApi from "../../hooks/useApi";
import { menuService } from "../../services/index";
import { ERROR_DISPLAY_TYPES } from "../../utils/errorHandler";
import AdminLayout from "../../components/Layout/AdminLayout";
import MenuFormModal from "./components/MenuFormModal";
import MenuViewModal from "./components/MenuViewModal";
import MenuTable from "./components/MenuTable";

const { Title } = Typography;
const { Search } = Input;

export default function FoodMenuScreen() {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isCurrentMenuModalVisible, setIsCurrentMenuModalVisible] =
    useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [menuStatistics, setMenuStatistics] = useState(null);

  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    field: "createdAt",
    order: "desc",
  });

  // Fetch menus data with pagination
  const {
    data: menusData,
    isLoading: loading,
    request: fetchMenus,
  } = useApi((params) => menuService.getAllMenus(params), {
    errorHandling: {
      displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
      showValidationDetails: true,
    },
  });

  // Get menu statistics API
  const { request: getMenuStatisticsRequest, isLoading: loadingStatistics } =
    useApi(menuService.getMenuStatistics, {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
      },
    });

  // Create menu API
  const { request: createMenuRequest, isLoading: creating } = useApi(
    menuService.createWeeklyMenu,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Create Menu",
      },
    }
  );

  // Update menu API
  const { request: updateMenuRequest, isLoading: updating } = useApi(
    ({ id, data }) => menuService.updateWeeklyMenu(id, data),
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
        title: "Failed to Update Menu",
      },
    }
  );

  // Update status API
  const { request: updateStatusRequest, isLoading: updatingStatus } = useApi(
    ({ id, status }) => menuService.updateMenuStatus(id, { status }),
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
      },
    }
  );

  // Delete menu API
  const { request: deleteMenuRequest, isLoading: deleting } = useApi(
    menuService.deleteWeeklyMenu,
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
      },
    }
  );

  // Get current menu API
  const { request: getCurrentMenuRequest, isLoading: loadingCurrentMenu } =
    useApi(menuService.getCurrentWeeklyMenu, {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        showValidationDetails: true,
      },
    });

  // Smart refresh function that preserves current state
  const refreshMenusData = async () => {
    const params = {
      page: currentPage,
      limit: pageSize,
      status: statusFilter,
      sortBy: sortConfig.field,
      sortOrder: sortConfig.order,
    };

    if (searchFilter) {
      params.search = searchFilter;
    }

    await fetchMenus(params);
  };

  useEffect(() => {
    refreshMenusData();
    fetchMenuStatistics();
  }, [currentPage, pageSize, statusFilter, searchFilter, sortConfig]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMenuStatistics = async () => {
    try {
      const stats = await getMenuStatisticsRequest();
      setMenuStatistics(stats);
    } catch (error) {
      console.log("Failed to fetch menu statistics");
    }
  };

  const handleCreateMenu = async (values) => {
    try {
      await createMenuRequest(values);
      message.success("Menu created successfully!");
      setIsCreateModalVisible(false);
      refreshMenusData(); // Use smart refresh
      fetchMenuStatistics(); // Refresh statistics
    } catch (error) {
      // Error is automatically handled by useApi with detailed validation messages
      console.log("Create menu error handled by useApi");
    }
  };

  const handleUpdateMenu = async (values) => {
    try {
      await updateMenuRequest({ id: selectedMenu._id, data: values });
      message.success("Menu updated successfully!");
      setIsEditModalVisible(false);
      setSelectedMenu(null);
      refreshMenusData(); // Use smart refresh
      fetchMenuStatistics(); // Refresh statistics
    } catch (error) {
      // Error is automatically handled by useApi with detailed validation messages
      console.log("Update menu error handled by useApi");
    }
  };

  const handleUpdateStatus = async (menuId, status) => {
    try {
      await updateStatusRequest({ id: menuId, status });
      message.success(`Menu ${status} successfully!`);
      refreshMenusData(); // Use smart refresh
      fetchMenuStatistics(); // Refresh statistics
    } catch (error) {
      // Error is automatically handled by useApi
      console.log("Update status error handled by useApi");
    }
  };

  const handleDeleteMenu = async (menuId) => {
    try {
      await deleteMenuRequest(menuId);
      message.success("Menu deleted successfully!");
      refreshMenusData(); // Use smart refresh
      fetchMenuStatistics(); // Refresh statistics
    } catch (error) {
      // Error is automatically handled by useApi
      console.log("Delete menu error handled by useApi");
    }
  };

  const handleTableChange = ({
    page,
    pageSize: newPageSize,
    sorter,
    filters,
    status,
    search,
  }) => {
    // Update state variables
    if (page) setCurrentPage(page);
    if (newPageSize) setPageSize(newPageSize);
    if (status !== undefined) setStatusFilter(status);
    if (search !== undefined) setSearchFilter(search);
    if (sorter) {
      setSortConfig({
        field: sorter.field,
        order: sorter.order,
      });
    }

    // The useEffect will automatically trigger refreshMenusData when state changes
  };

  const handleAdd = () => {
    setSelectedMenu(null);
    setIsCreateModalVisible(true);
  };

  const handleEdit = (menu) => {
    setSelectedMenu(menu);
    setIsEditModalVisible(true);
  };

  const handleView = (menu) => {
    setSelectedMenu(menu);
    setIsViewModalVisible(true);
  };

  const handleViewCurrentMenu = async () => {
    try {
      const menu = await getCurrentMenuRequest();
      if (menu) {
        setCurrentMenu(menu);
        setIsCurrentMenuModalVisible(true);
      } else {
        message.info("No current menu found");
      }
    } catch (error) {
      // Error is automatically handled by useApi
      console.log("Get current menu error handled by useApi");
    }
  };

  const handleRefreshMenus = () => {
    refreshMenusData(); // Use smart refresh
    fetchMenuStatistics();
  };

  const handleCancelCreate = () => {
    setIsCreateModalVisible(false);
    setSelectedMenu(null);
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
    setSelectedMenu(null);
  };

  const handleCancelView = () => {
    setIsViewModalVisible(false);
    setSelectedMenu(null);
  };

  const handleCancelCurrentMenu = () => {
    setIsCurrentMenuModalVisible(false);
    setCurrentMenu(null);
  };

  // Get data from API response
  const menus = menusData?.menus || [];
  const paginationData = menusData?.pagination || {};

  return (
    <AdminLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Food Menu Management</Title>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16}>
          <Col span={6}>
            <Card loading={loadingStatistics}>
              <Statistic
                title="Total Menus"
                value={menuStatistics?.totalMenus || 0}
                prefix={<AppstoreOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card loading={loadingStatistics}>
              <Statistic
                title="Active Menus"
                value={menuStatistics?.activeMenus || 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card loading={loadingStatistics}>
              <Statistic
                title="Draft Menus"
                value={menuStatistics?.draftMenus || 0}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card loading={loadingStatistics}>
              <Statistic
                title="Total Items"
                value={menuStatistics?.totalItems || 0}
                prefix={<InboxOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Menus Table */}
        <MenuTable
          menus={menus}
          loading={loading}
          pagination={paginationData}
          statusFilter={statusFilter}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onView={handleView}
          onViewCurrentMenu={handleViewCurrentMenu}
          onDelete={handleDeleteMenu}
          onUpdateStatus={handleUpdateStatus}
          onTableChange={handleTableChange}
          onRefresh={handleRefreshMenus}
          loadingCurrentMenu={loadingCurrentMenu}
        />

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
          initialData={selectedMenu}
        />

        {/* View Menu Modal */}
        <MenuViewModal
          visible={isViewModalVisible}
          onCancel={handleCancelView}
          menu={selectedMenu}
        />

        {/* Current Menu Modal */}
        <MenuViewModal
          visible={isCurrentMenuModalVisible}
          onCancel={handleCancelCurrentMenu}
          menu={currentMenu}
        />
      </Space>
    </AdminLayout>
  );
}
