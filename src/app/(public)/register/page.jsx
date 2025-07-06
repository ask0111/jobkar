"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import Footer from "../../components/Footer"

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [roleDescription, setRoleDescription] = useState("");
  const [errors, setErrors] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  // Form field values
  const [values, setValues] = useState({
    role_id: "",
    country: "",
    state: "",
    city: "",
    gender: "",
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    psw_repeat: "",
    agreement: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");

    if (token) {
      router.replace("/");
    }
  }, []);

  const handleRoleChange = (value) => {
    setValues({ ...values, role_id: value });
    switch (value) {
      case "4":
        setRoleDescription(
          "Personal: Actively looking for jobs and exploring job opportunities."
        );
        break;
      case "3":
        setRoleDescription(
          "Human Resource: Handles company applicants, posts job listings, and manages the recruitment process."
        );
        break;
      case "5":
        setRoleDescription(
          "Chairman: Company Administrator, registers and manages companies, oversees recruiters, and handles human resources activities."
        );
        break;
      default:
        setRoleDescription("");
    }
  };

  const handleInputChange = (name, value) => {
    setValues({ ...values, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};

    if (stepIndex === 0) {
      if (!values.role_id) {
        newErrors.role_id = "Please select your role!";
      }
    }

    if (stepIndex === 1) {
      if (!values.country) newErrors.country = "Please input your country!";
      if (!values.state) newErrors.state = "Please input your state!";
      if (!values.city) newErrors.city = "Please input your city!";
      if (!values.gender) newErrors.gender = "Please select your gender!";
    }

    if (stepIndex === 2) {
      if (!values.name) newErrors.name = "Please input your first name!";
      if (!values.lastName) newErrors.lastName = "Please input your last name!";
      if (!values.email) newErrors.email = "Please input your email!";
      if (!values.phone) newErrors.phone = "Please input your phone no!";
      if (!values.password) newErrors.password = "Please input your password!";
      if (!values.psw_repeat)
        newErrors.psw_repeat = "Please confirm your password!";
      if (
        values.password &&
        values.psw_repeat &&
        values.password !== values.psw_repeat
      ) {
        newErrors.psw_repeat = "The two passwords do not match!";
      }
      if (!values.agreement) newErrors.agreement = "Should accept agreement";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onFinish = async () => {
    console.log("Success:", values);

    if (!validateStep(2)) return;

    const fullFormData = { ...formData, ...values };
    const formDataObj = new FormData();
    for (const key in fullFormData) {
      formDataObj.append(key, fullFormData[key]);
    }

    try {
      // Replace with your actual API call
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registration`,
        {
          method: "POST",
          body: JSON.stringify(fullFormData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("Response:", data);
      if (data?.status !== "error") {
        enqueueSnackbar(data?.msg, { variant: "success" });
        console.log("Success:", data?.msg);
        router.push("/login");
      } else {
        enqueueSnackbar(data?.errors?.email[0], { variant: "error" });
        console.log("Error:", data?.errors?.email[0]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const next = () => {
    if (validateStep(currentStep)) {
      setFormData((prevData) => ({ ...prevData, ...values }));
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: "Role Setup",
      content: (
        <>
          <div style={{ marginTop: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              Role *
            </label>
            <select
              value={values.role_id}
              onChange={(e) => handleRoleChange(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: errors.role_id
                  ? "1px solid #ff4d4f"
                  : "1px solid #d9d9d9",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              <option value="">Select your role</option>
              <option value="4">Personal</option>
              <option value="3">Human Resource</option>
              <option value="5">Chairman</option>
            </select>
            {errors.role_id && (
              <div
                style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}
              >
                {errors.role_id}
              </div>
            )}
            {roleDescription && (
              <div
                style={{ color: "#666", fontSize: "12px", marginTop: "8px" }}
              >
                {roleDescription}
              </div>
            )}
          </div>
        </>
      ),
    },
    {
      title: "Location Details",
      content: (
        <>
          <div className="field-wrapper" style={{ marginTop: "1.5rem" }}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Country *
              </label>
              <input
                type="text"
                placeholder="India"
                value={values.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: errors.country
                    ? "1px solid #ff4d4f"
                    : "1px solid #d9d9d9",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {errors.country && (
                <div
                  style={{
                    color: "#ff4d4f",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.country}
                </div>
              )}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                State *
              </label>
              <input
                type="text"
                placeholder="Uttar Pradesh"
                value={values.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: errors.state
                    ? "1px solid #ff4d4f"
                    : "1px solid #d9d9d9",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {errors.state && (
                <div
                  style={{
                    color: "#ff4d4f",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.state}
                </div>
              )}
            </div>
          </div>
          <div style={{ marginBottom: "16px", paddingRight: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              City *
            </label>
            <input
              type="text"
              placeholder="Noida"
              value={values.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: errors.city ? "1px solid #ff4d4f" : "1px solid #d9d9d9",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
            {errors.city && (
              <div
                style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}
              >
                {errors.city}
              </div>
            )}
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              Please select your gender *
            </label>
            <div style={{ display: "flex", gap: "16px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="gender"
                  value="1"
                  checked={values.gender === "1"}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                />
                Male
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="gender"
                  value="2"
                  checked={values.gender === "2"}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                />
                Female
              </label>
            </div>
            {errors.gender && (
              <div
                style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}
              >
                {errors.gender}
              </div>
            )}
          </div>
        </>
      ),
    },
    {
      title: "Account Setup",
      content: (
        <>
          <div className="field-wrapper" style={{ marginTop: "1.5rem" }}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                First Name *
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={values.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: errors.name
                    ? "1px solid #ff4d4f"
                    : "1px solid #d9d9d9",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {errors.name && (
                <div
                  style={{
                    color: "#ff4d4f",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.name}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Last Name *
              </label>
              <input
                type="text"
                placeholder="Doe"
                value={values.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: errors.lastName
                    ? "1px solid #ff4d4f"
                    : "1px solid #d9d9d9",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {errors.lastName && (
                <div
                  style={{
                    color: "#ff4d4f",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.lastName}
                </div>
              )}
            </div>
          </div>
          <div className="field-wrapper">
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Email *
              </label>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                value={values.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: errors.email
                    ? "1px solid #ff4d4f"
                    : "1px solid #d9d9d9",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {errors.email && (
                <div
                  style={{
                    color: "#ff4d4f",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.email}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Mobile No *
              </label>
              <input
                type="tel"
                placeholder="9876543210"
                value={values.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: errors.phone
                    ? "1px solid #ff4d4f"
                    : "1px solid #d9d9d9",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {errors.phone && (
                <div
                  style={{
                    color: "#ff4d4f",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.phone}
                </div>
              )}
            </div>
          </div>
          <div className="field-wrapper">
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Password *
              </label>
              <input
                type="password"
                placeholder="Password"
                value={values.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: errors.password
                    ? "1px solid #ff4d4f"
                    : "1px solid #d9d9d9",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {errors.password && (
                <div
                  style={{
                    color: "#ff4d4f",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.password}
                </div>
              )}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Confirm Password *
              </label>
              <input
                type="password"
                placeholder="Password"
                value={values.psw_repeat}
                onChange={(e) =>
                  handleInputChange("psw_repeat", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: errors.psw_repeat
                    ? "1px solid #ff4d4f"
                    : "1px solid #d9d9d9",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              {errors.psw_repeat && (
                <div
                  style={{
                    color: "#ff4d4f",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.psw_repeat}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                flexWrap: "wrap",
              }}
            >
              <input
                type="checkbox"
                checked={values.agreement}
                onChange={(e) =>
                  handleInputChange("agreement", e.target.checked)
                }
              />
              I agree to all the <Link href={"/terms-condition"}>Terms</Link>{" "}
              and <Link href={"/privacy-policy"}>Privacy Policy</Link>
            </label>
            {errors.agreement && (
              <div
                style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}
              >
                {errors.agreement}
              </div>
            )}
          </div>
        </>
      ),
    },
  ];

  // Custom Steps component
  const CustomSteps = ({ current, steps }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "2rem",
        marginTop: "2rem",
      }}
    >
      {steps.map((step, index) => (
        <div key={step.title} style={{ flex: 1, textAlign: "center" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: index <= current ? "#1890ff" : "#f0f0f0",
              color: index <= current ? "white" : "#999",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {index >= current ? `${index + 1}` : <Check />}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: index <= current ? "#1890ff" : "#999",
              fontWeight: index === current ? "500" : "normal",
            }}
          >
            {step.title}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
    <div className="signup-container">
      <div className="signup-box max-w-2xl">
        <div className="signup-form">
          <img src="/assets/logo.png" alt="Your Logo" className="logo" />
          <h2>Sign up</h2>
          <p>
            Let&apos;s get you all set up so you can access your personal
            account
          </p>

          <CustomSteps current={currentStep} steps={steps} />

          <div onSubmit={onFinish}>
            {steps[currentStep].content}

            <div
              className="form-navigation"
              style={{ marginTop: "2rem", display: "flex", gap: "8px" }}
            >
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={prev}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "6px",
                    backgroundColor: "white",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Previous
                </button>
              )}
              {currentStep < steps.length - 1 && (
                <button
                  type="button"
                  onClick={next}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #1890ff",
                    borderRadius: "6px",
                    backgroundColor: "#1890ff",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Next
                </button>
              )}
              {currentStep === steps.length - 1 && (
                <button
                  type="button"
                  onClick={onFinish}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #1890ff",
                    borderRadius: "6px",
                    backgroundColor: "#1890ff",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Create account
                </button>
              )}
            </div>
          </div>

          <div className="login-link">
            <p>
              Already have an account? <Link href={"/login"}>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default SignUp;
