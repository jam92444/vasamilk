import { useEffect, useState } from "react";
import { Typography, Card, Spin, Row, Col } from "antd";
import { getdailyMilkRequired } from "../../../Services/ApiService";
import { getDecryptedCookie } from "../../../Utils/cookies";
import "../../../Styles/pages/MilkRequiredReport.scss";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../Components/UI/CustomButton";
import { useUserDetails } from "../../../Utils/Data";

const { Title } = Typography;

const MilkRequiredReport = () => {
  const navigate = useNavigate();
  const { token } = useUserDetails();
  const [requiredMilk, setRequiredMilk] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const formData = new FormData();
    formData.append("token", token);
    handleGetRequiredMilkReport(formData);
  }, []);

  // get milk required data
  const handleGetRequiredMilkReport = async (formData: FormData) => {
    setLoading(true);
    const res = await getdailyMilkRequired(formData);

    if (res.data.status === 1) {
      setRequiredMilk(res.data.data || []);
    } else {
      console.error("API Error:", res.data);
    }
    setLoading(false);
  };

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

  // view slot handlers
  const handleNavigate = (mode: number, slot_id: number) => {
    navigate("/inventory/slot", { state: { mode, slot_id } });
  };
  return (
    <div className="milk-required-report">
      <Title
        level={4}
        style={{
          textAlign: "start",
          marginBottom: 24,
          fontWeight: 600,
        }}
      >
        Daily Milk Requirement
      </Title>
      <Spin spinning={loading} tip="Loading data...">
        <Row justify="center">
          <Col xs={24}>
            <Card bordered={false} className="summary-card-container">
              {/* Summary Cards */}
              <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                  <Card title="Vendor - Morning" className="summary-card">
                    <p>{grouped["Morning"]?.Vendor || "0.000"} Litres</p>
                    <CustomButton
                      text="View Slot"
                      className="button"
                      onClick={() => handleNavigate(1, 1)}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                  <Card title="Vendor - Evening" className="summary-card">
                    <p>{grouped["Evening"]?.Vendor || "0.000"} Litres</p>
                    <CustomButton
                      text="View Slot"
                      className="button"
                      onClick={() => handleNavigate(1, 2)}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                  <Card title="Distributor - Morning" className="summary-card">
                    <p>{grouped["Morning"]?.Distributor || "0.000"} Litres</p>
                    <CustomButton
                      text="View Slot"
                      className="button"
                      onClick={() => handleNavigate(2, 1)}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                  <Card title="Distributor - Evening" className="summary-card">
                    <p>{grouped["Evening"]?.Distributor || "0.000"} Litres</p>
                    <CustomButton
                      text="View Slot"
                      className="button"
                      onClick={() => handleNavigate(2, 2)}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Table */}
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default MilkRequiredReport;
