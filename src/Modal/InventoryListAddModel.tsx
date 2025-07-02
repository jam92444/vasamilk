import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomModal from "../Components/UI/CustomModal";
import CustomSelect from "../Components/UI/CustomSelect";
import { inOutOption } from "../Utils/Data";
import { useDropdownData } from "../Hooks/DropDowns";
import CustomInput from "../Components/UI/CustomInput";
import CustomButton from "../Components/UI/CustomButton";

interface InventoryEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
}

const validationSchema = Yup.object().shape({
  total_quantity: Yup.number()
    .required("Total quantity is required")
    .min(1, "Must be greater than 0"),
  type: Yup.number().required("Type is required"),
  distributer_id: Yup.number().required("Distributer is required"),
});

const InventoryListAddModel: React.FC<InventoryEditModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const { distributorDropdownOptions } = useDropdownData();

  const formik = useFormik({
    initialValues: {
      total_quantity: 0,
      type: 0,
      distributer_id: 0,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      onSave(values);
      resetForm();
    },
  });

  return (
    <CustomModal
      visible={visible}
      title="Add Inventory"
      onClose={onClose}
      width={500}
    >
      <form onSubmit={formik.handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <CustomInput
            label="Total Quantity"
            name="total_quantity"
            required
            value={formik.values.total_quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.total_quantity && formik.errors.total_quantity
            }
            type="number"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <CustomSelect
            label="Type"
            name="type"
            value={formik.values.type}
            onChange={(value) => formik.setFieldValue("type", value)}
            onBlur={() => formik.setFieldTouched("type")}
            options={inOutOption}
            required
            placeholder="Select Type"
            error={formik.touched.type && formik.errors.type}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <CustomSelect
            label="Distributor"
            name="distributer_id"
            value={formik.values.distributer_id}
            onChange={(value) => formik.setFieldValue("distributer_id", value)}
            onBlur={() => formik.setFieldTouched("distributer_id")}
            options={distributorDropdownOptions}
            required
            placeholder="Select Distributor"
            error={
              formik.touched.distributer_id && formik.errors.distributer_id
            }
          />
        </div>

        <div style={{ textAlign: "right", marginTop: 24 }}>
          <CustomButton
            className="btn"
            text="Cancel"
            onClick={onClose}
            style={{ marginRight: 8 }}
          />

          <CustomButton
            type="primary"
            htmlType="submit"
            text="Save"
            className="submit-btn"
          />
        </div>
      </form>
    </CustomModal>
  );
};

export default InventoryListAddModel;
