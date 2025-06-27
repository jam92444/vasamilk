import React, { useEffect } from "react";
import { Modal, Button, Input, InputNumber } from "antd";
import { useFormik } from "formik";

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
    <Modal
      title="Edit Inventory"
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
      </form>
    </Modal>
  );
};

export default InventoryEditModal;
