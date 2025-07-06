import React, { useContext } from "react";
import { Card, Row, Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTeachersContext } from "../../../context/TeachersContext";
import { useClassesContext } from "../../../context/ClassesContext";
import { useStudentsContext } from "../../../context/StudentsContext";

const { Option } = Select;

export default function PostsFilters({ filters, onFilterChange }) {
  const { teachers } = useTeachersContext();
  const { classes } = useClassesContext();
  const { students } = useStudentsContext();

  return (
    <Card title="Filters">
      <Row gutter={16}>
        <Col span={6}>
          <Input
            placeholder="Search posts..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            allowClear
          />
        </Col>
        <Col span={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="Filter by teacher"
            value={filters.teacherId}
            onChange={(value) => onFilterChange("teacherId", value)}
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            options={teachers}
          />
        </Col>
        <Col span={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="Filter by class"
            value={filters.classId}
            onChange={(value) => onFilterChange("classId", value)}
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            options={classes}
          />
        </Col>
        <Col span={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="Filter by student"
            value={filters.studentId}
            onChange={(value) => onFilterChange("studentId", value)}
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            options={students}
          />
        </Col>
      </Row>
    </Card>
  );
}
