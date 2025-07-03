import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag, Button, Space } from "antd";
import { getUserData, getUserToken } from "../../Utils/Data";
import { getSlotMapping } from "../../Services/ApiService";
import dayjs from "dayjs";
import "../../Styles/pages/_distributordashboard.scss";
import CustomButton from "./CustomButton";

// Get tag color based on milk_given_status (string)
const getMilkStatusTagColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "given":
      return "blue";
    case "missed":
      return "red";
    case "partially given":
      return "gold";
    case "upcoming":
      return "orange";
    default:
      return "default";
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
  milk_given_status: string;
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
    <div className="" style={{ userSelect: "none" }}>
      <Card
        title={
          customerType === "all" ? "Customer List" : "Cancelled Customer List"
        }
        extra={
          <Space>
            <CustomButton
              text="All"
              onClick={() => handleSlotChange("all")}
              className={` ${slot === "all" ? "list-btn" : "select-btn"} `}
            />
            <CustomButton
              text="Morning"
              onClick={() => handleSlotChange("morning")}
              className={` ${slot === "morning" ? "list-btn" : "select-btn"} `}
            />
            <CustomButton
              text="Evening"
              onClick={() => handleSlotChange("evening")}
              className={` ${slot === "evening" ? "list-btn" : "select-btn"} `}
            />
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
            <Row gutter={[16, 16]}>
              {dataToShow.map((item, index) => (
                <Col
                  key={item.customer_id || `${item.customer_name}-${index}`}
                  xs={24}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={8}
                >
                  <Card className="customer-slot-card">
                    {/* Customer name in a single full-width line */}
                    <div
                      style={{
                        marginBottom: 8,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.customer_name}
                    </div>

                    {/* Info grid */}
                    <Row gutter={[8, 8]}>
                      <Col span={12}>Slot: {item.slot_name}</Col>
                      <Col span={12}>Required: {item.actual_milk_quantity}</Col>
                      <Col span={12}>Given: {item.milk_given_quantity}</Col>
                      <Col span={12}>
                        <Tag
                          color={getMilkStatusTagColor(item.milk_given_status)}
                        >
                          {item.milk_given_status}
                        </Tag>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CustomerSlotCards;
