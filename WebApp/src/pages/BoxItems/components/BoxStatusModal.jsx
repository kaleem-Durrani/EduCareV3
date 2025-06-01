import React, { useEffect, useState } from "react";
import { 
  Modal, 
  Form, 
  Button, 
  Space, 
  Card, 
  Row, 
  Col, 
  Switch,
  Input,
  Divider,
  Tag,
  Alert
} from "antd";
import { InboxOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function BoxStatusModal({
  visible,
  onCancel,
  onSubmit,
  loading,
  selectedStudent,
  boxItems = [],
  currentBoxStatus = null,
  mode = "view", // "view", "edit"
}) {
  const [form] = Form.useForm();
  const [itemStatuses, setItemStatuses] = useState({});

  useEffect(() => {
    if (visible && currentBoxStatus) {
      // Initialize form with current box status
      const statusMap = {};
      const notesMap = {};
      
      if (currentBoxStatus.items && Array.isArray(currentBoxStatus.items)) {
        currentBoxStatus.items.forEach(item => {
          statusMap[item.item_id._id || item.item_id] = item.has_item;
          notesMap[item.item_id._id || item.item_id] = item.notes || '';
        });
      }
      
      setItemStatuses(statusMap);
      form.setFieldsValue(notesMap);
    } else if (visible) {
      // Initialize with all items as false
      const statusMap = {};
      boxItems.forEach(item => {
        statusMap[item._id] = false;
      });
      setItemStatuses(statusMap);
      form.resetFields();
    }
  }, [visible, currentBoxStatus, boxItems, form]);

  const handleItemToggle = (itemId, checked) => {
    setItemStatuses(prev => ({
      ...prev,
      [itemId]: checked
    }));
  };

  const handleSubmit = async (values) => {
    // Convert form data to the format expected by backend
    const items = boxItems.map(item => ({
      item_id: item._id,
      has_item: itemStatuses[item._id] || false,
      notes: values[item._id] || ''
    }));

    await onSubmit({ items });
  };

  const handleCancel = () => {
    form.resetFields();
    setItemStatuses({});
    onCancel();
  };

  const isReadOnly = mode === "view";
  const title = mode === "view" 
    ? `Box Status - ${selectedStudent?.fullName}` 
    : `Edit Box Status - ${selectedStudent?.fullName}`;

  // Calculate statistics
  const totalItems = boxItems.length;
  const itemsInStock = Object.values(itemStatuses).filter(Boolean).length;
  const completionPercentage = totalItems > 0 ? Math.round((itemsInStock / totalItems) * 100) : 0;

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      footer={isReadOnly ? [
        <Button key="close" onClick={handleCancel}>
          Close
        </Button>
      ] : null}
      width={800}
      destroyOnClose
    >
      {/* Summary Card */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <InboxOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{totalItems}</div>
                <div style={{ color: '#666' }}>Total Items</div>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{itemsInStock}</div>
                <div style={{ color: '#666' }}>In Stock</div>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <CloseCircleOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{totalItems - itemsInStock}</div>
                <div style={{ color: '#666' }}>Missing</div>
              </div>
            </div>
          </Col>
        </Row>
        
        <Divider />
        
        <div style={{ textAlign: 'center' }}>
          <Tag color={completionPercentage === 100 ? 'green' : completionPercentage > 50 ? 'blue' : 'red'}>
            {completionPercentage}% Complete
          </Tag>
        </div>
      </Card>

      {/* Items List */}
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit}
        disabled={isReadOnly}
      >
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {boxItems.map((item, index) => (
            <Card 
              key={item._id} 
              size="small" 
              style={{ 
                marginBottom: 8,
                border: itemStatuses[item._id] ? '1px solid #52c41a' : '1px solid #d9d9d9'
              }}
            >
              <Row gutter={16} align="middle">
                <Col span={12}>
                  <Space>
                    <Switch
                      checked={itemStatuses[item._id] || false}
                      onChange={(checked) => handleItemToggle(item._id, checked)}
                      disabled={isReadOnly}
                    />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                      {item.description && (
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {item.description}
                        </div>
                      )}
                    </div>
                  </Space>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={item._id}
                    style={{ margin: 0 }}
                  >
                    <TextArea
                      placeholder="Add notes..."
                      rows={1}
                      disabled={isReadOnly}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ))}
        </div>

        {!isReadOnly && (
          <>
            <Divider />
            <Form.Item style={{ marginBottom: 0 }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Box Status
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </Space>
            </Form.Item>
          </>
        )}
      </Form>

      {/* Last Updated Info */}
      {currentBoxStatus && currentBoxStatus.updatedAt && (
        <Alert
          message={`Last updated: ${new Date(currentBoxStatus.updatedAt).toLocaleString()}`}
          type="info"
          style={{ marginTop: 16 }}
          showIcon
        />
      )}
    </Modal>
  );
}
