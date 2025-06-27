import { Outlet } from "react-router-dom";
import MainLayout from "./SideBar";

const LayoutWrapper = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default LayoutWrapper;
