import React, { useRef, useState, useEffect } from "react";
import CustomInput from "../../Components/UI/CustomInput";
import CustomButton from "../../Components/UI/CustomButton";
import { toast } from "react-toastify";
import { resendOTP, verifyOTP } from "../../Services/ApiService";
import { getDecryptedCookie, setEncryptedCookie } from "../../Utils/cookies";
import { useNavigate } from "react-router-dom";
import { siteName } from "../../App";
import "../../Styles/pages/_login.scss";
import "../../Styles/pages/_opt.scss";

const OtpInput: React.FC = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState<number>(0);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    setResendTimer(120);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reset_key = getDecryptedCookie("reset_key");

    const fullOtp = otp.join("");

    const formData = new FormData();
    formData.append("otp", fullOtp);
    formData.append("reset_key", reset_key);
    if (fullOtp.length === 6) {
      verifyOTP(formData).then((res) => {
        console.log(res);

        if (res.data.status === 0) {
          toast.error(res.data.msg);
        } else {
          toast.success(res.data.msg);
          setEncryptedCookie("reset_key", res.data.reset_key, {
            expires: new Date(Date.now() + 5 * 60 * 1000),
          });
          sessionStorage.setItem("OTPVerified", "verified");
          navigate("/reset-password");
        }
      });
    } else {
      toast.error("Please enter all 6 digits");
    }
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;

    const reset_key = getDecryptedCookie("reset_key");
    if (!reset_key) {
      toast.error("Reset key is missing or expired.");
      return;
    }

    console.log("reserKey for OTP", reset_key);
    const formData = new FormData();
    formData.append("reset_key", reset_key);

    resendOTP(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success("OTP resent successfully");
          setEncryptedCookie("reset_key", res.data.reset_key, {
            expires: new Date(Date.now() + 5 * 60 * 1000),
          });
          console.log("New reset key for reset-password:", res.data.reset_key);
          setResendTimer(120);
        } else {
          toast.error(res.data.msg || "Failed to resend OTP.");
        }
      })
      .catch((error) => {
        console.error("Resend OTP Error:", error.message);
        toast.error("Something went wrong. Please try again.");
      });
  };

  return (
    <div className="login-page">
      <form className="otp-form login-section" onSubmit={handleSubmit}>
        <p>{siteName}</p>
        <h1>OTP Verification</h1>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <CustomInput
              key={index}
              name={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              inputRef={(el) => (inputRefs.current[index] = el)}
              maxLength={1}
              className="otp-box"
            />
          ))}
        </div>

        <CustomButton htmlType="submit" text="Verify OTP" className="otpbtn" />

        <span
          className="resent-otp"
          style={{
            color: resendTimer > 0 ? "gray" : "#3ac3ff",
            cursor: resendTimer > 0 ? "not-allowed" : "pointer",
            marginTop: "1rem",
            display: "block",
          }}
          onClick={handleResendOtp}
        >
          {resendTimer > 0
            ? `Resend OTP in ${Math.floor(resendTimer / 60)
                .toString()
                .padStart(2, "0")}:${(resendTimer % 60)
                .toString()
                .padStart(2, "0")}`
            : "Resend OTP"}
        </span>
      </form>
    </div>
  );
};

export default OtpInput;
