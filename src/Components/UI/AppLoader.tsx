import React from "react";
import { Spin } from "antd";
import "../../Styles/components/Spinner.scss";
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
        justifyContent: "center",
        alignItems: "center",
        height: fullScreen ? "100vh" : "100%",
        width: "100%",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <Spin tip={message} size={size} style={{ color: "blue" }} />
    </div>
  );
};

export default AppLoader;
