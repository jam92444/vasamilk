import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Alert, Button, Space, Popconfirm } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { useUserDetails } from "../../../Utils/Data";
import { changeUserStatus, fetchUserList } from "../../../Services/ApiService";
import UserFilters from "./UserFilter";
import UserView from "../../../Modal/UserView";
import CustomModal from "../../../Components/UI/CustomModal";
import CustomTable from "../../../Components/UI/CustomTable";
import AppLoader from "../../../Components/UI/AppLoader";
import CustomButton from "../../../Components/UI/CustomButton";
import "../../../Styles/components/_compact-table.scss";

interface User {
  id: number;
  name: string;
  username: string;
  email: string; // add this
  phone: string | null;
  created_at: string; // add this
  created_by: string; // add this
  updated_by: string | null;
  user_type: string;
  customer_type: string;
  pay_type_text: string;
  status_text: string;
  line_name: string; // add this
  price_tag_name: string; // add this
  status: number; // add this if you need for toggling status
}

const UserList = () => {
  const { token } = useUserDetails();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const handleView = (record: User) => {
    setSelectedUser(record.id);
    setViewModalVisible(true);
  };
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Filter/search state
  const [filters, setFilters] = useState<{
    user_type?: string;
    status_text?: string;
    pay_type_text?: string;
    customer_type?: string;
    price_tag_id?: string;
    line_id?: string;
  }>({});

  useEffect(() => {
    if (token) {
      loadUsers(pagination.current || 1, pagination.pageSize || 10);
    }
  }, [token]);

  const loadUsers = (page: number, pageSize: number) => {
    if (!token) return;

    const filterData = new FormData();
    filterData.append("token", token);
    {
      filters.pay_type_text &&
        filterData.append("pay_type", filters.pay_type_text);
    }
    {
      filters.customer_type &&
        filterData.append("customer_type", filters.customer_type);
    }
    {
      filters.price_tag_id &&
        filterData.append("price_tag_id", filters.price_tag_id);
    }
    {
      filters.status_text &&
        filterData.append(
          "status",
          filters.status_text === "Active" ? "1" : "2"
        );
    }
    {
      filters.user_type && filterData.append("user_type", filters.user_type);
    }
    {
      filters.line_id && filterData.append("line_id", filters.line_id);
    }

    setLoading(true);
    fetchUserList(page, pageSize, filterData)
      .then((res) => {
        setUsers(res.data?.data || []);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: res.data?.total || 0,
        }));
      })
      .catch(() => setError("Failed to fetch users"))
      .finally(() => setLoading(false));
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    loadUsers(newPagination.current || 1, newPagination.pageSize || 10);
  };

  const handleEdit = (record: User) => {
    navigate(`/edit-user`, { state: { user_id: record.id } });
  };

  const handleChangeUserStatus = (
    record: User,
    action: "toggle" | "delete"
  ) => {
    let newStatus = "0";

    if (action === "toggle") {
      newStatus = record.status_text === "Active" ? "0" : "1";
    } else if (action === "delete") {
      newStatus = "-1";
    }

    const formData = new FormData();
    formData.append("token", token);
    formData.append("user_id", String(record.id));
    formData.append("status", newStatus);

    changeUserStatus(formData)
      .then((res) => {
        if (res.data.status === 0) {
          toast.error(res.data.msg || "Failed to update user status");
        } else {
          if (action === "toggle") {
            toast.success(
              newStatus === "1" ? "User activated" : "User deactivated"
            );
          } else if (action === "delete") {
            toast.success("User deleted");
          }
          loadUsers(pagination.current || 1, pagination.pageSize || 10);
        }
      })
      .catch((error) => {
        console.error("Status change error:", error);
        toast.error("Something went wrong");
      });
  };

  const handleFilter = (filters: {
    user_type?: string;
    status_text?: string;
    pay_type_text?: string;
    customer_type?: string;
    price_tag_id?: string;
    line_id?: string;
  }) => {
    setFilters({
      user_type: filters.user_type,
      status_text: filters.status_text,
      pay_type_text: filters.pay_type_text,
      customer_type: filters.customer_type,
      price_tag_id: filters.price_tag_id,
      line_id: filters.line_id,
    });

    setPagination((prev) => ({ ...prev, current: 1 }));
    loadUsers(1, pagination.pageSize || 10);
  };

  const onFilterChange = (field: string, value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const columns: ColumnsType<User> = [
    {
      title: "S.No",
      render: (_: any, __: any, index: number) => (
        <span style={{ fontSize: 12 }}>
          {((pagination.current || 1) - 1) * (pagination.pageSize || 10) +
            index +
            1}
        </span>
      ),
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (name) => <span style={{ fontSize: "12px" }}>{name}</span>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      ellipsis: true,
      render: (username) => (
        <span style={{ fontSize: "12px" }}>{username}</span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => (
        <span style={{ fontSize: "12px" }}>{phone ? phone : "-"}</span>
      ),
    },
    {
      title: "User Type",
      dataIndex: "user_type",
      key: "user_type",
      render: (type) => (
        <span
          style={{
            color: "blue",
            fontSize: "12px",
            textTransform: "capitalize",
          }}
        >
          {type || "-"}
        </span>
      ),
    },
    {
      title: "Customer Type",
      dataIndex: "customer_type",
      key: "customer_type",
      render: (type) => (
        <span
          style={{
            color: "purple",
            fontSize: "12px",
            textTransform: "capitalize",
          }}
        >
          {type || "-"}
        </span>
      ),
    },
    {
      title: "Pay Type",
      dataIndex: "pay_type",
      key: "pay_type",
      render: (type: number) =>
        type === 1 ? (
          <span style={{ color: "orange" }}>Daily</span>
        ) : type === 2 ? (
          <span style={{ color: "purple" }}>Monthly</span>
        ) : (
          <span>-</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status_text",
      key: "status_text",
      render: (status) => (
        <span
          style={{
            color: status === "Active" ? "green" : "red",
            fontSize: "12px",
            textTransform: "capitalize",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Edit"
          />
          <Popconfirm
            title={`Are you sure you want to ${
              record.status_text === "Active" ? "deactivate" : "activate"
            } this user?`}
            onConfirm={() => handleChangeUserStatus(record, "toggle")}
          >
            <Button
              type="text"
              icon={
                record.status_text === "Active" ? (
                  <StopOutlined />
                ) : (
                  <CheckCircleOutlined />
                )
              }
              title={
                record.status_text === "Active" ? "Deactivate" : "Activate"
              }
            />
          </Popconfirm>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleChangeUserStatus(record, "delete")}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Delete"
            />
          </Popconfirm>
          <Button type="text" onClick={() => handleView(record)} title="View">
            View
          </Button>
        </Space>
      ),
    },
  ];

  const handleResetFilters = () => {
    const resetPageSize = 10;
    setFilters({});
    setPagination({ current: 1, pageSize: resetPageSize, total: 0 });
    const page = 1;
    const pageSize = resetPageSize;
    const formData = new FormData();
    formData.append("token", token);

    setLoading(true);
    fetchUserList(page, pageSize, formData) // reason behind calling this is when we reset the value we
      .then((res) => {
        setUsers(res.data?.data || []);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: res.data?.total || 0,
        }));
      })
      .catch(() => setError("Failed to fetch users"))
      .finally(() => setLoading(false));
  };

  if (!token) {
    return (
      <Alert
        message="Unauthorized"
        description="You must be logged in to view this page."
        type="warning"
        showIcon
        style={{ margin: "1rem" }}
      />
    );
  }
  if (loading) return <AppLoader message="Loading users..." />;

  if (error)
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: "1rem" }}
      />
    );

  return (
    <div style={{ overflowX: "auto" }}>
      <UserFilters
        onFilterChange={onFilterChange}
        filterValues={filters}
        onExportFilters={handleFilter}
        onResetFilters={handleResetFilters}
      />

      <CustomTable
        columns={columns}
        data={users}
        rowKey={(record) => record.id.toString()}
        loading={false}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          itemRender: (page, type, originalElement) =>
            type === "page" ? (
              <CustomButton
                text={page.toString()}
                className="circular-page-btn"
              />
            ) : (
              originalElement
            ),
          style: {
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5rem",
          },
        }}
        onChange={handleTableChange}
        scrollX="max-content"
        emptyText="No users found"
        className="compact-table"
      />

      <CustomModal
        visible={viewModalVisible}
        title="User Details"
        onClose={() => {
          setViewModalVisible(false);
          setSelectedUser(null);
        }}
      >
        <UserView user_id={selectedUser} />
      </CustomModal>
    </div>
  );
};

export default UserList;
