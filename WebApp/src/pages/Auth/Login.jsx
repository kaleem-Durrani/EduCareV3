import React from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Typography,
  Row,
  Col,
  Space,
} from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useApiForm } from "../../hooks/useApi";

const { Title, Text } = Typography;
const { Option } = Select;

export default function Login() {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const { handleSubmit, loading } = useApiForm(
    ({ email, password, role }) => login(email, password, role),
    {
      onSuccess: () => {
        navigate("/dashboard");
      },
      form,
    }
  );

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", background: "#f0f2f5" }}
    >
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Card
          style={{
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <Title level={2} style={{ color: "#1890ff", marginBottom: 8 }}>
                EduCare
              </Title>
              <Text type="secondary">Sign in to your account</Text>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              initialValues={{
                role: "parent",
              }}
            >
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item
                name="role"
                label="Role"
                rules={[
                  {
                    required: true,
                    message: "Please select your role!",
                  },
                ]}
              >
                <Select placeholder="Select your role">
                  <Option value="parent">Parent</Option>
                  <Option value="teacher">Teacher</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<LoginOutlined />}
                  block
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: "center" }}>
              <Text type="secondary">
                Don't have an account?{" "}
                <Link to="/register" style={{ color: "#1890ff" }}>
                  Register here
                </Link>
              </Text>
            </div>
          </Space>
        </Card>
      </Col>
    </Row>
  );
}
