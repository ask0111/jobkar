"use client";
import { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import Link from "next/link";
import { useAuthContext } from "../../../hooks/auth/useAuthContext";
import Loader from "../../components/Loader";
import { useRouter } from "next/navigation";
import Footer from "../../components/Footer"
function Login({ setIsLogin }) {
  const [errMsg, setErrMsg] = useState("");
  const { login, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");

    if (token) {
      router.replace("/");
    }
  }, []);

 const onFinish = async (values) => {
  try {
    await login(values.email, values.password);
    router.push("/"); // Redirect after successful login
  } catch (error) {
    console.error("Error logging in:", error);
    setErrMsg("Login failed. Please check your credentials.");
  }
};


  if (isLoading) return <Loader />;

  return (
    <>
    <div className="flex min-h-screen">
      {/* Right Side - Form */}
      <div className="flex flex-col justify-center items-center bg-white w-full px-4">
        <div className="px-8 sm:px-16 py-10 w-full max-w-xl shadow-lg rounded-3xl border border-gray-200">
          <div className="flex items-center mb-4">
            <img src="/assets/logo.png" alt="Logo" className="h-12" />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
          <p className="text-gray-500 mb-4">Login to access your account</p>

          <Form
            name="login-form"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="you@example.com" size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" size="large" />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            {errMsg.length > 0 && (
              <p className="text-red-500 text-sm mb-2">{errMsg}</p>
            )}

            <div className="flex justify-between items-center mt-2">
              <Button
                type="primary"
                htmlType="submit"
                className="h-8 text-base"
              >
                Login
              </Button>
              <Link href="/forgotpassword" className="text-blue-500 text-sm">
                Forgot Password?
              </Link>
            </div>
          </Form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default Login;
