import dayjs from "dayjs";
import CustomModal from "../../../Components/UI/CustomModal";
import InventoryLogFilter from "./InventoryLogFilter";
import CustomTable from "../../../Components/UI/CustomTable";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useEffect, useState } from "react";
import { Typography, Button, Descriptions } from "antd";
import { getSlotMapping } from "../../../Services/ApiService";
import { getUserToken } from "../../../Utils/Data";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const { Title } = Typography;

interface SlotLog {
  actual_milk_quantity: number;
  assigned_name: string | null;
  assigned_to: number | null;
  customer_id: number;
  customer_name: string;
  is_assigned: string;
  milk_given_id: number;
  milk_given_quantity: number;
  milk_given_status: string;
  milk_given_type: string;
  reason: string | null;
  scheduled_date: string;
  slot_id: number;
  slot_log_id: number;
  slot_name: string;
  status: number;
  unit_price: string;
  user_pay_mode: number;
}

const SlotMapping = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { mode, slot_id } = state || {};
  const [filters, setFilters] = useState({
    fromDate: dayjs().format("YYYY-MM-DD"),
    toDate: dayjs().format("YYYY-MM-DD"),
    customerId: null,
    distributorId: null,
  });

  const [slotsLog, setSlotsLog] = useState<SlotLog[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotLog | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleGetSlot = async (
    page = 1,
    pageSize = 10,
    overrideFilters = filters,
    mode: number,
    slot_id: number
  ) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("from_date", overrideFilters.fromDate);
    formData.append("to_date", overrideFilters.toDate);
    formData.append("mode", mode.toString());
    formData.append("slot_id", slot_id.toString());
    if (overrideFilters.customerId)
      formData.append("customer_id", overrideFilters.customerId);
    if (overrideFilters.distributorId)
      formData.append("distributor_id", overrideFilters.distributorId);

    try {
      const res = await getSlotMapping(page, pageSize, formData);
      if (res.data.status) {
        setSlotsLog(res.data.data);
        setPagination({
          current: page,
          pageSize,
          total: res.data.total || res.data.data.length,
        });
      } else {
        toast.error("Failed to fetch slot logs");
      }
    } catch (error: any) {
      toast.error(
        error?.message || "Something went wrong while fetching slot logs."
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!mode || !slot_id) {
      toast.error("Missing required parameters");
      navigate(-1);
      return;
    }

    handleGetSlot(
      pagination.current!,
      pagination.pageSize!,
      filters,
      mode,
      slot_id
    );
  }, []);

  const showDetails = (record: SlotLog) => {
    setSelectedSlot(record);
    setIsModalVisible(true);
  };

  const columns: ColumnsType<SlotLog> = [
    {
      title: "Scheduled Date",
      dataIndex: "scheduled_date",
      key: "scheduled_date",
    },
    {
      title: "Slot",
      dataIndex: "slot_name",
      key: "slot_name",
      responsive: ["md"],
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Milk Status",
      dataIndex: "milk_given_status",
      key: "milk_given_status",
    },
    {
      title: "Given Qty (L)",
      dataIndex: "milk_given_quantity",
      key: "milk_given_quantity",
    },
    {
      title: "Actual Qty (L)",
      dataIndex: "actual_milk_quantity",
      key: "actual_milk_quantity",
    },
    {
      title: "Distributor",
      dataIndex: "assigned_name",
      key: "assigned_name",
      render: (value: string | null) => value || "-",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => showDetails(record)}
          style={{ color: "red", fontSize: 13, padding: 0 }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Distributor Logs
        </Title>
        <Button onClick={() => navigate(-1)} style={{ marginTop: 20 }}>
          Back
        </Button>
      </div>

      <InventoryLogFilter
        onFilter={(newFilters) => {
          setFilters(newFilters);
          handleGetSlot(1, pagination.pageSize!, newFilters, mode, slot_id);
        }}
      />

      <CustomTable
        data={slotsLog}
        columns={columns}
        rowKey="slot_log_id"
        pagination={pagination}
        loading={loading}
        onChange={(pagination) => {
          setPagination(pagination);
          handleGetSlot(
            pagination.current!,
            pagination.pageSize!,
            filters,
            mode,
            slot_id
          );
        }}
        scrollX="max-content"
      />

      {/* modal */}
      <CustomModal
        visible={isModalVisible}
        title="Slot Details"
        onClose={() => {
          setIsModalVisible(false);
          setSelectedSlot(null);
        }}
        width={600}
      >
        {selectedSlot && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Scheduled Date">
              {selectedSlot.scheduled_date}
            </Descriptions.Item>
            <Descriptions.Item label="Slot">
              {selectedSlot.slot_name}
            </Descriptions.Item>
            <Descriptions.Item label="Customer">
              {selectedSlot.customer_name}
            </Descriptions.Item>
            <Descriptions.Item label="Milk Given Status">
              {selectedSlot.milk_given_status}
            </Descriptions.Item>
            <Descriptions.Item label="Given Quantity (L)">
              {selectedSlot.milk_given_quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Actual Quantity (L)">
              {selectedSlot.actual_milk_quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Distributor">
              {selectedSlot.assigned_name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Unit Price">
              {selectedSlot.unit_price}
            </Descriptions.Item>
            <Descriptions.Item label="Pay Mode">
              {selectedSlot.user_pay_mode === 1
                ? "Daily"
                : selectedSlot.user_pay_mode === 2
                ? "Monthly"
                : "Other"}
            </Descriptions.Item>
            <Descriptions.Item label="Reason">
              {selectedSlot.reason || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Assigned Status">
              {selectedSlot.is_assigned}
            </Descriptions.Item>
            <Descriptions.Item label="Milk Given Type">
              {selectedSlot.milk_given_type}
            </Descriptions.Item>
          </Descriptions>
        )}
      </CustomModal>
    </div>
  );
};

export default SlotMapping;
