import { useEffect, useState } from "react";
import { Table, Button, Space, Alert, Spin } from "antd";
import type { TablePaginationConfig } from "antd";
import { getDecryptedCookie } from "../../Utils/cookies";
import {
  addInventory,
  getInventoryList,
  updateInventory,
} from "../../Services/ApiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { userToken } from "../../Utils/Data";
import InventoryEditModal from "../../Modal/InventoryEditModal";
import InventoryAddModal from "../../Modal/InventoryAddModal";
import "../../Styles/pages/Admin/InventoryList.scss";

const InventoryList = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  // inventory data
  const [inventoryData, setInventoryData] = useState([]);

  // edit inventory
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);

  // permission states
  const [canAddInventory, setCanAddInventory] = useState(true);
  const [canUpdateInventory, setCanUpdateInventory] = useState(true);

  // add inventory model
  const [addModalVisible, setAddModalVisible] = useState(false);

  // add inventory List model
  // const [addListModalVisible, setAddListModalVisible] = useState(false);

  // loading
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleGetInventory(pagination.current || 1, pagination.pageSize || 10);
  }, [pagination.current, pagination.pageSize]);

  // fetching inventory data from the API.
  const handleGetInventory = async (page: number, pageSize: number) => {
    const userData = getDecryptedCookie("user_token");
    const token = userData?.token;

    if (!token) {
      console.error("No user token found.");
      return;
    }

    const formData = new FormData();
    formData.append("token", token);
    try {
      setLoading(true);
      const res = await getInventoryList(page, pageSize, formData);

      if (res.data.status === -1) {
        console.error(res.data.msg);
        return;
      }
      // Set flags from API
      setInventoryData(res.data.data || []);

      setCanAddInventory(res.data.is_add_status === 1);
      setCanUpdateInventory(res.data.is_update_status === 1);

      setPagination((prev) => ({
        ...prev,
        total: res.data.total || res.data.data?.length || 0,
      }));
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // handle changes on the  table
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  // open view model on click view
  const handleView = (record: any) => {
    navigate(`/inventory/view`, { state: { record } });
  };

  // open model on click edit button
  const handleEdit = (record: any) => {
    if (!canUpdateInventory) {
      toast.info("Inventory updates are currently disabled.");
      return;
    }

    setEditRecord(record);
    setEditModalVisible(true);
  };

  // saving  add inventory
  const handleSaveAdd = (values: any) => {
    const token = getDecryptedCookie("user_token").token;
    const formData = new FormData();
    formData.append("token", token);
    formData.append("total_quantity", values.total_quantity);
    {
      values.comment && formData.append("comment", values.comment);
    }

    addInventory(formData).then((res) => {
      if (res.data.status === 1) {
        toast.success(res.data.msg);
      } else {
        toast.info(res.data.msg);
      }
    });

    setAddModalVisible(false);
  };

  const formatValue = (value: any) => {
    return value !== null && value !== undefined && value !== "" ? value : "-";
  };

  // save edited value
  const handleSaveEdit = (updatedValues: any) => {
    const formData = new FormData();
    formData.append("token", userToken);

    if (editRecord?.id) {
      formData.append("inventory_id", editRecord.id.toString());
    } else {
      console.error("Missing inventory ID");
      return;
    }

    if (updatedValues.total_quantity !== undefined) {
      formData.append("total_quantity", updatedValues.total_quantity);
    }
    if (updatedValues.comment) {
      formData.append("comment", updatedValues.comment);
    }

    updateInventory(formData)
      .then((res) => {
        console.log(res.data);
        // Optionally refresh inventory list
        handleGetInventory(pagination.current!, pagination.pageSize!);
      })
      .catch((error) => console.log(error));

    setEditModalVisible(false);
    setEditRecord(null);
  };

  //  data format
  const columns = [
    {
      title: "S.No",
      render: (_: any, __: any, index: number) =>
        (pagination.current! - 1) * pagination.pageSize! + index + 1,
      width: 60,
    },
    {
      title: "Slot Name",
      dataIndex: "slot_name",
      key: "slot_name",
      render: formatValue,
    },
    {
      title: "Used Quantity",
      dataIndex: "used_quantity",
      key: "used_quantity",
      render: formatValue,
    },
    {
      title: "Total Quantity",
      dataIndex: "total_quantity",
      key: "total_quantity",
      render: formatValue,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: formatValue,
    },
    {
      title: "Status",
      dataIndex: "status_text",
      key: "status_text",
      render: (text: string) => (
        <span style={{ color: text === "Active" ? "#1890ff" : "#ff4d4f" }}>
          {text || "-"}
        </span>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="small">
          <Button size="small" onClick={() => handleView(record)}>
            View
          </Button>
          {/* {record.status === 1 && canUpdateInventory && (
            <Button
              size="small"
              onClick={() => {
                setEditRecord(record); // prefill for add
                setAddListModalVisible(true);
              }}
            >
              Add
            </Button>
          )} */}
          {record.status === 1 && canUpdateInventory && (
            <Button
              size="small"
              type="primary"
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="inventory-list-container">
      {/* loading */}
      <Spin spinning={loading} tip="Loading inventory...">
        {/* title  */}
        <div className="inventory-header">
          <h2>Inventory List</h2>
          <Button
            type="primary"
            disabled={!canAddInventory}
            onClick={() => setAddModalVisible(true)}
          >
            + Add Inventory
          </Button>
        </div>
        {/* alert  */}
        {(!canAddInventory || !canUpdateInventory) && (
          <Alert
            message={`${
              !canAddInventory && !canUpdateInventory
                ? "Adding and updating inventory time has expired."
                : !canAddInventory
                ? "Adding inventory time has expired."
                : "Updating inventory time has expired."
            }`}
            type="warning"
            style={{ marginBottom: 16 }}
          />
        )}
        {/* list */}
        <Table
          size="small"
          className="compact-table"
          columns={columns}
          dataSource={inventoryData}
          rowKey={(record) => record.id}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            itemRender: (page, type, originalElement) =>
              type === "page" ? (
                <button className="circular-page-btn">{page}</button>
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
          scroll={{ x: "max-content" }}
          locale={{ emptyText: "No inventory found" }}
        />
        {/* edit inventor */}
        <InventoryEditModal
          visible={editModalVisible}
          record={editRecord}
          onClose={() => {
            setEditModalVisible(false);
            setEditRecord(null);
          }}
          onSave={handleSaveEdit}
        />

        {/* add  inventor */}
        <InventoryAddModal
          visible={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          onSave={handleSaveAdd}
        />

        {/* <InventoryListAddModal
          visible={addListModalVisible}
          record={editRecord} // Pass record here
          onClose={() => {
            setAddListModalVisible(false);
            setEditRecord(null);
          }}
          onSave={handleSaveAdd}
        />*/}
      </Spin>
    </div>
  );
};

export default InventoryList;
