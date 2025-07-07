import { useEffect, useState } from "react";
import { Popconfirm, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";

import AppLoader from "../../../Components/UI/AppLoader";
import CustomButton from "../../../Components/UI/CustomButton";
import CustomTable from "../../../Components/UI/CustomTable";
import { useAuth } from "../../../Context/AuthContext";
import {
  listReason,
  toggleReasonStatus,
  createReason,
  updateReason,
  deleteReason,
} from "../../../Services/ApiService";
import { getUserToken } from "../../../Utils/Data";
import "../../../Styles/pages/_reason.scss";
import type { TablePaginationConfig } from "antd/lib";
import { toast } from "react-toastify";
import ReasonFormModal from "../../../Modal/ReasonFormModal";

interface reasonType {
  id: number;
  name: string;
  status: number;
  status_text: string;
  type: number;
  type_name: string;
  created_at: string;
  updated_at: string;
}

const Reason = () => {
  const { loading, setLoading } = useAuth();

  const [listOfReason, setListOfReason] = useState<reasonType[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<reasonType | null>(null);
  const [modalKey, setModalKey] = useState(0);

  const handleGetReasonList = () => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    setLoading(true);

    listReason(pagination.current, pagination.pageSize, formData)
      .then((res) => {
        if (res.data.status === 1) {
          setListOfReason(res.data.data || []);
          setPagination((prev) => ({
            ...prev,
            total: res.data.total || res.data.data?.length || 0,
          }));
        } else {
          message.info("Failed to fetch reason list");
        }
      })
      .catch((error) => {
        console.error("Fetch failed:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleGetReasonList();
  }, [pagination.current, pagination.pageSize]);

  const handleEdit = (record: reasonType) => {
    setFormData(record);
    setModalKey((prev) => prev + 1);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setFormData(null);
    setModalKey((prev) => prev + 1);
    setModalVisible(true);
  };

  const handleDelete = (record: reasonType) => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("id", record.id.toString());
    deleteReason(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          handleGetReasonList();
        } else {
          toast.info(res.data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleStatusToggle = (record: reasonType) => {
    const changeStatus = record.status === 1 ? 2 : 1;
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("id", record.id.toString());
    formData.append("status", changeStatus.toString());
    setLoading(true);
    toggleReasonStatus(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(
            `${changeStatus === 1 ? "Reason Activated" : "Reason Deactivated"}`
          );
          handleGetReasonList();
        } else {
          toast.info(res.data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  //Form submit logic for both create & update//
  const handleFormSubmit = (values: { name: string }) => {
    const formPayload = new FormData();
    formPayload.append("token", getUserToken());
    formPayload.append("name", values.name);
    formPayload.append("type", "1"); // Replace with dynamic type if needed

    const apiCall = formData?.id
      ? updateReason(
          (() => {
            formPayload.append("reason_id", String(formData.id));
            return formPayload;
          })()
        )
      : createReason(formPayload);

    setLoading(true);

    apiCall
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(
            formData?.id
              ? "Reason updated successfully"
              : "Reason created successfully"
          );
          handleGetReasonList();
          setModalVisible(false);
        } else {
          toast.error(res.data.msg || "Something went wrong");
        }
      })
      .catch((err) => {
        console.error("Error submitting reason form:", err);
        toast.error("Server error. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
    { title: "Updated At", dataIndex: "updated_at", key: "updated_at" },
    {
      title: "Status",
      dataIndex: "status_text",
      key: "status_text",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: reasonType) => (
        <div className="table-actions">
          <EditOutlined
            className="action-icon edit"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title={`Are you sure to ${
              record.status === 1 ? "deactivate" : "activate"
            } this reason?`}
            onConfirm={() => handleStatusToggle(record)}
          >
            {record.status === 1 ? (
              <StopOutlined className="action-icon deactivate" />
            ) : (
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                className="action-icon activate"
              />
            )}
          </Popconfirm>
          <Popconfirm
            title="Are you sure to delete this reason?"
            onConfirm={() => handleDelete(record)}
          >
            <DeleteOutlined className="action-icon delete" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="masters reason">
      {loading && <AppLoader message="Loading reasons..." />}

      <div className="management-title">
        <aside className="management-title">REASON MANAGEMENT</aside>
        <CustomButton
          text="Add Reason"
          className="submit-btn"
          type="primary"
          onClick={handleAdd}
        />
      </div>

      <CustomTable<reasonType>
        columns={columns}
        data={listOfReason}
        loading={loading}
        pagination={pagination}
        rowKey="id"
        onChange={handleTableChange}
        className="reason-table"
        emptyText="No reasons found"
      />

      <ReasonFormModal
        key={modalKey}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        initialData={formData || { name: "" }}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default Reason;
