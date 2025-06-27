// src/routes/authRoutes.ts
import { Navigate, Outlet } from "react-router-dom";
import { getDecryptedCookie } from "../Utils/cookies";

// Guard for login and auth pages
export const AuthRoute = () => {
  const userdata = getDecryptedCookie("user_token");

  if (!userdata) {
    return <Outlet />;
  }

  // Redirect logged-in users based on role
  switch (userdata.user_type) {
    case 1:
      return <Navigate to="/user" />;
    case 2:
      return <Navigate to="/vendor/dashboard" />;
    case 3:
      return <Navigate to="/user-dashboard" />;
    default:
      return <Navigate to="/" />;
  }
};

// Guard for checking reset key presence
export const FindResetKey = () => {
  const resetKey = getDecryptedCookie("reset_key");
  return resetKey ? <Outlet /> : <Navigate to="/forget-password" />;
};

// Guard for checking OTP verification
export const VerifyOTPSent = () => {
  const otpVerified = sessionStorage.getItem("OTPVerified");
  return otpVerified ? <Outlet /> : <Navigate to="/otp-verfication" />;
};

// Authenticating according to user
export const HomePrivateRoute = () => {
  const userData = getDecryptedCookie("user_token");
  return userData ? <Outlet /> : <Navigate to={"/"} />;
};

//Admin Route access
export const AdminRoute = () => {
  const userData = getDecryptedCookie("user_token").user_type;
  return userData === 1 ? <Outlet /> : <Navigate to={"/"} />;
};
