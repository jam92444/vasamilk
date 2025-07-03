import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { loginUser } from "../../Services/ApiService";
import { sha1 } from "js-sha1";
import CustomInput from "../../Components/UI/CustomInput";
import CustomButton from "../../Components/UI/CustomButton";
import "../../Styles/pages/_login.scss";
import { useNavigate } from "react-router-dom";
import { setEncryptedCookie } from "../../Utils/cookies";
import { siteName } from "../../App";
import { SALT_KEY } from "../../../public/config";
// schema
const loginSchema = Yup.object().shape({
  user_name: Yup.string()
    .matches(/^[a-zA-Z0-9_]{3,20}$/, "Invalid username")
    .required("Username is required"),
  password: Yup.string()
    .min(3, "Password must be at least 3 characters")
    .required("Password is required"),
});

// interface
export interface LoginValues {
  user_name: string;
  password: string;
  device_type: string;
}

// initial values
const initialValues: LoginValues = {
  user_name: "",
  password: "",
  device_type: "3",
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (values: LoginValues) => {
    const formData = new FormData();
    const auth_code = sha1(SALT_KEY + values.user_name);

    formData.append("user_name", values.user_name);
    formData.append("password", values.password);
    formData.append("auth_code", auth_code);
    formData.append("device_type", values.device_type);

    loginUser(formData)
      .then((response) => {
        setLoading(false);
        console.log("Login success:", response.data);
        if (response.data?.token) {
          const userData = {
            token: response.data.token,
            user_id: response.data.user_id,
            user_name: response.data.user_name,
            user_type: response.data.user_type,
            is_daily: response.data.is_daily,
            is_occasional: response.data.is_occasional,
          };

          setEncryptedCookie("user_token", userData, { expires: 365 });
          toast.success("Logged in successfully!");

          if (response.data.user_type === 1) {
            navigate("/user");
          } else if (response.data.user_type === 4) {
            navigate("/distributor-dashboard");
          } else {
            navigate("/");
          }
        } else {
          toast.error("Invalid credentials or missing token.");
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.error("Login error:", error.response?.data || error.message);
        toast.error("Login failed. Please try again.");
      });
  };

  const formik = useFormik<LoginValues>({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: handleLogin,
  });

  const { values, errors, touched, handleChange, handleSubmit } = formik;

  return (
    <div className="login-page">
      <>
        <div className="login-section">
          <p>{siteName}</p>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <CustomInput
              label="Username"
              name="user_name"
              type="text"
              placeholder="Enter your username"
              autoComplete="user_name"
              value={values.user_name}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              status={
                touched.user_name && errors.user_name ? "error" : undefined
              }
              error={errors.user_name}
              touched={touched.user_name}
            />

            <CustomInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              status={touched.password && errors.password ? "error" : undefined}
              error={errors.password}
              touched={touched.password}
            />

            <span
              onClick={() => navigate("/forget-password")}
              className="forget-password"
            >
              Forget password?
            </span>
            <CustomButton htmlType="submit" text="Log In" loading={loading} />
          </form>
        </div>
      </>
    </div>
  );
};

export default Login;
