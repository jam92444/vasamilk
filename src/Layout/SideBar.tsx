import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Layout, Menu, Grid, Modal } from "antd";
import { useNavigate, useLocation } from "react-router-dom"; // import useLocation
import "../Styles/main.scss";
import asset from "../Utils/asset";
import { clearCookie, getDecryptedCookie } from "../Utils/cookies";
import { logout } from "../Services/ApiService";
import { toast } from "react-toastify";

const { Content, Sider } = Layout;
const { useBreakpoint } = Grid;

type MenuItem = Required<MenuProps>["items"][number];

interface LayoutProps {
  children: React.ReactNode;
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const menuItems: MenuItem[] = [
  getItem("User", "user", <img src={asset.user} width={18} alt="User" />),
  getItem(
    "Inventory",
    "inventory",
    <img src={asset.inventory} width={18} alt="Inventory" />
  ),
  getItem(
    "Distributor",
    "distributor-list",
    <img src={asset.distributor} width={20} alt="Inventory" />
  ),
  getItem(
    "Logout",
    "logout",
    <img src={asset.logout} width={18} alt="Logout" />
  ),
];

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the current path without leading slash to match keys
  const currentKey = location.pathname.startsWith("/")
    ? location.pathname.slice(1)
    : location.pathname;

  const handleLogout = () => {
    Modal.confirm({
      title: "Are you sure you want to log out?",
      okText: "Yes, Logout",
      cancelText: "Cancel",
      okType: "danger",
      onOk: () => {
        const user = getDecryptedCookie("user_token");
        if (!user?.token) return;

        const formData = new FormData();
        formData.append("token", user.token);

        logout(formData)
          .then((res) => {
            if (res.data.status === 1) {
              toast.success(res.data.msg);
              clearCookie("user_token");
              navigate("/");
            } else {
              toast.error("Logout failed. Please try again.");
            }
          })
          .catch((error) => {
            console.error("Logout error:", error);
            toast.error("Something went wrong during logout.");
          });
      },
    });
  };

  return (
    <Layout className="main-layout">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="md"
        collapsedWidth={screens.xs ? 0 : 80}
        className="main-layout__sider"
      >
        <div className="main-layout__logo">VASAMILK</div>
        <Menu
          mode="inline"
          selectedKeys={[currentKey]}
          items={menuItems}
          onClick={({ key }) => {
            if (key === "logout") {
              handleLogout();
            } else {
              // navigate to selected route
              navigate(`/${key}`);
            }
          }}
          className="main-layout__menu"
        />
      </Sider>

      <Layout>
        <Content className="main-layout__content">
          <div className="main-layout__content-container">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
