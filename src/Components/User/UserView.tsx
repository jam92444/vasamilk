import { useEffect, useState } from "react";
import { getUserById } from "../../Services/ApiService";
import "../../Styles/components/UserView.scss";
import { userToken } from "../../Utils/Data";

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

  useEffect(() => {
    if (!user_id) return;
    console.log(userToken);
    const formData = new FormData();
    formData.append("token", userToken);
    formData.append("user_id", user_id.toString());

    getUserById(formData)
      .then((res) => {
        if (res.data?.status === 1) {
          setUser(res.data.data);
          console.log(res.data.data);
        }
      })
      .catch(console.error);
  }, [user_id]);

  if (!user) return null;

  return (
    <div className="user-view">
      <ul>
        <li>
          <strong>Username:</strong> {user.user_name}
        </li>
        <li>
          <strong>Name:</strong> {user.name}
        </li>
        <li>
          <strong>Email:</strong> {user.email}
        </li>
        <li>
          <strong>Phone:</strong> {user.phone}
        </li>
        <li>
          <strong>Created At:</strong> {user.created_at}
        </li>
        <li>
          <strong>User Type:</strong>{" "}
          {user.user_type === 2
            ? "Admin"
            : user.user_type === 3
            ? "Vendor"
            : user.user_type === 4
            ? "Distributor"
            : "Customer"}
        </li>
        {user.user_type === 5 && (
          <>
            <li>
              <strong>Customer Type:</strong>{" "}
              {user.customer_type === 1 ? "Regular" : "Occasional"}
            </li>
            <li>
              <strong>Line Name:</strong> {user.line_name ?? "-"}
            </li>
            <li>
              <strong>Status:</strong>{" "}
              {user.status === 1 ? "Active" : "Inactive"}
            </li>
            <li>
              <strong>Pay Type:</strong>{" "}
              {user.pay_type === 1 ? "Daily" : "Monthly"}
            </li>
            <li>
              <strong>Price Tag:</strong> {user.price_tag_name ?? "-"}
            </li>
          </>
        )}
      </ul>

      {/* Conditional slot data */}
      {user.user_type === 5 && user.slot_data && user.slot_data.length > 0 && (
        <div className="slot-section">
          <h3>Slot Data</h3>
          <ul>
            {user.slot_data.map((slot) => (
              <li key={slot.id}>
                <strong>Slot:</strong>{" "}
                {slot.slot_id === 1
                  ? "Morning"
                  : slot.slot_id === 2
                  ? "Evening"
                  : "Unknown"}{" "}
                <br />
                <strong> Quantity:</strong> {slot.quantity} <br />
                <strong> Method:</strong>{" "}
                {slot.method === 1
                  ? "Direct"
                  : slot.method === 2
                  ? "Distributor"
                  : "Unknown"}{" "}
                <br />
                <strong> Start Date:</strong> {slot.start_date}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserView;
