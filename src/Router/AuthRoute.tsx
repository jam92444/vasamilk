import type { RouteObject } from "react-router-dom";
import Login from "../Screens/Auth/Login";
import ForgetPassword from "../Screens/Auth/ForgetPassword";
import { FindResetKey, VerifyOTPSent } from "./PrivateRoute";
import OtpInput from "../Screens/Auth/OtpInput";
import ResetPassword from "../Screens/Auth/ResetPassword";

export const AuthRoutes: RouteObject[] | undefined = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "forget-password",
    element: <ForgetPassword />,
  },
  {
    element: <FindResetKey />,
    children: [
      {
        path: "otp-verfication",
        element: <OtpInput />,
      },
      {
        element: <VerifyOTPSent />,
        children: [
          {
            path: "reset-password",
            element: <ResetPassword />,
          },
        ],
      },
    ],
  },
];
