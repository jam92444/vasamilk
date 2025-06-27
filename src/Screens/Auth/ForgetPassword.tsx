import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { forgetPassword } from "../../Services/ApiService";
import CustomInput from "../../Components/UI/CustomInput";
import CustomButton from "../../Components/UI/CustomButton";
import "../../Styles/pages/_login.scss";
import { useNavigate } from "react-router-dom";
import { getDecryptedCookie, setEncryptedCookie } from "../../Utils/cookies";
import { siteName } from "../../App";

// schema
const forgetPasswordSchema = Yup.object().shape({
  identifier: Yup.string()
    .test(
      "is-email-or-phone",
      "Enter a valid email or phone number",
      function (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?\d{10,14}$/; // Adjust pattern to your country format if needed
        return emailRegex.test(value!) || phoneRegex.test(value!);
      }
    )
    .required("Email or phone number is required"),
});

// interface
export interface ForgetTypes {
  identifier: string;
}

// initial values
const initialValues: ForgetTypes = {
  identifier: "",
};

const ForgetPassword: React.FC = () => {
  const navigate = useNavigate();
  const expiresInMinutes = 5;

  // 5 minutes
  const expirationDate = new Date(
    new Date().getTime() + expiresInMinutes * 60 * 1000
  );

  // handle forget pasword
  const handleForgetPassword = (values: ForgetTypes) => {
    const formData = new FormData();
    formData.append("email", values.identifier);
    forgetPassword(formData)
      .then((res) => {
        if (res.data.status === 0) {
          toast.error(res.data.msg);
        } else {
          toast.success("OTP sent!");
          console.log("reset key for OTP:", res.data.reset_key);
          setEncryptedCookie("reset_key", res.data.reset_key, {
            expires: expirationDate,
          });
          navigate("/otp-verfication", { state: { from: "forget-password" } });
        }
      })
      .catch((error: any) => {
        console.error(
          "OTP request error:",
          error.response?.data || error.message
        );
        toast.error("Failed to send OTP. Please try again.");
      });
  };

  const formik = useFormik<ForgetTypes>({
    initialValues,
    validationSchema: forgetPasswordSchema,
    onSubmit: handleForgetPassword,
  });

  const { values, errors, touched, handleChange, handleSubmit } = formik;

  return (
    <div className="login-page">
      <div className="login-section">
        <p>{siteName}</p>
        <h1>Forget Password</h1>

        <form onSubmit={handleSubmit}>
          <CustomInput
            label="Email or Phone"
            name="identifier"
            type="text"
            placeholder="Enter your email or phone number"
            value={values.identifier}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={errors.identifier}
            touched={touched.identifier}
          />

          <span className="forget-password">&lt; Go Back</span>

          <CustomButton htmlType="submit" text="Send OTP" />
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
