import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import dayjs, { Dayjs } from "dayjs";
import CustomCalendar from "../../../Components/UI/CustomCalendar";
import CustomerSlotCards from "../../../Components/UI/CustomerSlotCards";
import "../../../Styles/pages/_distributordashboard.scss";

const DistributorDashboard: React.FC = () => {
  const today = dayjs();

  const disabledDate = (current: Dayjs) => {
    return current && current > today.endOf("day");
  };

  const handleDateSelect = (date: Dayjs) => {
    console.log("Selected Date:", date.format("YYYY-MM-DD"));
    // Optional: set state to filter slot data by date
  };

  return (
    <div className="container" style={{ padding: 16 }}>
      <Row gutter={[24, 24]}>
        {/* Left: Calendar */}
        <Col xs={24} lg={12}>
          <Card title="Select Delivery Date" variant="borderless">
            <CustomCalendar
              disabledDate={disabledDate}
              onSelect={handleDateSelect}
            />
          </Card>
        </Col>

        {/* Right: Stats */}
        <Col xs={24} lg={12}>
          <Row gutter={[16, 16]}>
            {[
              {
                title: "Total Milk Delivered Today",
                value: "1,000 L",
                color: "#3f8600",
              },
              { title: "Morning Slot", value: "600 L" },
              { title: "Evening Slot", value: "400 L" },
              { title: "Routes to Cover", value: 15 },
              { title: "Number of Customers", value: 120 },
            ].map((stat, index) => (
              <Col span={12} xs={12} sm={12} md={12} lg={12} key={index}>
                <Card variant="borderless">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    valueStyle={{ color: stat.color || undefined }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Customer Cards */}
      <Card
        title="Customer Slot Overview"
        style={{ marginTop: 32 }}
        variant="borderless"
      >
        <CustomerSlotCards />
      </Card>
    </div>
  );
};

export default DistributorDashboard;
