import { Card, Col, Row, Tag } from "antd";
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

const tableData = [
  {
    key: 1,
    customer: "Mohan",
    slot: "Morning",
    quantity: "5L",
    status: "Upcoming",
  },
  {
    key: 2,
    customer: "Jamal",
    slot: "Evening",
    quantity: "3L",
    status: "Missing",
  },
  {
    key: 3,
    customer: "Boobalan",
    slot: "Morning",
    quantity: "2L",
    status: "Cancelled",
  },
  {
    key: 11,
    customer: "Mohan",
    slot: "Morning",
    quantity: "5L",
    status: "Upcoming",
  },
  {
    key: 12,
    customer: "Jamal",
    slot: "Evening",
    quantity: "3L",
    status: "Missing",
  },
  {
    key: 13,
    customer: "Boobalan",
    slot: "Morning",
    quantity: "2L",
    status: "Cancelled",
  },
];

const CustomerSlotCards = () => {
  return (
    <Row gutter={[16, 16]} className="container">
      {tableData.map((item) => (
        <Col key={item.key} xs={24} sm={12} md={8} lg={6}>
          <Card
            title={item.customer}
            bordered={false}
            hoverable
            style={{
              borderLeft: `4px solid ${getStatusTagColor(item.status)}`,
            }}
          >
            <p>
              <strong>Slot:</strong> {item.slot}
            </p>
            <p>
              <strong>Quantity:</strong> {item.quantity}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag color={getStatusTagColor(item.status)}>{item.status}</Tag>
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
export default CustomerSlotCards;
