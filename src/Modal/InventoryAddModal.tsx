import React from "react";
import { Modal, Button, Input, InputNumber } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";

interface InventoryAddModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
}
const validationSchema = Yup.object({
  total_quantity: Yup.number()
    .required("Total quantity is required")
    .max(9999, "Maximum allowed is 4 digits")
    .min(0, "Must be at least 0"),
});

const InventoryAddModal: React.FC<InventoryAddModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const formik = useFormik({
    initialValues: {
      total_quantity: 0,
      comment: "",
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  return (
    <Modal
      title="Add Inventory"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => formik.handleSubmit()}
        >
          Save
        </Button>,
      ]}
    >
      <form onSubmit={formik.handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 500 }}>Total Quantity</label>
          <InputNumber
            name="total_quantity"
            value={formik.values.total_quantity}
            onChange={(value) =>
              formik.setFieldValue("total_quantity", value ?? 0)
            }
            onBlur={formik.handleBlur}
            style={{ width: "100%" }}
            min={0}
            max={9999}
          />
          {formik.touched.total_quantity && formik.errors.total_quantity && (
            <div style={{ color: "red", fontSize: 12 }}>
              {formik.errors.total_quantity}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 500 }}>Comment (Optional)</label>
          <Input.TextArea
            name="comment"
            rows={3}
            value={formik.values.comment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter comment"
          />
        </div>
      </form>
    </Modal>
  );
};

export default InventoryAddModal;
