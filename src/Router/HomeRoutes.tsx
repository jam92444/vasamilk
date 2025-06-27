import type { RouteObject } from "react-router-dom";
import { AdminRoute } from "./PrivateRoute";
import CustomerManagement from "../Screens/Home/User/CustomerManagement";
import AddUser from "../Screens/Home/User/AddUser";
import LayoutWrapper from "../Layout/LayoutWrapper";
import InventoryList from "../Components/Inventory/InventoryList";
import Inventory from "../Screens/Home/Inventory/Inventory";
import InventoryView from "../Screens/Home/Inventory/InventoryView";
import SlotMapping from "../Screens/Home/Inventory/SlotMapping";
// import Distributor from "../Screens/Home/Distributor/Distributor";

export const HomeRoutes: RouteObject[] | undefined = [
  {
    element: <AdminRoute />,
    children: [
      {
        element: <LayoutWrapper />,
        children: [
          {
            path: "/user",
            element: <CustomerManagement />,
          },
          {
            path: "/add-user",
            element: <AddUser />,
          },

          // inventory route
          {
            path: "/inventory",
            element: <Inventory />,
          },
          {
            path: `/inventory/view`,
            element: <InventoryView />,
          },

          {
            path: "/inventory-list",
            element: <InventoryList />,
          },
          {
            path: `/edit-user`,
            element: <AddUser />,
          },
          {
            path: `/inventory/slot`,
            element: <SlotMapping />,
          },

          // distributor rouutes
          // {
          //   path: `/distributor-list`,
          //   element: <Distributor />,
          // },
        ],
      },
    ],
  },
];
