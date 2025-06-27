import { useNavigate } from "react-router-dom";
import CustomButton from "../../../Components/UI/CustomButton";
import UserList from "../../../Components/User/UserList";
import "../../../Styles/pages/_customer.scss";

const CustomerManagement = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="customer">
        {/* title */}
        <div className="customer-title">
          <p className="title">User Management</p>
          <CustomButton
            text="Add User "
            className="add-btn"
            onClick={() => navigate("/add-user")}
          />
        </div>
        {/* list of users  */}
        <UserList />
      </div>
    </div>
  );
};

export default CustomerManagement;
