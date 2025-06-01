import React from "react";
import { Input, Button, Space, Card } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

export default function DayMenuEditor({ day, items, onItemsChange }) {
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
    <Card size="small" style={{ backgroundColor: "#fafafa" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        {items.map((item, index) => (
          <Space key={index} style={{ width: "100%" }}>
            <Input
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder={`Enter menu item ${index + 1}`}
              style={{ flex: 1 }}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteItem(index)}
              size="small"
            />
          </Space>
        ))}
        
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAddItem}
          style={{ width: "100%" }}
          size="small"
        >
          Add Menu Item
        </Button>
        
        {items.length === 0 && (
          <div style={{ 
            textAlign: "center", 
            color: "#999", 
            padding: "20px",
            fontStyle: "italic" 
          }}>
            No items added yet. Click "Add Menu Item" to start.
          </div>
        )}
      </Space>
    </Card>
  );
}
