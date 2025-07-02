// src/Modal/UserView.tsx
import { useEffect, useState } from "react";
import { Descriptions, Divider, Typography, Spin } from "antd";
import { getUserById } from "../Services/ApiService";
import { getUserToken } from "../Utils/Data";

const { Title } = Typography;

interface SlotData {
  id: number;
  slot_id: number;
  quantity: number;
  method: number;
  start_date: string;
}

interface UserDetails {
  user_id: number;
  user_type: number;
  name: string;
  user_name: string;
  email: string;
  phone: string;
  created_at: string;
  created_by?: string;
  customer_type?: number;
  line_name?: string;
  status?: number;
  price_tag_name?: string;
  pay_type: number;
  slot_data?: SlotData[];
}

interface UserViewProps {
  user_id: number | null;
}

const UserView: React.FC<UserViewProps> = ({ user_id }) => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user_id) return;

    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("user_id", user_id.toString());

    setLoading(true);
    getUserById(formData)
      .then((res) => {
        if (res.data?.status === 1) {
          setUser(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  }, [user_id]);

  if (loading) return <Spin size="small" tip="Loading user details..." />;
  if (!user) return <p>No user data found.</p>;

  return (
    <div>
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Username">{user.user_name}</Descriptions.Item>
        <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
        <Descriptions.Item label="Created At">
          {user.created_at}
        </Descriptions.Item>
        <Descriptions.Item label="User Type">
          {{
            2: "Admin",
            3: "Vendor",
            4: "Distributor",
            5: "Customer",
          }[user.user_type] || "Unknown"}
        </Descriptions.Item>

        {user.user_type === 5 && (
          <>
            <Descriptions.Item label="Customer Type">
              {user.customer_type === 1 ? "Regular" : "Occasional"}
            </Descriptions.Item>
            <Descriptions.Item label="Line Name">
              {user.line_name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {user.status === 1 ? "Active" : "Inactive"}
            </Descriptions.Item>
            <Descriptions.Item label="Pay Type">
              {user.pay_type === 1 ? "Daily" : "Monthly"}
            </Descriptions.Item>
            <Descriptions.Item label="Price Tag">
              {user.price_tag_name || "-"}
            </Descriptions.Item>
          </>
        )}
      </Descriptions>

      {user.user_type === 5 && user.slot_data && user.slot_data.length > 0 && (
        <>
          <Divider />
          <Title level={5}>Slot Data</Title>
          <Descriptions bordered column={1} size="small">
            {user.slot_data.map((slot, index) => (
              <Descriptions.Item key={slot.id} label={`Slot #${index + 1}`}>
                <div>
                  <strong>Slot:</strong>{" "}
                  {{
                    1: "Morning",
                    2: "Evening",
                  }[slot.slot_id] || "Unknown"}
                  <br />
                  <strong>Quantity:</strong> {slot.quantity}
                  <br />
                  <strong>Method:</strong>{" "}
                  {{
                    1: "Direct",
                    2: "Distributor",
                  }[slot.method] || "Unknown"}
                  <br />
                  <strong>Start Date:</strong> {slot.start_date}
                </div>
              </Descriptions.Item>
            ))}
          </Descriptions>
        </>
      )}
    </div>
  );
};

export default UserView;
