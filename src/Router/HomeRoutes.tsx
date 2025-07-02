import type { RouteObject } from "react-router-dom";
import { AdminRoute } from "./PrivateRoute";
import CustomerManagement from "../Screens/Home/User/CustomerManagement";
import LayoutWrapper from "../Layout/LayoutWrapper";
import InventoryList from "../Screens/Home/Inventory/InventoryList";
import Inventory from "../Screens/Home/Inventory/Inventory";
import InventoryView from "../Screens/Home/Inventory/InventoryView";
import SlotMapping from "../Screens/Home/Inventory/SlotMapping";
import Distributor from "../Screens/Home/Distributor/Distributor";
import ListAssignedSlot from "../Screens/Home/Distributor/ListAssignedSlot";
import AssignRoute from "../Screens/Home/Distributor/AssignRoute";
import AddUser from "../Screens/Home/User/AddUser";
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
          {
            path: `/distributor-list`,
            element: <Distributor />,
          },
          {
            path: `/route-details`,
            element: <ListAssignedSlot />,
          },
          {
            path: `/distributor-list/assign-route`,
            element: <AssignRoute />,
          },
        ],
      },
    ],
  },
];
