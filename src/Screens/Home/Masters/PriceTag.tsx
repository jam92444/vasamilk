import PriceTagFormModal, {
  type PriceTagFormValues,
} from "../../../Modal/PriceTagFormModal";
import type { TablePaginationConfig } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { useAuth } from "../../../Context/AuthContext";
import { getUserToken } from "../../../Utils/Data";
import { useEffect, useState } from "react";
import {
  createPriceTag,
  deletePriceTag,
  getPricetagList,
  inactivePriceTag,
  updatePriceTag,
} from "../../../Services/ApiService";
import AppLoader from "../../../Components/UI/AppLoader";
import CustomButton from "../../../Components/UI/CustomButton";
import CustomTable from "../../../Components/UI/CustomTable";
import { Popconfirm } from "antd";
import "../../../Styles/pages/_pricetag.scss";

// Define the price tag type
interface PriceTagType {
  id: number;
  name: string;
  price: number;
  status: number;
  status_text: string;
  created_at: string;
  updated_at: string;
}

const PriceTag = () => {
  const { loading, setLoading } = useAuth();
  const [priceTagList, setPriceTagList] = useState<PriceTagType[]>([]);
  const [modalKey, setModalKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState<PriceTagType | null>(null);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // get list
  const handleGetPriceTagList = () => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    setLoading(true);

    getPricetagList(pagination.current, pagination.pageSize, formData)
      .then((res) => {
        if (res.data.status === 1) {
          setPriceTagList(res.data.data);
          setPagination((prev) => ({
            ...prev,
            total: res.data.total || res.data.data.length,
          }));
        } else {
          toast.info(res.data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  // Add and update API
  const handleFormSubmit = (values: PriceTagFormValues) => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("name", values.name);

    const priceNumber =
      typeof values.price === "string"
        ? parseFloat(values.price)
        : values.price;

    formData.append("price", priceNumber.toString());

    if (values.id) {
      formData.append("price_tag_id", values.id.toString());

      updatePriceTag(formData)
        .then((res) => {
          if (res.data.status === 1) {
            toast.success("Price tag updated successfully");
            setModalVisible(false);
            handleGetPriceTagList();
          } else {
            toast.error(res.data.msg || "Update failed");
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong while updating");
        });
    } else {
      createPriceTag(formData)
        .then((res) => {
          if (res.data.status === 1) {
            toast.success("Price tag created successfully");
            setModalVisible(false);
            handleGetPriceTagList();
          } else {
            toast.error(res.data.msg || "Creation failed");
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong while creating");
        });
    }
  };

  useEffect(() => {
    handleGetPriceTagList();
  }, [pagination.current, pagination.pageSize]);

  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    setPagination(paginationConfig);
  };

  const handleAdd = () => {
    setModalKey((prev) => prev + 1);
    setSelectedTag(null);
    setModalVisible(true);
  };

  const handleEdit = (record: PriceTagType) => {
    setModalKey((prev) => prev + 1);
    setSelectedTag(record);
    setModalVisible(true);
  };

  const handleDelete = (record: PriceTagType) => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("id", record.id.toString());
    setLoading(true);
    deletePriceTag(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          handleGetPriceTagList();
        } else {
          toast.info(res.data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleStatusToggle = (record: PriceTagType) => {
    const changeStatus = record.status === 1 ? 2 : 1;
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("id", record.id.toString());
    formData.append("status", changeStatus.toString());
    inactivePriceTag(formData)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(
            `Status ${changeStatus === 1 ? "Activated" : "Deactivated"}`
          );
          handleGetPriceTagList();
        } else {
          toast.info(res.data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (v: number) => `₹ ${v}`,
    },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
    { title: "Updated At", dataIndex: "updated_at", key: "updated_at" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (status === 1 ? "Active" : "Inactive"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: PriceTagType) => (
        <div className="table-actions">
          <EditOutlined
            className="action-icon edit"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title={`Are you sure to ${
              record.status === 1 ? "deactivate" : "activate"
            } this price tag?`}
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
            title="Are you sure to delete this price tag?"
            onConfirm={() => handleDelete(record)}
          >
            <DeleteOutlined className="action-icon delete" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="masters pricetag">
      {loading && <AppLoader message="Loading price tags..." />}
      <div className="management-title">
        <aside className="management-title">PRICE TAG MANAGEMENT</aside>
        <CustomButton
          text="Create Price Tag"
          className="submit-btn"
          type="primary"
          onClick={() => handleAdd()}
        />
      </div>

      <CustomTable
        columns={columns}
        data={priceTagList}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
      />

      {/* modal */}
      <PriceTagFormModal
        key={modalKey}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedTag(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={
          selectedTag
            ? {
                id: selectedTag.id,
                name: selectedTag.name,
                price: selectedTag.price,
              }
            : { name: "", price: 0 }
        }
      />
    </div>
  );
};

export default PriceTag;
