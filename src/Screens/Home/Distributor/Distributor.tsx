import AppLoader from "../../../Components/UI/AppLoader";
import CustomButton from "../../../Components/UI/CustomButton";
import { useEffect, useState } from "react";
import { Table, Typography, Tag, Button } from "antd";
import { useUserDetails } from "../../../Utils/Data";
import { getDistributorList } from "../../../Services/ApiService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../../Styles/pages/_distributor.scss";

const { Text } = Typography;

interface Route {
  id: number;
  line_name: string;
  status: number;
  __parentId?: number;
  __distributorName?: string;
}

interface DistributorRecord {
  distributer_id: number;
  distributer_name: string;
  line_data?: Route[] | null;
}

const Distributor = () => {
  const navigate = useNavigate();
  const { token } = useUserDetails();
  const [distributors, setDistributors] = useState<DistributorRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetDistributorList = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("token", token);

    getDistributorList(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setDistributors(res.data.data);
        } else {
          toast.error("Failed to fetch distributors");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong");
      })
      .finally(() => setLoading(false));
  };

  const handleRouteDetailPage = (
    route: Route,
    distributorId: number,
    distributorName: string
  ) => {
    navigate(`/route-details`, {
      state: {
        distributorId,
        distributorName: distributorName,
        line_id: route.id,
        lineName: route.line_name,
      },
    });
  };

  useEffect(() => {
    handleGetDistributorList();
  }, []);

  const distributorColumns = [
    {
      title: "Distributor Name",
      dataIndex: "distributer_name",
      key: "distributer_name",
      render: (text: string) => <Text strong>{text.split(" - ")[0]}</Text>,
    },
    {
      title: "Phone",
      dataIndex: "distributer_name",
      key: "phone",
      render: (text: string) => <Text>{text.split(" - ")[1]}</Text>,
    },
  ];

  const routeColumns = [
    {
      title: "Route Name",
      dataIndex: "line_name",
      key: "line_name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: number) =>
        status === 1 ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      render: (_: any, record: Route) => (
        <Button
          type="link"
          onClick={() =>
            handleRouteDetailPage(
              record,
              record.__parentId as number,
              record.__distributorName as string
            )
          }
        >
          View Details
        </Button>
      ),
    },
  ];

  if (loading) {
    return <AppLoader message="Loading Distributor..." />;
  }

  return (
    <div className="masters">
      <div className="flex-center-between" style={{ marginBottom: "1rem" }}>
        <h2>Distributor List</h2>
        <CustomButton
          className="assign-slot-button"
          text="Assign Slot"
          onClick={() => navigate("assign-route")}
        />
      </div>
      <Table
        loading={loading}
        dataSource={distributors}
        columns={distributorColumns}
        rowKey="distributer_id"
        style={{ fontFamily: "Poppins", fontSize: "13px" }}
        size="small"
        expandable={{
          expandedRowRender: (record) =>
            (record?.line_data ?? []).length > 0 ? (
              <Table
                dataSource={
                  record.line_data?.map((route) => ({
                    ...route,
                    __parentId: record.distributer_id,
                    __distributorName: record.distributer_name,
                  })) ?? []
                }
                columns={routeColumns}
                pagination={false}
                rowKey="id"
              />
            ) : (
              <Text type="secondary">No route data available.</Text>
            ),
          rowExpandable: () => true,
        }}
        pagination={false}
      />
    </div>
  );
};

export default Distributor;
