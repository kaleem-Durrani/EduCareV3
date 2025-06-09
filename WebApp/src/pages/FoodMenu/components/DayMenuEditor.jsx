import React from "react";
import { Input, Button, Space, Card } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

export default function DayMenuEditor({
  day,
  items,
  onItemsChange,
  disabled = false,
}) {
  const handleAddItem = () => {
    const newItems = [...items, ""];
    onItemsChange(newItems);
  };

  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    onItemsChange(newItems);
  };

  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
  };

  return (
    <Card
      size="small"
      style={{
        backgroundColor: "#fafafa",
        border: "2px solid #d9d9d9",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        {items.map((item, index) => (
          <Space key={index} style={{ width: "100%" }}>
            <Input
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder={`Enter menu item ${index + 1}`}
              disabled={disabled}
              style={{
                flex: 1,
                border: "2px solid #d9d9d9",
                borderRadius: "6px",
                fontSize: "14px",
                padding: "8px 12px",
              }}
            />
            {!disabled && (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteItem(index)}
                size="small"
                style={{
                  border: "1px solid #ff4d4f",
                  borderRadius: "4px",
                }}
              />
            )}
          </Space>
        ))}

        {!disabled && (
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddItem}
            style={{
              width: "100%",
              border: "2px dashed #1890ff",
              borderRadius: "6px",
              height: "40px",
              fontSize: "14px",
              fontWeight: "500",
            }}
            size="small"
          >
            Add Menu Item
          </Button>
        )}

        {items.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#999",
              padding: "20px",
              fontStyle: "italic",
              backgroundColor: "#f0f0f0",
              border: "1px dashed #d9d9d9",
              borderRadius: "6px",
            }}
          >
            No items added yet. Click "Add Menu Item" to start.
          </div>
        )}
      </Space>
    </Card>
  );
}
