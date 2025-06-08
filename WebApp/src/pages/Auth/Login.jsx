import { useState } from "react";
import { Form, Input, Button, Typography, Alert, Checkbox } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import BgImage from "../../assets/designlogin.jpg";

const { Title, Text } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      await login(values.email, values.password, "admin");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await login("guest@admin.com", "guestpassword", "admin");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Guest login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md p-8 rounded-2xl bg-white login-form-container">
          <Title level={1} style={{ color: "#2c2143", marginBottom: 8 }}>
            Admin Login
          </Title>
          <Text
            style={{
              color: "#666",
              fontSize: "16px",
              display: "block",
              marginBottom: 32,
            }}
          >
            Welcome back! Please enter your details
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
            name="login"
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

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Checkbox>
                <Text style={{ fontSize: "14px", color: "#666" }}>
                  Remember me
                </Text>
              </Checkbox>
              <Link
                to="#"
                style={{
                  fontSize: "14px",
                  color: "#7f56da",
                  textDecoration: "none",
                }}
              >
                Forgot password?
              </Link>
            </div>

            <Form.Item style={{ marginBottom: 16 }}>
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
                {loading ? "Signing in..." : "Login"}
              </Button>
            </Form.Item>

            <Form.Item style={{ marginBottom: 24 }}>
              <Button
                type="default"
                onClick={handleGuestLogin}
                loading={loading}
                block
                style={{
                  height: "48px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderColor: "#7f56da",
                  color: "#7f56da",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(127, 86, 218, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#7f56da";
                  e.target.style.color = "white";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 6px 16px rgba(127, 86, 218, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#7f56da";
                  e.target.style.transform = "translateY(0px)";
                  e.target.style.boxShadow =
                    "0 2px 8px rgba(127, 86, 218, 0.1)";
                }}
              >
                Login as Guest
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center" }}>
            <Text style={{ fontSize: "14px", color: "#666" }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#7f56da",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Sign up
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

        .login-form-container {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: float 6s ease-in-out infinite;
        }

        .login-form-container:hover {
          box-shadow: 0 25px 50px rgba(127, 86, 218, 0.25);
        }
      `}</style>
    </div>
  );
}
