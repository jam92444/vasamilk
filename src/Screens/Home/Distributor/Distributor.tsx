import { useEffect, useState } from "react";
import { Table, Typography, Tag, message } from "antd";
import { toast } from "react-toastify";
import { userToken } from "../../../Utils/Data";
import { getDistributorList } from "../../../Services/ApiService";

const { Text } = Typography;

interface Route {
  id: number;
  line_name: string;
  status: number;
}

interface DistributorRecord {
  distributer_id: number;
  distributer_name: string;
  line_data?: Route[];
}

const Distributor = () => {
  const [distributors, setDistributors] = useState<DistributorRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetDistributorList = () => {
    if (!userToken) {
      toast.info("Token not found");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("token", userToken);

    getDistributorList(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setDistributors(res.data.data);
        } else {
          message.error("Failed to fetch distributors");
        }
      })
      .catch((error) => {
        console.error(error);
        message.error("Something went wrong");
      })
      .finally(() => setLoading(false));
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
      render: (text: String) => <Text>{text.split(" - ")[1]}</Text>,
    },
  ];

  // Route (line_data) table columns
  const routeColumns = [
    {
      title: "Route ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
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
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ marginBottom: "2rem" }}>Distributor List</h2>
      <Table
        loading={loading}
        dataSource={distributors}
        columns={distributorColumns}
        rowKey="distributer_id"
        expandable={{
          expandedRowRender: (record) =>
            (record?.line_data ?? []).length > 0 ? (
              <Table
                dataSource={record?.line_data}
                columns={routeColumns}
                pagination={false}
                rowKey="id"
              />
            ) : (
              <Text type="secondary">No route data available.</Text>
            ),
          rowExpandable: () => true,
        }}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Distributor;
