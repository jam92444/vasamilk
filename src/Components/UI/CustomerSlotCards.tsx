import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag, Button, Space } from "antd";
import { getUserData, getUserToken } from "../../Utils/Data";
import { getSlotMapping } from "../../Services/ApiService";
import dayjs from "dayjs";
import "../../Styles/pages/_distributordashboard.scss";

// Map status to Ant Design Tag colors
const getStatusTagColor = (status: number) => {
  switch (status) {
    case 1:
      return "blue"; // Given
    case 2:
      return "orange"; // Upcoming
    case 3:
      return "gold"; // Partially Given
    case 4:
      return "red"; // Cancelled
    default:
      return "default";
  }
};

// Map status number to readable label
const getStatusLabel = (status: number) => {
  switch (status) {
    case 1:
      return "Given";
    case 2:
      return "Upcoming";
    case 3:
      return "Partially Given";
    case 4:
      return "Cancelled";
    default:
      return "Unknown";
  }
};

interface Props {
  selectedDate: string;
  customerType?: string;
}

interface CustomerData {
  customer_id: number;
  customer_name: string;
  slot_name: string;
  actual_milk_quantity: string;
  milk_given_quantity: string;
  status: number;
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
    const size = 20;
    const formData = new FormData();

    formData.append("token", getUserToken());
    formData.append("distributor_id", getUserData().user_id.toString());
    formData.append("from_date", today);
    formData.append("to_date", selectedDate);
    formData.append("status", customerType === "all" ? "1,2,3" : "4");
    formData.append("mode", "2");

    if (slot === "morning") formData.append("slot_id", "1");
    if (slot === "evening") formData.append("slot_id", "2");

    getSlotMapping(page, size, formData)
      .then((res) => {
        if (res.data.status === 1) {
          const customerList = res.data.data || [];
          if (customerType === "all") {
            setAllCustomerData(customerList);
          } else {
            setCancelledCustomerData(customerList);
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

  const handleSlotChange = (type: string) => setSlot(type);

  const dataToShow =
    customerType === "all" ? allCustomerData : cancelledCustomerData;

  return (
    <div className="container" style={{ userSelect: "none" }}>
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
          customerType === "all" ? "listCard" : "listCard-2"
        }`}
      >
        <div className="customer-slot-cards">
          {dataToShow.length === 0 ? (
            <p style={{ padding: "1rem", textAlign: "center" }}>
              No records found.
            </p>
          ) : (
            dataToShow.map((item, index) => (
              <Card
                key={item.customer_id || `${item.customer_name}-${index}`}
                className="customer-slot-card"
              >
                <Row
                  className="card-row"
                  align="middle"
                  justify="space-between"
                  wrap
                >
                  <Col xs={24} sm={12} md={4}>
                    <strong>{item.customer_name}</strong>
                  </Col>
                  <Col xs={24} sm={12} md={4}>
                    Slot: {item.slot_name}
                  </Col>
                  <Col xs={24} sm={12} md={4}>
                    Required: {item.actual_milk_quantity}
                  </Col>
                  <Col xs={24} sm={12} md={4}>
                    Given: {item.milk_given_quantity}
                  </Col>
                  <Col xs={24} sm={12} md={4}>
                    <Tag color={getStatusTagColor(item.status)}>
                      {getStatusLabel(item.status)}
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
