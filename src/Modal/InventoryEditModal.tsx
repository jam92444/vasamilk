import React, { useEffect } from "react";
import { Input, InputNumber } from "antd";
import { useFormik } from "formik";
import CustomModal from "../Components/UI/CustomModal";
import CustomButton from "../Components/UI/CustomButton";

interface InventoryEditModalProps {
  visible: boolean;
  record: any | null;
  onClose: () => void;
  onSave: (values: any) => void;
}

const InventoryEditModal: React.FC<InventoryEditModalProps> = ({
  visible,
  record,
  onClose,
  onSave,
}) => {
  const formik = useFormik({
    initialValues: {
      comment: "",
      total_quantity: 0,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  useEffect(() => {
    if (record) {
      formik.setValues({
        comment: record.comment || "",
        total_quantity: record.total_quantity || 0,
      });
    }
  }, [record]);

  return (
    <CustomModal
      visible={visible}
      title="Edit Inventory"
      onClose={onClose}
      width={500}
    >
      <form onSubmit={formik.handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 500 }}>Comment</label>
          <Input.TextArea
            name="comment"
            rows={3}
            value={formik.values.comment}
            onChange={formik.handleChange}
            placeholder="Enter comment"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 500 }}>Total Quantity</label>
          <InputNumber
            name="total_quantity"
            value={formik.values.total_quantity}
            onChange={(value) =>
              formik.setFieldValue("total_quantity", value ?? 0)
            }
            style={{ width: "100%" }}
            min={0}
          />
        </div>

        <div style={{ textAlign: "right", marginTop: 24 }}>
          <CustomButton
            text="Cancel"
            onClick={onClose}
            className="btn"
            style={{ marginRight: 8 }}
          />
          <CustomButton
            text="Save"
            onClick={() => formik.handleSubmit()}
            style={{ marginRight: 8 }}
            className="submit-btn"
          />
        </div>
      </form>
    </CustomModal>
  );
};

export default InventoryEditModal;
