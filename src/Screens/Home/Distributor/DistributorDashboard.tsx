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
import AppLoader from "../../../Components/UI/AppLoader";
import { useAuth } from "../../../Context/AuthContext";

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
  const { loading, setLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState(today);
  const [remaining, setRemaining] = useState<number>(0);
  const [milkData, setMilkData] = useState<MilkSlotData[]>([]);
  const [route, setRoute] = useState<RouteItem[]>([]);

  const disabledDate = (current: Dayjs) =>
    Boolean(current && current > today.endOf("day"));

  const fetchDailyData = async () => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("from_date", selectedDate.format("YYYY-MM-DD"));

    try {
      const res = await dailyInventoryByDate(formData);
      if (res.data.status === 1) {
        setRemaining(parseFloat(res.data.current_hold_quantity || "0"));
        setMilkData(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching daily inventory:", error);
    }
  };

  const fetchDistributorRoute = async () => {
    const distributorId = getUserData().user_id;
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("from_date", selectedDate.format("YYYY-MM-DD"));
    formData.append("distributer_id", distributorId.toString());
    formData.append("type", "2");

    try {
      const res = await getRouteOfDistributor(formData);
      if (res.data.status === 1) {
        setRoute(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchDistributorRoute();
    fetchDailyData();
    setLoading(false);
  }, [selectedDate]);

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
      title: "Morning Delivery",
      scheduled: `${totalMorning} L`,
      delivered: `${givenMorning} L`,
      color: "#3f8600",
      single: false,
    },
    {
      title: "Evening Delivery",
      scheduled: `${totalEvening} L`,
      delivered: `${givenEvening} L`,
      color: "#1890ff",
      single: false,
    },
    {
      title: "Total",
      scheduled: `${totalMorning + totalEvening} L`,
      delivered: `${givenMorning + givenEvening} L`,
      color: "#722ed1",
      single: false,
    },
    {
      title: "Remaining in Stock",
      scheduled: `${remaining} L`,
      color: "#fa541c",
      single: true,
    },
  ];

  if (loading) {
    return <AppLoader message="Fetching dashboard data..." />;
  }

  return (
    <div className="container distributor-dashboard" style={{ padding: 16 }}>
      {/* Calendar & Stats */}
      {/* <AppLoader message="Fetching dashboard data..." /> */}
      <Row gutter={[24, 24]}>
        {/* Calendar */}
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

        {/* Routes and Stats */}
        <Col xs={24} lg={12}>
          <Card
            title="Routes to Cover"
            className="routes-card title"
            variant="outlined"
          >
            {route && route.length > 0 ? (
              <Row gutter={[8, 8]}>
                {route.map((r) => (
                  <Col key={r.id} xs={12} sm={6}>
                    <div className="route-item">{r.line_name}</div>
                  </Col>
                ))}
              </Row>
            ) : (
              <p
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  fontSize: "16px",
                }}
              >
                No routes assigned.
              </p>
            )}
          </Card>

          <Row gutter={[10, 10]}>
            {stats.map((stat, i) => (
              <Col xs={24} sm={12} key={i}>
                <Card
                  variant="outlined"
                  style={{
                    minHeight: 140,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "start",
                  }}
                >
                  <h4 style={{ marginBottom: 8 }}>{stat.title}</h4>
                  {stat.single ? (
                    <Statistic
                      value={stat.scheduled}
                      valueStyle={{ color: stat.color }}
                    />
                  ) : (
                    <Row justify="space-between">
                      <Col>
                        <Statistic
                          title="Scheduled"
                          value={stat.scheduled}
                          style={{ paddingRight: "10px" }}
                          valueStyle={{ color: stat.color }}
                        />
                      </Col>
                      <Col>
                        <Statistic
                          title="Delivered"
                          value={stat.delivered}
                          valueStyle={{ color: "#595959" }}
                        />
                      </Col>
                    </Row>
                  )}
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
