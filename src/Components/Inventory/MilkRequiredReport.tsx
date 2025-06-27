import { useEffect, useState } from "react";
import { Table, Typography, Card, Spin, Row, Col } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Breakpoint } from "antd/lib";
import { getdailyMilkRequired } from "../../Services/ApiService";
import { getDecryptedCookie } from "../../Utils/cookies";
import "../../Styles/pages/Admin/MilkRequiredReport.scss";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;

const MilkRequiredReport = () => {
  const navigate = useNavigate();
  const [requiredMilk, setRequiredMilk] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetRequiredMilkReport = async (formData: FormData) => {
    try {
      setLoading(true);
      const res = await getdailyMilkRequired(formData);

      if (res.data.status === 1) {
        setRequiredMilk(res.data.data || []);
      } else {
        console.error("API Error:", res.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getDecryptedCookie("user_token")?.token;
    const formData = new FormData();
    formData.append("token", token);
    handleGetRequiredMilkReport(formData);
  }, []);

  const mapSlot: Record<number, string> = {
    1: "Morning",
    2: "Evening",
  };

  const mapType: Record<number, string> = {
    1: "Vendor",
    2: "Distributor",
  };

  const grouped = requiredMilk.reduce((acc: any, curr: any) => {
    const slot = mapSlot[curr.slot_id];
    const type = mapType[curr.given_type];

    if (!acc[slot]) acc[slot] = {};
    acc[slot][type] = curr.total_quantity;
    return acc;
  }, {});

  const tableData = Object.entries(grouped).map(
    ([slot, values]: any, index) => ({
      key: index,
      slot,
      vendor: values.Vendor || "0.000",
      distributor: values.Distributor || "0.000",
    })
  );

  const columns: ColumnsType<{
    key: number;
    slot: string;
    vendor: string;
    distributor: string;
  }> = [
    {
      title: "Time Slot",
      dataIndex: "slot",
      key: "slot",
      responsive: ["xs", "sm", "md", "lg", "xl"] as Breakpoint[],
    },
    {
      title: "Vendor (Litres)",
      dataIndex: "vendor",
      key: "vendor",
      responsive: ["xs", "sm", "md", "lg", "xl"] as Breakpoint[],
    },
    {
      title: (
        <span onClick={() => navigate("/inventory/slot")}>
          Distributor (Litres){" "}
          <span
            style={{
              color: "blue",
              cursor: "pointer",
              fontSize: "12px",
              textDecoration: "underline",
            }}
          >
            View logs
          </span>
        </span>
      ),

      dataIndex: "distributor",
      key: "distributor",
      responsive: ["xs", "sm", "md", "lg", "xl"] as Breakpoint[],
    },
  ];

  return (
    <div className="milk-required-report">
      <Row justify="center">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card
            bordered={false}
            style={{
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
              borderRadius: 10,
            }}
          >
            <Title
              level={4}
              style={{
                textAlign: "start",
                marginBottom: 24,
                fontWeight: "600",
              }}
            >
              Daily Milk Requirement
            </Title>
            <Spin spinning={loading} tip="Loading data...">
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={false}
                bordered
                size="middle"
                scroll={{ x: "max-content" }}
                rowClassName={() => "table-row"}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MilkRequiredReport;
