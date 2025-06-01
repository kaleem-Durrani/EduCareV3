import React from "react";
import { Row, Col, Card, Statistic, Skeleton } from "antd";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaSchool,
  FaUserGraduate,
} from "react-icons/fa";

const StatsCards = ({ stats, loading }) => {
  const statsData = [
    {
      title: "Total Students",
      value: stats?.students.total || 0,
      icon: <FaUsers style={{ fontSize: "24px", color: "#1890ff" }} />,
      color: "#1890ff",
    },
    {
      title: "Total Teachers",
      value: stats?.teachers.total || 0,
      icon: (
        <FaChalkboardTeacher style={{ fontSize: "24px", color: "#52c41a" }} />
      ),
      color: "#52c41a",
    },
    {
      title: "Total Classes",
      value: stats?.classes.total || 0,
      icon: <FaSchool style={{ fontSize: "24px", color: "#722ed1" }} />,
      color: "#722ed1",
    },
    {
      title: "Total Parents",
      value: stats?.parents.total || 0,
      icon: <FaUserGraduate style={{ fontSize: "24px", color: "#fa8c16" }} />,
      color: "#fa8c16",
    },
  ];
  console.log(stats);

  return (
    <Row gutter={[16, 16]}>
      {statsData.map((stat, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card>
            {loading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards;
