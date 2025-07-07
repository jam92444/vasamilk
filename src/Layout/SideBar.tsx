import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Layout, Menu, Grid, Modal } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "../Styles/main.scss";
import asset from "../Utils/asset";
import { clearCookie } from "../Utils/cookies";
import { logout } from "../Services/ApiService";
import { toast } from "react-toastify";
import { getUserData, getUserToken } from "../Utils/Data";

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

const menuConfig: {
  item: MenuItem;
  allowedUserTypes: number[];
}[] = [
  {
    item: getItem(
      "Masters", // label
      "masters", // key (string unique id)
      <img src={asset.masters} width={18} alt="User" />, // icon
      [
        // children (submenus)
        getItem("Slot Management", "masters/slot"),
        getItem("Price Tag Management", "masters/pricetag"),
        getItem("Line Management", "masters/line"),
        getItem("Reason Management", "masters/reason"),
      ]
    ),
    allowedUserTypes: [1, 2],
  },
  {
    item: getItem(
      "User",
      "user",
      <img src={asset.user} width={18} alt="User" />
    ),
    allowedUserTypes: [1, 2],
  },
  {
    item: getItem(
      "Inventory",
      "inventory",
      <img src={asset.inventory} width={18} alt="Inventory" />
    ),
    allowedUserTypes: [1, 2],
  },
  {
    item: getItem(
      "Distributor",
      "distributor-list",
      <img src={asset.distributor} width={20} alt="Distributor" />
    ),
    allowedUserTypes: [1, 2],
  },
  {
    item: getItem(
      "Dashboard",
      "distributor-dashboard",
      <img src={asset.inventory} width={20} alt="Distributor Dashboard" />
    ),
    allowedUserTypes: [4],
  },
  {
    item: getItem(
      "Place Order",
      "place-order",
      <img src={asset.orderIcon} width={20} alt="Distributor Dashboard" />
    ),
    allowedUserTypes: [1, 2, 3],
  },
  {
    item: getItem(
      "Logout",
      "logout",
      <img src={asset.logout} width={18} alt="Logout" />
    ),
    allowedUserTypes: [1, 2, 3, 4],
  },
];

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();

  const userType = getUserData()?.user_type;

  const menuItems: MenuItem[] = menuConfig
    .filter(({ allowedUserTypes }) => allowedUserTypes.includes(userType))
    .map(({ item }) => item);

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
        if (!getUserToken()) return;

        const formData = new FormData();
        formData.append("token", getUserToken());

        logout(formData)
          .then((res) => {
            if (res.data.status === 1) {
              toast.success(res.data.msg);
              clearCookie("user_token");
              localStorage.removeItem("user_data");
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
