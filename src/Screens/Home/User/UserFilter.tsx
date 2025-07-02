import React, { useEffect } from "react";
import { Select, Space, Spin } from "antd";
import {
  CustomerType,
  payTypesOptions,
  UserDropDown,
} from "../../../Utils/Data";
import CustomButton from "../../../Components/UI/CustomButton";
import { useDropdownData } from "../../../Hooks/DropDowns";

const { Option } = Select;

interface UserFiltersProps {
  onFilterChange: (field: string, value: string | null) => void;
  filterValues: {
    user_type?: string;
    status_text?: string;
    pay_type_text?: string;
    customer_type?: string;
    price_tag_id?: string;
    line_id?: string;
  };
  onExportFilters: (filters: {
    user_type?: string;
    status_text?: string;
    pay_type_text?: string;
    customer_type?: string;
    price_tag_id?: string;
    line_id?: string;
  }) => void;
  onResetFilters: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  onFilterChange,
  filterValues,
  onExportFilters,
  onResetFilters,
}) => {
  const {
    isLoadingDropdowns,
    loadLineDropdowns,
    priceTagDropdownOptions,
    lineDropdownOptions,
    payTagIdDropDown,
  } = useDropdownData();

  useEffect(() => {
    payTagIdDropDown();
    loadLineDropdowns();
  }, []);

  const exportFilters = () => {
    onExportFilters(filterValues);
  };

  return isLoadingDropdowns ? (
    <div className="form-spinner">
      <Spin size="large" />
    </div>
  ) : (
    <Space style={{ marginBottom: 16, flexWrap: "wrap" }} size="middle" wrap>
      <Select
        placeholder="User Type"
        allowClear
        style={{ width: 140 }}
        value={filterValues.user_type || undefined}
        onChange={(val) => onFilterChange("user_type", val)}
      >
        {UserDropDown.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Status"
        allowClear
        style={{ width: 140 }}
        value={filterValues.status_text || undefined}
        onChange={(val) => onFilterChange("status_text", val)}
      >
        <Option value="Active">Active</Option>
        <Option value="Inactive">Inactive</Option>
      </Select>

      <Select
        placeholder="Pay Type"
        allowClear
        style={{ width: 140 }}
        value={filterValues.pay_type_text || undefined}
        onChange={(val) => onFilterChange("pay_type_text", val)}
      >
        {payTypesOptions.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Customer Type"
        allowClear
        style={{ width: 140 }}
        value={filterValues.customer_type || undefined}
        onChange={(val) => onFilterChange("customer_type", val)}
      >
        {CustomerType.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Price Tag"
        allowClear
        style={{ width: 140 }}
        value={filterValues.price_tag_id || undefined}
        onChange={(val) => onFilterChange("price_tag_id", val)}
      >
        {priceTagDropdownOptions.map(({ label, value }) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Line / Route"
        allowClear
        style={{ width: 140 }}
        value={filterValues.line_id || undefined}
        onChange={(val) => onFilterChange("line_id", val)}
      >
        {lineDropdownOptions.map(({ label, value }) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </Select>

      <div>
        <CustomButton
          style={{ fontSize: "12px", marginRight: ".5rem" }}
          htmlType="button"
          text="Filters"
          onClick={exportFilters}
        />
        <CustomButton
          style={{ fontSize: "12px" }}
          htmlType="button"
          text="Reset"
          onClick={onResetFilters}
        />
      </div>
    </Space>
  );
};

export default UserFilters;
