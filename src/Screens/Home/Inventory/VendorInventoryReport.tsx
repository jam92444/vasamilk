import { useState, useEffect } from "react";
import {
  Card,
  Descriptions,
  Spin,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  Form,
  Typography,
  Space,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { getVendorMilkReport } from "../../../Services/ApiService";
import { toast } from "react-toastify";
import { useUserDetails } from "../../../Utils/Data";

const { RangePicker } = DatePicker;
const { Title } = Typography;

interface VendorReport {
  remaining_qty: number;
  vendor_sales_qty: number;
  distributor_taken_qty: number;
  distributor_return_qty: number;
  distributor_sales_qty: number;
}

const VendorMilkReport = () => {
  const [report, setReport] = useState<VendorReport | null>(null);
  const [loading, setLoading] = useState(false);
  const { token, userDetails } = useUserDetails();

  // Initial values for reset
  const initialDistributorId = userDetails?.distributor_id ?? 0;
  const initialDateRange: [Dayjs, Dayjs] = [dayjs(), dayjs()];
  const initialLogType = 0;

  // Form inputs
  const [distributorId, setDistributorId] =
    useState<number>(initialDistributorId);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>(initialDateRange);
  const [logType, setLogType] = useState<number>(initialLogType);

  // Fetch report on mount
  useEffect(() => {
    fetchVendorReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVendorReport = async () => {
    if (!token) {
      toast.error("Authentication token is missing.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("token", token);
    formData.append("distributor_id", String(distributorId));
    formData.append("from_date", dateRange[0].format("YYYY-MM-DD"));
    formData.append("to_date", dateRange[1].format("YYYY-MM-DD"));
    formData.append("log_type", String(logType));

    const res = await getVendorMilkReport(formData);
    if (res.data.status === 1) {
      setReport(res.data.data);
    } else {
      toast.error(res.data.msg || "Failed to load vendor report.");
      setReport(null);
    }
  };

  // Reset filters to initial values
  const resetFilters = () => {
    setDistributorId(initialDistributorId);
    setDateRange(initialDateRange);
    setLogType(initialLogType);
    setReport(null);
  };

  const reportItems = report
    ? [
        { label: "Remaining Quantity (L)", value: report.remaining_qty },
        { label: "Vendor Sales (L)", value: report.vendor_sales_qty },
        { label: "Distributor Taken (L)", value: report.distributor_taken_qty },
        {
          label: "Distributor Return (L)",
          value: report.distributor_return_qty,
        },
        { label: "Distributor Sales (L)", value: report.distributor_sales_qty },
      ]
    : [];

  return (
    <div className="p-3" style={{ margin: "3rem 0" }}>
      <Title level={3}>Vendor Milk Report</Title>

      {/* Filters Section */}
      <Card style={{ marginBottom: 24 }}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Distributor ID">
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  value={distributorId}
                  onChange={(val) => setDistributorId(val ?? 0)}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Date Range">
                <RangePicker
                  value={dateRange}
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  onChange={(dates) =>
                    setDateRange(
                      dates && dates[0] && dates[1]
                        ? [dates[0], dates[1]]
                        : [dayjs(), dayjs()]
                    )
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Log Type">
                <Select<number>
                  value={logType}
                  style={{ width: "100%" }}
                  onChange={(val) => setLogType(val)}
                >
                  <Select.Option value={0}>All</Select.Option>
                  <Select.Option value={1}>In</Select.Option>
                  <Select.Option value={2}>Out</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Space>
            <Button
              type="primary"
              onClick={fetchVendorReport}
              loading={loading}
            >
              Fetch Report
            </Button>
            <Button onClick={resetFilters} disabled={loading}>
              Reset
            </Button>
          </Space>
        </Form>
      </Card>

      {/* Report Section */}
      {loading ? (
        <Spin />
      ) : report ? (
        <Descriptions bordered column={1} size="middle">
          {reportItems.map((item) => (
            <Descriptions.Item key={item.label} label={item.label}>
              {item.value}
            </Descriptions.Item>
          ))}
        </Descriptions>
      ) : (
        <p>No data to display.</p>
      )}
    </div>
  );
};

export default VendorMilkReport;
