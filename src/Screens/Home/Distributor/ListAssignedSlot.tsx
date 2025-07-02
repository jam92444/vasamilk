import { Table, Typography, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserDetails } from "../../../Utils/Data";
import { getRouteDetails } from "../../../Services/ApiService";
import { toast } from "react-toastify";
import CustomButton from "../../../Components/UI/CustomButton";

const { Title, Text } = Typography;

interface AssignedSlot {
  id: number;
  customer_name: string;
  quantity: number;
  slot_name: string;
  from_date: string;
  to_date: string;
  assign_type_name: string;
  milk_given_method_name: string;
  created_at: string;
}

const ListAssignedSlot = () => {
  const { token } = useUserDetails();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { distributorId, line_id, distributorName, lineName } = state || {};

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [routeData, setRouteData] = useState<AssignedSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetRouteDetails = async (
    page = 1,
    pageSize = 10,
    distributorId?: number,
    lineId?: number
  ) => {
    if (!token || !distributorId || !lineId) {
      toast.error("Missing required parameters");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("token", token);
    formData.append("distributor_id", String(distributorId));
    formData.append("line_id", String(lineId));

    getRouteDetails(page, pageSize, formData)
      .then((res) => {
        if (res.data.status === 1) {
          setRouteData(res.data.data);
          setPagination({
            current: page,
            pageSize,
            total: res.data.total || res.data.data.length,
          });
          setLoading(false);
        } else {
          toast.error("Failed to fetch route data.");
        }
      })
      .catch((error) => {
        toast.error(
          error?.message || "Something went wrong while fetching route details."
        );
      });
  };

  useEffect(() => {
    if (distributorId && line_id) {
      handleGetRouteDetails(
        pagination.current!,
        pagination.pageSize!,
        distributorId,
        line_id
      );
    }
  }, [distributorId, line_id, pagination.current, pagination.pageSize]);

  const columns: ColumnsType<AssignedSlot> = [
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
      responsive: ["xs", "sm", "md"],
    },
    {
      title: "Quantity (L)",
      dataIndex: "quantity",
      key: "quantity",
      responsive: ["sm", "md"],
    },
    {
      title: "Slot",
      dataIndex: "slot_name",
      key: "slot_name",
      responsive: ["sm", "md"],
    },
    {
      title: "From",
      dataIndex: "from_date",
      key: "from_date",
      responsive: ["md"],
    },
    {
      title: "To",
      dataIndex: "to_date",
      key: "to_date",
      responsive: ["md"],
    },
    {
      title: "Assign Type",
      dataIndex: "assign_type_name",
      key: "assign_type_name",
      render: (text) => <Tag color="orange">{text}</Tag>,
      responsive: ["md"],
    },
    {
      title: "Method",
      dataIndex: "milk_given_method_name",
      key: "milk_given_method_name",
      render: (text) => <Tag color="blue">{text}</Tag>,
      responsive: ["md"],
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => (
        <Text type="secondary">{new Date(text).toLocaleString()}</Text>
      ),
      responsive: ["lg"],
    },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <div className="flex-center-between">
        <Title level={4}>Route Details</Title>
        <CustomButton text="Back" onClick={() => navigate(-1)} />
      </div>
      <Text>Line : {lineName}</Text>
      <br />
      <Text>Distributor : {distributorName}</Text>

      <Table
        dataSource={routeData}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={(pagination) =>
          handleGetRouteDetails(
            pagination.current!,
            pagination.pageSize!,
            distributorId,
            line_id
          )
        }
        scroll={{ x: "max-content" }}
        style={{ marginTop: 24 }}
      />
    </div>
  );
};

export default ListAssignedSlot;
