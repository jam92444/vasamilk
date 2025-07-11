import React, { useEffect } from "react";
import { Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import useAddUserFormik from "./useAddUserFormik";
import CustomButton from "../../../Components/UI/CustomButton";
import CustomInput from "../../../Components/UI/CustomInput";
import CustomSelect from "../../../Components/UI/CustomSelect";
import "../../../Styles/pages/AddUser.scss";
import { useDropdownData } from "../../../Hooks/DropDowns";
import {
  CustomerType,
  payTypesOptions,
  UserDropDown,
} from "../../../Utils/Data";
const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    setFieldValue,
    isSubmitting,
    isEdit,
    methodOptions,
    setDropdownsLoaded,
  } = useAddUserFormik();
  const location = useLocation();
  const { user_type } = location.state || {};

  const {
    priceTagDropdownOptions,
    loadLineDropdowns,
    payTagIdDropDown,
    lineDropdownOptions,
    isLoadingDropdowns,
  } = useDropdownData();

  const isCustomer = values.user_type === 5;
  const isRegularCustomer = Number(values.customer_type) === 1;
  useEffect(() => {
    const fetchDropdowns = async () => {
      await Promise.all([payTagIdDropDown(), loadLineDropdowns()]);
      setDropdownsLoaded(true); // ✅ Set this after both dropdowns are ready
    };

    fetchDropdowns();
  }, []);

  return (
    <div className="add-user-form">
      <div className="title-box full-width">
        <h1 className="title">Add User</h1>
      </div>

      {isLoadingDropdowns ? (
        <div className="form-spinner full-width">
          <Spin size="large" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Common Fields */}
          <CustomInput
            className=""
            label="Name"
            name="name"
            placeholder="Enter full name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            touched={touched.name}
            required
          />
          <CustomInput
            className=""
            label="Username"
            name="user_name"
            placeholder="Enter unique username"
            value={values.user_name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.user_name}
            touched={touched.user_name}
            required
          />
          <CustomInput
            className=""
            label="Email"
            name="email"
            placeholder="Enter email address"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
          />
          <CustomInput
            label="Phone"
            name="phone"
            placeholder="Enter phone number"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.phone}
            touched={touched.phone}
            maxLength={10}
            required
          />

          {!isEdit && (
            <CustomInput
              className=""
              label="Password"
              name="password"
              type="password"
              placeholder="Enter a strong password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
              required
            />
          )}

          <CustomSelect
            label="User Type"
            name="user_type"
            value={values.user_type}
            options={UserDropDown}
            onChange={(val) => setFieldValue("user_type", val)}
            onBlur={handleBlur}
            error={errors.user_type as string}
            touched={touched.user_type ? true : false}
            required
          />

          {isCustomer && (
            <>
              <CustomSelect
                label="Customer Type"
                name="customer_type"
                value={values.customer_type}
                options={CustomerType}
                onChange={(val) => setFieldValue("customer_type", val)}
                onBlur={handleBlur}
                error={errors.customer_type as string}
                touched={touched.customer_type}
                required
              />

              <CustomSelect
                label="Select Line"
                name="line_id"
                value={values.line_id}
                options={lineDropdownOptions}
                onChange={(val) => setFieldValue("line_id", val)}
                onBlur={handleBlur}
                error={errors.line_id as string}
                touched={touched.line_id}
                required
              />

              <CustomSelect
                label="Price Tag"
                name="price_tag_id"
                value={values.price_tag_id}
                options={priceTagDropdownOptions}
                onChange={(val) => setFieldValue("price_tag_id", val)}
                onBlur={handleBlur}
                error={errors.price_tag_id as string}
                touched={touched.price_tag_id}
                required
              />

              <CustomSelect
                label="Pay Type"
                name="pay_type"
                value={values.pay_type}
                options={payTypesOptions}
                onChange={(val) => setFieldValue("pay_type", val)}
                onBlur={handleBlur}
                error={errors.pay_type as string}
                touched={touched.pay_type}
                required
              />

              {isRegularCustomer && (
                <>
                  <h3 className="full-width">Morning Slot</h3>
                  <CustomInput
                    label="Quantity"
                    name="slot_data[0].quantity"
                    type="number"
                    value={values.slot_data[0]?.quantity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={(errors.slot_data?.[0] as any)?.quantity}
                    touched={(touched.slot_data?.[0] as any)?.quantity}
                  />
                  <CustomSelect
                    label="Method"
                    name="slot_data[0].method"
                    value={values.slot_data[0]?.method}
                    options={methodOptions}
                    onChange={(val) =>
                      setFieldValue("slot_data[0].method", val)
                    }
                    onBlur={handleBlur}
                    error={(errors.slot_data?.[0] as any)?.method}
                    touched={(touched.slot_data?.[0] as any)?.method}
                  />

                  <CustomInput
                    className="full-width"
                    label="Start Date"
                    name="start_date"
                    type="date"
                    value={values.start_date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.start_date}
                    touched={touched.start_date}
                    required
                  />

                  <h3 className="full-width">Evening Slot</h3>
                  <CustomInput
                    label="Quantity"
                    name="slot_data[1].quantity"
                    type="number"
                    value={values.slot_data[1]?.quantity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={(errors.slot_data?.[1] as any)?.quantity}
                    touched={(touched.slot_data?.[1] as any)?.quantity}
                  />
                  <CustomSelect
                    label="Method"
                    name="slot_data[1].method"
                    value={values.slot_data[1]?.method}
                    options={methodOptions}
                    onChange={(val) =>
                      setFieldValue("slot_data[1].method", val)
                    }
                    onBlur={handleBlur}
                    error={(errors.slot_data?.[1] as any)?.method}
                    touched={(touched.slot_data?.[1] as any)?.method}
                  />
                </>
              )}
            </>
          )}

          <div className="sample full-width">
            <CustomButton
              htmlType="submit"
              text="Submit"
              className="submit-btn"
              loading={isSubmitting}
            />
            <CustomButton
              onClick={() => {
                if (user_type) {
                  navigate("/place-order");
                } else {
                  navigate("/user");
                }
              }}
              htmlType="button"
              text="Cancel"
              className=" btn"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default AddUser;
