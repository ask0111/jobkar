"use client";

import { Form, Input, Button, Divider } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";

const ForgotPassword = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-left">
          <Link href={"/login"} className="back-link">
            <ArrowLeftOutlined /> Back to login
          </Link>
          <h2>Forgot your password?</h2>
          <p>Enter your email below to recover your password</p>
          <Form
            name="forgotPassword"
            onFinish={onFinish}
            layout="vertical"
            className="forgot-password-form"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="email-icon" />}
                placeholder="john.doe@gmail.com"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="">
                Send Email
              </Button>
            </Form.Item>
          </Form>
          {/* <Divider>Or login with</Divider> */}
          {/* <div className="social-buttons">
            <Button icon={<i className="fab fa-facebook-f"></i>} />
            <Button icon={<i className="fab fa-google"></i>} />
            <Button icon={<i className="fab fa-apple"></i>} />
          </div> */}
        </div>
        {/* <div className="forgot-password-right">
          <img
            src="/path/to/your/image.png"
            alt="Forgot Password Illustration"
          />
        </div> */}
      </div>
    </div>
  );
};

export default ForgotPassword;
