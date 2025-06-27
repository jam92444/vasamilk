import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import "../../Styles/components/_inventory-stats.scss"; // Optional: Add styles here
import asset from "../../Utils/asset";

interface InventoryStatsProps {
  eve_slot_count: number;
  mrng_slot_count: number;
  total_inventory_count: number;
}

const InventoryStats: React.FC<InventoryStatsProps> = ({
  eve_slot_count,
  mrng_slot_count,
  total_inventory_count,
}) => {
  return (
    <div className="inventory-stats-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Inventory"
              value={total_inventory_count}
              valueStyle={{
                color: "#cf1322",
                fontSize: "1.6rem",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              prefix={<img src={asset.redBox} width={24} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false}>
            <Statistic
              title="Morning Slot Count"
              value={mrng_slot_count}
              valueStyle={{
                color: "#3f8600",
                fontSize: "1.5rem",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              prefix={<img src={asset.greenBox} width={24} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card bordered={false}>
            <Statistic
              title="Evening Slot Count"
              value={eve_slot_count}
              valueStyle={{
                color: "#1d39c4",
                fontSize: "1.5rem",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              prefix={<img src={asset.blueBox} width={24} />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InventoryStats;
