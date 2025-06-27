import React, { useEffect, useState } from "react";
import { Table, Card, Spin, Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { getDecryptedCookie } from "../../../Utils/cookies";
import { getlistInventoryLog } from "../../../Services/ApiService";
import type { TablePaginationConfig } from "antd";

const InventoryView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const record = location.state?.record;

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [inventoryLog, setInventoryLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const token = getDecryptedCookie("user_token")?.token;

  const fetchInventoryLog = async (
    page: number,
    pageSize: number,
    inventory: any,
    token: string
  ) => {
    if (!inventory?.id || !token) return;

    const formData = new FormData();
    formData.append("token", token);
    formData.append("inventory_id", inventory.id);

    try {
      setLoading(true);
      const res = await getlistInventoryLog(page, pageSize, formData);
      if (res.data?.status === 1) {
        setInventoryLog(res.data.data || []);
        setPagination((prev) => ({
          ...prev,
          total: res.data.total || 0,
        }));
      } else {
        setInventoryLog([]);
      }
    } catch (error) {
      console.error("Error fetching inventory log:", error);
      setInventoryLog([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && record?.id) {
      fetchInventoryLog(
        pagination.current || 1,
        pagination.pageSize || 10,
        record,
        token
      );
    }
  }, [record, pagination.current, pagination.pageSize]);

  const logColumns = [
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
    },
    {
      title: "Previous Qty",
      dataIndex: "pervious_quantity",
      key: "pervious_quantity",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Remaining Qty",
      dataIndex: "remaining_quantity",
      key: "remaining_quantity",
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
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
  ];

  if (!record?.id) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <p>
            No inventory data provided. Please go back and select an inventory
            item.
          </p>
          <Button type="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2>Inventory Details</h2>
        <Button onClick={() => navigate(-1)} style={{ marginTop: 20 }}>
          Back
        </Button>
      </div>

      <Card
        title={`Log History for Slot: ${record.slot_name}`}
        size="small"
        style={{ marginTop: 20 }}
      >
        <Spin spinning={loading}>
          <Table
            columns={logColumns}
            dataSource={inventoryLog}
            rowKey={(record) => record.id}
            size="small"
            pagination={{
              ...pagination,
              onChange: (page, pageSize) => {
                setPagination({ ...pagination, current: page, pageSize });
              },
              showSizeChanger: true,
              style: { marginTop: 16, textAlign: "center" },
            }}
            scroll={{ x: true }}
            locale={{ emptyText: "No inventory log found." }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default InventoryView;
