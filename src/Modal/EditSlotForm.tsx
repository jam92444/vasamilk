import React, { useEffect } from "react";
import { Form, Input, TimePicker, Button, Row, Col } from "antd";
import dayjs from "dayjs";
import CustomModal from "../Components/UI/CustomModal";

interface SlotType {
  id: number;
  name: string;
  inventory_end_time: string | null;
  start_time: string;
  end_time: string;
  booking_end: string;
  status: number;
}

interface EditSlotFormProps {
  visible: boolean;
  slot: SlotType | null;
  token: string; // pass token for submission
  onCancel: () => void;
  onSave: (data: {
    token: string;
    slot_id: number;
    name: string;
    inventory_end_time: string;
    start_time: string;
    end_time: string;
    booking_end: string;
  }) => void;
}

const EditSlotForm: React.FC<EditSlotFormProps> = ({
  visible,
  slot,
  token,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (slot) {
      form.setFieldsValue({
        name: slot.name,
        inventory_end_time: slot.inventory_end_time
          ? dayjs(slot.inventory_end_time, "HH:mm:ss")
          : null,
        start_time: dayjs(slot.start_time, "HH:mm:ss"),
        end_time: dayjs(slot.end_time, "HH:mm:ss"),
        booking_end: dayjs(slot.booking_end, "HH:mm:ss"),
      });
    } else {
      form.resetFields();
    }
  }, [slot, form]);

  const handleFinish = (values: any) => {
    if (!slot) return;
    onSave({
      token,
      slot_id: slot.id,
      name: values.name,
      inventory_end_time: values.inventory_end_time
        ? values.inventory_end_time.format("HH:mm:ss")
        : "",
      start_time: values.start_time.format("HH:mm:ss"),
      end_time: values.end_time.format("HH:mm:ss"),
      booking_end: values.booking_end.format("HH:mm:ss"),
    });
  };

  return (
    <CustomModal
      visible={visible}
      title={`Edit Slot: ${slot?.name || ""}`}
      onClose={onCancel}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ status: true }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter slot name" }]}
            >
              <Input placeholder="Enter slot name" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Inventory End Time"
              name="inventory_end_time"
              rules={[
                { required: true, message: "Please select inventory end time" },
              ]}
            >
              <TimePicker format="HH:mm:ss" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Start Time"
              name="start_time"
              rules={[{ required: true, message: "Please select start time" }]}
            >
              <TimePicker format="HH:mm:ss" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="End Time"
              name="end_time"
              rules={[{ required: true, message: "Please select end time" }]}
            >
              <TimePicker format="HH:mm:ss" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Booking End"
              name="booking_end"
              rules={[
                { required: true, message: "Please select booking end time" },
              ]}
            >
              <TimePicker format="HH:mm:ss" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} style={{ textAlign: "right" }}>
            <Button onClick={onCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  );
};

export default EditSlotForm;
