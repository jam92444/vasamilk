// // src/Modal/InventoryAddModal.tsx
// import { useEffect } from "react";
// import { Form, Input, Button } from "antd";
// import CustomModal from "../../../Modal/CustomModal";
// import { getDecryptedCookie } from "../../../Utils/cookies";
// import { updateInventory } from "../../../Services/ApiService";
// import { toast } from "react-toastify";

// interface InventoryAddModalProps {
//   visible: boolean;
//   onClose: () => void;
//   record?: any;
//   onSave?: (values: any) => void; // Optional if save handled here
// }

// const InventoryListAddModal = ({
//   visible,
//   onClose,
//   record,
// }: InventoryAddModalProps) => {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (visible && record) {
//       form.setFieldsValue({
//         total_quantity: record.total_quantity || "",
//         comment: record.comment || "",
//       });
//     } else if (visible) {
//       form.resetFields();
//     }
//   }, [visible, record, form]);

//   const handleSubmit = (values: any) => {
//     const token = getDecryptedCookie("user_token").token;
//     const formData = new FormData();
//     formData.append("token", token);

//     if (!record?.id) {
//       toast.error("Missing inventory ID.");
//       return;
//     }

//     formData.append("inventory_id", record.id.toString());
//     formData.append("total_quantity", values.total_quantity);
//     if (values.comment) {
//       formData.append("comment", values.comment);
//     }

//     updateInventory(formData)
//       .then((res) => {
//         if (res.data.status === 1) {
//           toast.success(res.data.msg);
//         } else {
//           toast.info(res.data.msg);
//         }
//         onClose();
//       })
//       .catch((err) => {
//         console.error(err);
//         toast.error("Failed to update inventory.");
//         onClose();
//       });
//   };

//   return (
//     <CustomModal visible={visible} title="Add Inventory" onClose={onClose}>
//       <Form layout="vertical" form={form} onFinish={handleSubmit}>
//         <Form.Item
//           label="Total Quantity"
//           name="total_quantity"
//           rules={[{ required: true, message: "Please enter total quantity" }]}
//         >
//           <Input type="number" />
//         </Form.Item>

//         <Form.Item label="Comment" name="comment">
//           <Input.TextArea rows={3} placeholder="Optional comment..." />
//         </Form.Item>

//         <div style={{ textAlign: "right" }}>
//           <Button onClick={onClose} style={{ marginRight: 8 }}>
//             Cancel
//           </Button>
//           <Button type="primary" htmlType="submit">
//             Save
//           </Button>
//         </div>
//       </Form>
//     </CustomModal>
//   );
// };

// export default InventoryListAddModal;
