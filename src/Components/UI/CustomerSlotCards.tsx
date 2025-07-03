import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag, Button, Space } from "antd";
import { getUserData, getUserToken } from "../../Utils/Data";
import { getSlotMapping } from "../../Services/ApiService";
import dayjs from "dayjs";
import "../../Styles/pages/_distributordashboard.scss";

const getStatusTagColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "upcoming":
      return "blue";
    case "missing":
      return "orange";
    case "cancelled":
      return "red";
    default:
      return "default";
  }
};

interface Props {
  selectedDate: string;
  customerType?: string;
}

interface CustomerData {
  id: number;
  customer: string;
  slot: string;
  quantity: string;
  given_quantity: string;
  status: string;
}

const CustomerSlotCards: React.FC<Props> = ({
  selectedDate,
  customerType = "all",
}) => {
  const [allCustomerData, setAllCustomerData] = useState<CustomerData[]>([]);
  const [cancelledCustomerData, setCancelledCustomerData] = useState<
    CustomerData[]
  >([]);
  const [slot, setSlot] = useState<string>("all");

  const today = dayjs().format("YYYY-MM-DD");

  const fetchCustomerData = () => {
    const page = 1;
    const size = 100;
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("distributor_id", getUserData().user_type.toString());
    formData.append("from_date", today);
    formData.append("to_date", selectedDate);

    // status: 1-upcoming, 2-missing, 3-completed, 4-cancelled
    formData.append("status", customerType === "all" ? "1,2,3" : "4");
    formData.append("mode", "2");

    if (slot === "morning") formData.append("slot_id", "1");
    if (slot === "evening") formData.append("slot_id", "2");

    getSlotMapping(page, size, formData)
      .then((res) => {
        if (res.data.status === 1) {
          if (customerType === "all") {
            setAllCustomerData(res.data.data || []);
          } else {
            setCancelledCustomerData(res.data.data || []);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  };

  useEffect(() => {
    fetchCustomerData();
  }, [selectedDate, slot, customerType]);

  const handleSlotChange = (type: string) => {
    setSlot(type);
  };

  const dataToShow =
    customerType === "all" ? allCustomerData : cancelledCustomerData;

  return (
    <div>
      <Card
        title={
          customerType === "all" ? "Customer List" : "Cancelled Customer List"
        }
        extra={
          <Space>
            <Button
              type={slot === "all" ? "primary" : "default"}
              onClick={() => handleSlotChange("all")}
              size="small"
            >
              All
            </Button>
            <Button
              type={slot === "morning" ? "primary" : "default"}
              onClick={() => handleSlotChange("morning")}
              size="small"
            >
              Morning
            </Button>
            <Button
              type={slot === "evening" ? "primary" : "default"}
              onClick={() => handleSlotChange("evening")}
              size="small"
            >
              Evening
            </Button>
          </Space>
        }
        className={`customer-slot-card-container ${
          customerType == "all" ? "listCard" : "listCard-2"
        } `}
      >
        <div className="customer-slot-cards">
          {dataToShow.length === 0 ? (
            <p style={{ padding: "1rem", textAlign: "center" }}>
              No records found.
            </p>
          ) : (
            dataToShow.map((item) => (
              <Card key={item.id} className="customer-slot-card">
                <Row
                  className="card-row"
                  align="middle"
                  justify="space-between"
                  wrap
                >
                  <Col xs={24} sm={12} md={4}>
                    <strong>{item.customer}</strong>
                  </Col>
                  <Col xs={24} sm={12} md={4}>
                    Slot: {item.slot}
                  </Col>
                  <Col xs={24} sm={12} md={4}>
                    Required: {item.quantity}
                  </Col>
                  <Col xs={24} sm={12} md={4}>
                    Given: {item.given_quantity}
                  </Col>
                  <Col xs={24} sm={12} md={4}>
                    <Tag color={getStatusTagColor(item.status)}>
                      {item.status}
                    </Tag>
                  </Col>
                </Row>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default CustomerSlotCards;
