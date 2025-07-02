import { createHashRouter } from "react-router-dom";
import { AuthRoute, HomePrivateRoute } from "./PrivateRoute";
import { AuthRoutes } from "./AuthRoute";
import { HomeRoutes } from "./HomeRoutes";
import PageNotFound from "../Screens/Auth/PageNotFound";

export const router = createHashRouter([
  {
    //authentication
    element: <AuthRoute />,
    children: AuthRoutes,
  },
  {
    element: <HomePrivateRoute />,
    children: HomeRoutes,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
