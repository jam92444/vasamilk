import React, { useEffect } from "react";
import { Select } from "antd";
import "../../Styles/components/UI/CustomSelect.scss";

export interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface Props {
  label: string;
  name: string;
  value: string | number | (string | number)[] | null;
  options: Option[];
  onChange: (value: string | number | (string | number)[] | null) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  error?: string | undefined | false;
  touched?: boolean;
  mode?: "multiple" | "tags";
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const CustomSelect: React.FC<Props> = ({
  label,
  value,
  options,
  onChange,
  onBlur,
  error,
  touched,
  required,
  className = "",
  disabled,
  mode,
  placeholder,
}) => {
  const showError = touched && error;

  // Add a default option only for single select
  const enhancedOptions: Option[] =
    !mode && !placeholder
      ? [{ label: `-- Select ${label} --`, value: "" }, ...options]
      : options;

  return (
    <div
      className={`custom-select-wrapper ${
        showError ? "has-error" : ""
      } ${className}`}
    >
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
        disabled={disabled}
        showSearch
        optionFilterProp="label"
        filterOption={(input, option) =>
          (option?.label?.toString().toLowerCase() ?? "").includes(
            input.toLowerCase()
          )
        }
        options={enhancedOptions}
        placeholder={placeholder || `Select ${label}`}
        className="custom-select"
      />

      {showError && <div className="error-text">{error}</div>}
    </div>
  );
};

export default CustomSelect;
