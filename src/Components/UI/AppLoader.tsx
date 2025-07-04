import React from "react";
import { Spin } from "antd";

interface AppLoaderProps {
  message?: string;
  size?: "small" | "default" | "large";
  fullScreen?: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({
  message = "Loading...",
  size = "large",
  fullScreen = true,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: fullScreen ? "100vh" : "100%",
        width: "100%",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <Spin size={size} />
      <div style={{ marginTop: 10, color: "#1890ff", fontSize: "14px" }}>
        {message}
      </div>
    </div>
  );
};

export default AppLoader;
