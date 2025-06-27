import React from "react";
import { Select } from "antd";
import "../../Styles/components/UI/CustomSelect.scss";

export interface Option {
  label?: string;
  value?: string | number;
  disabled?: boolean;
}
interface Props {
  label: string;
  name: string;
  value: string | number | string[];
  options: Option[];
  onChange: (value: string | number | string[]) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  error?: string | undefined | false;
  touched?: boolean;
  mode?: "multiple" | "tags";
  required?: boolean;
  placeholder?: string; // <-- Add this line
}

const CustomSelect: React.FC<Props> = ({
  label,
  name,
  value,
  options,
  onChange,
  onBlur,
  error,
  touched,
  required,
  mode,
  placeholder, // destructure here
}) => {
  const showError = touched && error;

  const enhancedOptions: Option[] =
    typeof value === "string" || typeof value === "number"
      ? [
          { label: `-- Select ${label} --`, value: "", disabled: true },
          ...options,
        ]
      : options;

  return (
    <div className={`custom-select-wrapper ${showError ? "has-error" : ""}`}>
      {label && (
        <label className="custom-select-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <Select
        value={value}
        onChange={onChange}
        mode={mode}
        onBlur={onBlur}
        options={enhancedOptions}
        placeholder={placeholder}
        className="custom-select"
      />
      {showError && <div className="error-text">{error}</div>}
    </div>
  );
};

export default CustomSelect;
