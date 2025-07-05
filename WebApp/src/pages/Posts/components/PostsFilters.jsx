import React, { useContext } from "react";
import { Card, Row, Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { TeachersContext } from "../../../context/TeachersContext";
import { ClassesContext } from "../../../context/ClassesContext";
import { StudentsContext } from "../../../context/StudentsContext";

const { Option } = Select;

export default function PostsFilters({ filters, onFilterChange }) {
  const { teachers } = useContext(TeachersContext);
  const { classes } = useContext(ClassesContext);
  const { students } = useContext(StudentsContext);

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
          >
            {teachers?.map((teacher) => (
              <Option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </Option>
            ))}
          </Select>
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
          >
            {classes?.map((cls) => (
              <Option key={cls._id} value={cls._id}>
                {cls.name}
              </Option>
            ))}
          </Select>
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
          >
            {students?.map((student) => (
              <Option key={student._id} value={student._id}>
                {student.fullName}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Card>
  );
}
