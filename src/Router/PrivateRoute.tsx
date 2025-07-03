// src/routes/authRoutes.ts
import { Navigate, Outlet } from "react-router-dom";
import { getDecryptedCookie } from "../Utils/cookies";
import { useUserDetails } from "../Utils/Data";

// Guard for login and auth pages
export const AuthRoute = () => {
  const { token, userDetails } = useUserDetails();

  if (!token) {
    return <Outlet />;
  }

  // Redirect logged-in users based on role
  switch (userDetails.user_type) {
    case 1:
      return <Navigate to="/user" />;
    case 4:
      return <Navigate to="/distributor" />;
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
  const { userDetails } = useUserDetails();
  return userDetails ? <Outlet /> : <Navigate to={"/"} />;
};

//Admin Route access
export const AdminRoute = () => {
  const { userDetails } = useUserDetails();

  if (!userDetails) return null;

  return userDetails.user_type === 1 ? <Outlet /> : <Navigate to="/" replace />;
};
export const DistributorRoute = () => {
  const { userDetails } = useUserDetails();

  if (!userDetails) return null;

  return userDetails.user_type === 4 ? <Outlet /> : <Navigate to="/" replace />;
};
