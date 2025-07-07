// Pages/Masters/Lines.tsx
import {
  CheckCircleTwoTone,
  DeleteOutlined,
  EditOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Popconfirm, type TablePaginationConfig } from "antd";
import { useAuth } from "../../../Context/AuthContext";
import {
  createList,
  deleteLine,
  getLineLists,
  inactiveList,
  updateLine,
  // addLine,
} from "../../../Services/ApiService";
import { getUserToken } from "../../../Utils/Data";
import CustomButton from "../../../Components/UI/CustomButton";
import AppLoader from "../../../Components/UI/AppLoader";
import CustomTable from "../../../Components/UI/CustomTable";
import "../../../Styles/pages/_lines.scss";
import { toast } from "react-toastify";
import LineFormModal from "../../../Modal/LineFormModal";

interface LineType {
  id: number;
  name: string;
  description: string;
  status: number;
  status_text: string;
  created_at: string;
  updated_at: string;
}

const Lines = () => {
  const { loading, setLoading } = useAuth();
  const [lineList, setLineList] = useState<LineType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLine, setSelectedLine] = useState<LineType | null>(null);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchLines = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("token", getUserToken());

    const res = await getLineLists(
      pagination.current,
      pagination.pageSize,
      formData
    );
    if (res.data.status === 1) {
      setLineList(res.data.data);
      setPagination((prev) => ({
        ...prev,
        total: res.data.total || res.data.data.length,
      }));
    } else {
      toast.info(res.data.msg);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLines();
  }, [pagination.current, pagination.pageSize]);

  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    setPagination(paginationConfig);
  };

  const handleAddLine = () => {
    setSelectedLine(null); //reset selected line properly
    setModalVisible(true);
  };

  const handleEdit = (record: LineType) => {
    setSelectedLine(record);
    setModalVisible(true);
  };

  const handleLineSubmit = (values: {
    id?: number;
    name: string;
    description: string;
  }) => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("name", values.name);
    formData.append("description", values.description);

    if (values.id) {
      formData.append("lines_id", values.id.toString());
      updateLine(formData).then((res) => {
        if (res.data.status === 1) {
          toast.success("Line updated successfully");
          setModalVisible(false);
          fetchLines();
        } else {
          toast.error(res.data.msg);
        }
      });
    } else {
      createList(formData).then((res) => {
        if (res.data.status === 1) {
          toast.success("Line added successfully");
          setModalVisible(false);
          fetchLines();
        } else {
          toast.error(res.data.msg);
        }
      });
    }
  };

  const handleStatusChange = (record: LineType) => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("id", record.id.toString());
    formData.append("status", (record.status === 1 ? 2 : 1).toString());

    inactiveList(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(
            `${record.status === 1 ? "Line Deactivated" : "Line Activated"}`
          );
          fetchLines();
        } else {
          toast.info(res.data.msg);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (record: LineType) => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("id", record.id.toString());
    setLoading(true);
    deleteLine(formData)
      .then((res) => {
        if (res.data.status === 1) {
          fetchLines();
          toast.success(res.data.msg);
        } else {
          toast.info(res.data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (status === 1 ? "Active" : "Inactive"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: LineType) => (
        <div className="table-actions">
          <EditOutlined
            className="action-icon edit"
            onClick={() => handleEdit(record)}
            title="Edit"
          />
          <Popconfirm
            title={`Are you sure you want to ${
              record.status === 1 ? "deactivate" : "activate"
            } this line?`}
            onConfirm={() => handleStatusChange(record)}
            okText="Yes"
            cancelText="No"
          >
            {record.status === 1 ? (
              <StopOutlined
                className="action-icon status deactivate"
                title="Deactivate"
              />
            ) : (
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                className="action-icon status activate"
                title="Activate"
              />
            )}
          </Popconfirm>

          <Popconfirm
            title="Are you sure you want to delete this line?"
            onConfirm={() => handleDelete(record)}
            okText="Delete"
            cancelText="Cancel"
          >
            <DeleteOutlined className="action-icon delete" title="Delete" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="masters">
      {loading && <AppLoader message="Loading lines..." />}
      <div className="management-title">
        <aside className="management-title">LINES MANAGEMENT</aside>
        <CustomButton
          text="Add Line"
          className="submit-btn"
          type="primary"
          onClick={handleAddLine}
        />
      </div>

      <CustomTable
        columns={columns}
        data={lineList}
        loading={loading}
        className="custom-line-table"
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
      />

      {/* Form Modal for Add/Edit */}
      {modalVisible && (
        <LineFormModal
          key={selectedLine?.id ?? "new"}
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedLine(null);
          }}
          onSubmit={handleLineSubmit}
          initialData={
            selectedLine
              ? {
                  id: selectedLine.id,
                  name: selectedLine.name,
                  description: selectedLine.description,
                }
              : { name: "", description: "" }
          }
        />
      )}
    </div>
  );
};

export default Lines;
