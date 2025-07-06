"use client";

import { Form, Input, Button, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const ResetPassword = () => {
  const onFinish = (values) => {
    console.log("Received values:", values);
  };

  return (
    <div className="set-password-container">
      <div className="set-password-content">
        <img
          src="/assets/logo.png"
          alt="Your Logo"
          className="logo"
          width={25}
        />
        <Typography.Title level={2}>Set a password</Typography.Title>
        <Typography.Paragraph>
          Please enter your new password to access your account.
        </Typography.Paragraph>
        <Form
          name="set_password"
          layout="vertical"
          onFinish={onFinish}
          className="set-password-form"
        >
          <Form.Item
            name="password"
            label="Create Password"
            rules={[
              { required: true, message: "Please enter your new password" },
            ]}
          >
            <Input.Password
              placeholder="Create Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label="Re-enter Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Re-enter Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="submit-button">
              Set password
            </Button>
          </Form.Item>
        </Form>
      </div>
      {/* <div className="set-password-image">
        <img
          src="path-to-your-image.png"
          alt="Set password visual"
          className="illustration"
        />
      </div> */}
    </div>
  );
};

export default ResetPassword;
