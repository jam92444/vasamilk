import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { resetPassword } from "../../Services/ApiService";
import CustomInput from "../../Components/UI/CustomInput";
import CustomButton from "../../Components/UI/CustomButton";
import "../../Styles/pages/_login.scss";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getDecryptedCookie, clearCookie } from "../../Utils/cookies";
import { siteName } from "../../App";
import { useAuth } from "../../Context/AuthContext";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

// Validation schema
const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Must be at least 8 characters")
    .matches(/[A-Z]/, "Must include at least one uppercase letter")
    .matches(/[a-z]/, "Must include at least one lowercase letter")
    .matches(/[0-9]/, "Must include at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must include at least one special character"
    ),

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

// Types
interface ResetTypes {
  password: string;
  confirmPassword: string;
}

// Initial values
const initialValues: ResetTypes = {
  password: "",
  confirmPassword: "",
};

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userDetails } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (isAuthenticated) {
    return (
      <Navigate to={userDetails?.user_type === 1 ? "/admin-dashboard" : "/"} />
    );
  }

  if (location.state?.from !== "otp-verification") {
    return <Navigate to="/" />;
  }

  const handleResetPassword = (values: ResetTypes) => {
    const reset_key = getDecryptedCookie("reset_key");
    sessionStorage.removeItem("OTPVerified");

    if (!reset_key) {
      toast.error("Reset session expired. Please request a new OTP.");
      navigate("/forget-password");
      return;
    }

    const formData = new FormData();
    formData.append("reset_key", reset_key);
    formData.append("new_password", values.password);

    resetPassword(formData)
      .then((res) => {
        if (res.data.status === 0) {
          toast.error(res.data.msg);
        } else {
          toast.success(res.data.msg || "Password reset successful!");
          clearCookie("reset_key");
          navigate("/");
        }
      })
      .catch((error: any) => {
        console.error("Reset error:", error.response?.data || error.message);
        toast.error("Failed to reset password. Please try again.");
      });
  };

  const formik = useFormik<ResetTypes>({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: handleResetPassword,
  });

  const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
    formik;

  return (
    <div className="login-page">
      <div className="login-section">
        <p>{siteName}</p>
        <h1>Reset Password</h1>

        <form onSubmit={handleSubmit}>
          <CustomInput
            label="New Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new strong password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            touched={touched.password}
            suffix={
              showPassword ? (
                <EyeInvisibleOutlined onClick={() => setShowPassword(false)} />
              ) : (
                <EyeTwoTone onClick={() => setShowPassword(true)} />
              )
            }
          />

          <CustomInput
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm your new password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
            suffix={
              showConfirm ? (
                <EyeInvisibleOutlined onClick={() => setShowConfirm(false)} />
              ) : (
                <EyeTwoTone onClick={() => setShowConfirm(true)} />
              )
            }
          />

          <CustomButton htmlType="submit" text="Reset Password" />
          <span className="hint-text">
            Must include 1 uppercase, 1 lowercase, 1 number, 1 special character
          </span>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
