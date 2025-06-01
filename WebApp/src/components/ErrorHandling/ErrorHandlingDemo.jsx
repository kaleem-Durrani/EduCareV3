import React from "react";
import { Card, Button, Space, Typography, Divider, Form, Input } from "antd";
import useApi from "../../hooks/useApi";
import useApiForm from "../../hooks/useApiForm";
import {
  ERROR_DISPLAY_TYPES,
  handleApiError,
  getErrorInfo,
} from "../../utils/errorHandler";

const { Title, Paragraph, Text } = Typography;

/**
 * Demo component showing different error handling approaches
 * This is for documentation/testing purposes
 */
export default function ErrorHandlingDemo() {
  // Example 1: Default error handling (shows message toast)
  const { request: defaultRequest, isLoading: loading1 } = useApi(() =>
    Promise.reject({
      response: {
        status: 400,
        data: { errors: [{ field: "email", message: "Email is required" }] },
      },
    })
  );

  // Example 2: Notification-style error handling
  const { request: notificationRequest, isLoading: loading2 } = useApi(
    () =>
      Promise.reject({
        response: {
          status: 400,
          data: {
            errors: [
              { field: "name", message: "Name must be at least 3 characters" },
            ],
          },
        },
      }),
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        title: "Validation Failed",
        showValidationDetails: true,
      },
    }
  );

  // Example 3: Silent error handling (no automatic display)
  const {
    request: silentRequest,
    isLoading: loading3,
    errorInfo,
  } = useApi(
    () =>
      Promise.reject({
        response: { status: 500, data: { message: "Server error" } },
      }),
    {
      errorHandling: {
        displayType: ERROR_DISPLAY_TYPES.RETURN,
      },
    }
  );

  // Example 4: Form-specific error handling
  const {
    form,
    submitForm,
    isLoading: loading4,
  } = useApiForm(() =>
    Promise.reject({
      response: {
        status: 400,
        data: {
          errors: [
            { field: "email", message: "Email is already taken" },
            {
              field: "password",
              message: "Password must be at least 8 characters",
            },
          ],
        },
      },
    })
  );

  // Example 5: Manual error handling
  const handleManualError = async () => {
    try {
      // Simulate API call
      throw {
        response: {
          status: 400,
          data: { errors: [{ message: "Custom validation error" }] },
        },
      };
    } catch (error) {
      // Manual error handling with custom options
      handleApiError(error, {
        displayType: ERROR_DISPLAY_TYPES.NOTIFICATION,
        title: "Custom Error Handler",
        showValidationDetails: true,
        customMessage: "This is a custom error message",
      });
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px" }}>
      <Title level={2}>Error Handling System Demo</Title>
      <Paragraph>
        This demo shows different approaches to handling API errors with
        validation details.
      </Paragraph>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Example 1: Default Message */}
        <Card title="1. Default Error Handling (Message Toast)">
          <Paragraph>
            <Text>
              Shows validation errors in a message toast with details.
            </Text>
          </Paragraph>
          <Button
            type="primary"
            onClick={() => defaultRequest().catch(() => {})}
            loading={loading1}
          >
            Trigger Default Error
          </Button>
        </Card>

        {/* Example 2: Notification */}
        <Card title="2. Notification Error Handling">
          <Paragraph>
            <Text>
              Shows validation errors in a detailed notification popup.
            </Text>
          </Paragraph>
          <Button
            type="primary"
            onClick={() => notificationRequest().catch(() => {})}
            loading={loading2}
          >
            Trigger Notification Error
          </Button>
        </Card>

        {/* Example 3: Silent */}
        <Card title="3. Silent Error Handling">
          <Paragraph>
            <Text>
              Errors are captured but not automatically displayed. Check
              console.
            </Text>
          </Paragraph>
          <Button
            type="primary"
            onClick={() => silentRequest().catch(() => {})}
            loading={loading3}
          >
            Trigger Silent Error
          </Button>
          {errorInfo && (
            <div
              style={{
                marginTop: 8,
                padding: 8,
                backgroundColor: "#fff2f0",
                border: "1px solid #ffccc7",
              }}
            >
              <Text strong>Captured Error:</Text> {errorInfo.message}
            </div>
          )}
        </Card>

        {/* Example 4: Form Handling */}
        <Card title="4. Form Error Handling">
          <Paragraph>
            <Text>
              Automatically sets field-specific errors on form inputs.
            </Text>
          </Paragraph>
          <Form form={form} layout="vertical">
            <Form.Item name="email" label="Email">
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <Input.Password placeholder="Enter password" />
            </Form.Item>
            <Button
              type="primary"
              onClick={() => submitForm().catch(() => {})}
              loading={loading4}
            >
              Submit Form (Will Fail)
            </Button>
          </Form>
        </Card>

        {/* Example 5: Manual */}
        <Card title="5. Manual Error Handling">
          <Paragraph>
            <Text>
              Custom error handling with full control over display options.
            </Text>
          </Paragraph>
          <Button type="primary" onClick={handleManualError}>
            Trigger Manual Error
          </Button>
        </Card>

        <Divider />

        <Card title="Error Handling Configuration Options">
          <Paragraph>
            <Text strong>Available Display Types:</Text>
          </Paragraph>
          <ul>
            <li>
              <Text code>MESSAGE</Text> - Ant Design message toast (default)
            </li>
            <li>
              <Text code>NOTIFICATION</Text> - Ant Design notification popup
            </li>
            <li>
              <Text code>CONSOLE</Text> - Console logging only
            </li>
            <li>
              <Text code>RETURN</Text> - Silent, returns error info for manual
              handling
            </li>
          </ul>

          <Paragraph style={{ marginTop: 16 }}>
            <Text strong>Configuration Options:</Text>
          </Paragraph>
          <ul>
            <li>
              <Text code>showValidationDetails</Text> - Show detailed validation
              errors
            </li>
            <li>
              <Text code>title</Text> - Custom title for notifications
            </li>
            <li>
              <Text code>customMessage</Text> - Override default error message
            </li>
            <li>
              <Text code>duration</Text> - How long to show the error
            </li>
            <li>
              <Text code>onError</Text> - Custom callback function
            </li>
          </ul>
        </Card>
      </Space>
    </div>
  );
}
