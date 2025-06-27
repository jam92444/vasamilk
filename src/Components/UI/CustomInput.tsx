import React from "react";
import { Input } from "antd";
import type { InputProps } from "antd";
import "../../Styles/components/UI/CustomInput.scss";

export interface CustomInputProps extends InputProps {
  label?: string;
  required?: boolean;
  className?: string;
  inputRef?: (instance: HTMLInputElement | null) => void;
  error?: string | false | undefined;
  touched?: boolean;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      error,
      touched,
      required = false,
      className = "",
      inputRef,
      ...rest
    },
    ref
  ) => {
    const showError = touched && error;

    return (
      <div
        className={`custom-input-wrapper ${
          showError ? "has-error" : ""
        } ${className}`}
      >
        {label && (
          <label className="custom-input-label">
            {label} {required && <span className="required">*</span>}
          </label>
        )}

        <Input
          {...rest}
          suffix={rest.suffix} // ✅ Allows EyeTwoTone / EyeInvisibleOutlined to show
          ref={(node) => {
            if (inputRef) inputRef(node?.input ?? null);
            if (typeof ref === "function") ref(node?.input ?? null);
            else if (ref && typeof ref === "object" && ref !== null) {
              (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                node?.input ?? null;
            }
          }}
          className={`custom-input-field ${showError ? "input-error" : ""}`}
        />

        {showError && <div className="error-text">{error}</div>}
      </div>
    );
  }
);

export default CustomInput;
