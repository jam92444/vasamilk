import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import dayjs, { Dayjs } from "dayjs";
import CustomCalendar from "../../../Components/UI/CustomCalendar";
import CustomerSlotCards from "../../../Components/UI/CustomerSlotCards";
import "../../../Styles/pages/_distributordashboard.scss";
import {
  dailyInventoryByDate,
  getRouteOfDistributor,
} from "../../../Services/ApiService";
import { getUserData, getUserToken } from "../../../Utils/Data";

interface MilkSlotData {
  slot_id: number;
  total_quantity: string;
  given_quantity: string;
  scheduled_date: string;
}

interface RouteItem {
  id: number;
  line_name: string;
  status: number;
}

const DistributorDashboard: React.FC = () => {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const [remaining, setRemaining] = useState<number>(0);
  const [milkData, setMilkData] = useState<MilkSlotData[]>([]);
  const [route, setRoute] = useState<RouteItem[]>([]);

  const disabledDate = (current: Dayjs) =>
    Boolean(current && current > today.endOf("day"));

  const fetchDailyData = () => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("from_date", selectedDate.format("YYYY-MM-DD"));
    dailyInventoryByDate(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setRemaining(parseFloat(res.data.current_hold_quantity || "0"));
          setMilkData(res.data.data || []);
        }
      })
      .catch(console.error);
  };

  const fetchDistributorRoute = () => {
    const distributorId = getUserData().user_id;
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("from_date", selectedDate.format("YYYY-MM-DD"));
    formData.append("distributer_id", distributorId.toString());
    formData.append("type", "2");
    getRouteOfDistributor(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setRoute(res.data.data || []);
        }
      })
      .catch(console.error);
  };

  useEffect(fetchDailyData, [selectedDate]);
  useEffect(fetchDistributorRoute, [selectedDate]);

  const morning = milkData.find((m) => m.slot_id === 1) || {
    total_quantity: "0",
    given_quantity: "0",
  };
  const evening = milkData.find((m) => m.slot_id === 2) || {
    total_quantity: "0",
    given_quantity: "0",
  };

  const totalMorning = parseFloat(morning.total_quantity);
  const givenMorning = parseFloat(morning.given_quantity);
  const totalEvening = parseFloat(evening.total_quantity);
  const givenEvening = parseFloat(evening.given_quantity);

  const stats = [
    {
      title: "Total Scheduled",
      value: `${totalMorning + totalEvening} L`,
      color: "#3f8600",
    },
    { title: "Remaining in Stock", value: `${remaining} L` },
    { title: "Morning Scheduled", value: `${totalMorning} L` },
    { title: "Morning Delivered", value: `${givenMorning} L` },
    { title: "Evening Scheduled", value: `${totalEvening} L` },
    { title: "Evening Delivered", value: `${givenEvening} L` },
    {
      title: "Total Delivered",
      value: `${givenMorning + givenEvening} L`,
    },
  ];

  return (
    <div className="container distributor-dashboard" style={{ padding: 16 }}>
      {/* Routes */}
      <Card
        title="Routes to Cover"
        className="routes-card title"
        style={{ marginBottom: 24 }}
        variant="outlined"
      >
        {route && route.length > 0 ? (
          <Row gutter={[8, 8]}>
            {route.map((r) => (
              <Col key={r.id} xs={24} sm={12} md={8} lg={6}>
                <div className="route-item">{r.line_name}</div>
              </Col>
            ))}
          </Row>
        ) : (
          <p style={{ padding: "1rem", textAlign: "center", fontSize: "16px" }}>
            No routes had assigned.
          </p>
        )}
      </Card>

      {/* Calendar & Stats */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            className="title"
            title="Select Delivery Date"
            variant="outlined"
          >
            <CustomCalendar
              disabledDate={disabledDate}
              onSelect={setSelectedDate}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Row gutter={[8, 8]}>
            {stats.map((s, i) => (
              <Col xs={12} sm={12} md={12} lg={12} key={i}>
                <Card
                  variant="outlined"
                  style={{
                    minHeight: 130, // Adjust height as needed
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Statistic
                    title={s.title}
                    value={s.value}
                    valueStyle={{ color: s.color }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Customer Cards */}

      <CustomerSlotCards
        customerType="all"
        selectedDate={selectedDate.format("YYYY-MM-DD")}
      />

      <CustomerSlotCards
        customerType="cancel"
        selectedDate={selectedDate.format("YYYY-MM-DD")}
      />
    </div>
  );
};

export default DistributorDashboard;
