import React from "react";
import { Button } from "antd";
import "../../Styles/components/UI/CustomButton.scss";

import type { ButtonProps } from "antd";

export interface CustomButtonProps extends ButtonProps {
  text: string; // required
  onClick?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onClick,
  block = false,
  disabled = false,
  loading = false,
  icon,
  htmlType = "button",
  className = "",
  ...rest
}) => {
  return (
    <Button
      block={block}
      disabled={disabled}
      loading={loading}
      icon={icon}
      htmlType={htmlType}
      className={`custom-button ${className}`}
      onClick={onClick}
      {...rest}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
