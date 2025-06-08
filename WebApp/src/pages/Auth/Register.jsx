import { useState } from "react";
import { Form, Input, Button, Typography, Alert } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BgImage from "../../assets/designlogin.jpg";

const { Title, Text } = Typography;

export default function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      await register({
        email: values.email,
        password: values.password,
        role: "admin",
      });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Registration Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md p-8 rounded-2xl bg-white register-form-container">
          <Title level={1} style={{ color: "#2c2143", marginBottom: 8 }}>
            Admin Register
          </Title>
          <Text
            style={{
              color: "#666",
              fontSize: "16px",
              display: "block",
              marginBottom: 32,
            }}
          >
            Create a new admin account.
          </Text>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
            />
          )}

          <Form
            form={form}
            name="register"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Email is required",
                },
                {
                  type: "email",
                  message: "Please enter a valid email!",
                },
              ]}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#7f56da";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(127, 86, 218, 0.1)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#d1d5db";
                  e.target.style.boxShadow = "none";
                  e.target.style.transform = "translateY(0px)";
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Password is required",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters!",
                },
              ]}
            >
              <Input.Password
                placeholder="Password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#7f56da";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(127, 86, 218, 0.1)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#d1d5db";
                  e.target.style.boxShadow = "none";
                  e.target.style.transform = "translateY(0px)";
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  backgroundColor: "#7f56da",
                  borderColor: "#7f56da",
                  height: "48px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(127, 86, 218, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#6645b8";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 8px 20px rgba(127, 86, 218, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#7f56da";
                  e.target.style.transform = "translateY(0px)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(127, 86, 218, 0.3)";
                }}
              >
                {loading ? "Creating account..." : "Register"}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center" }}>
            <Text style={{ fontSize: "14px", color: "#666" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#7f56da",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Sign in here
              </Link>
            </Text>
          </div>
        </div>
      </div>

      {/* Right Side - Background Image */}
      <div
        className="hidden md:block bg-cover bg-center bg-no-repeat relative overflow-hidden"
        style={{
          backgroundImage: `url(${BgImage})`,
          backgroundColor: "#f3f4f6",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {/* Overlay for better visual effect */}
        <div
          className="absolute inset-0 bg-gradient-to-l from-purple-500/20 to-transparent transition-opacity duration-300"
          style={{ opacity: 0 }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0";
          }}
        />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .register-form-container {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: float 6s ease-in-out infinite;
        }

        .register-form-container:hover {
          box-shadow: 0 25px 50px rgba(127, 86, 218, 0.25);
        }
      `}</style>
    </div>
  );
}
