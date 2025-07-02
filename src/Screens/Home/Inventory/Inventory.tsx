import React, { useEffect, useState } from "react";
import { Spin, Alert } from "antd";
import { dailyInventoryReport } from "../../../Services/ApiService";
import InventoryStats from "./InventoryStats";
import InventoryChart from "../charts/InventoryChart";
import InventoryList from "./InventoryList";
import MilkRequiredReport from "./MilkRequiredReport";
import "../../../Styles/pages/_inventory.scss";
import { useUserDetails } from "../../../Utils/Data";

interface SlotReport {
  eve_slot_count: number;
  mrng_slot_count: number;
  total_inventory_count: number;
}

const Inventory: React.FC = () => {
  const { token } = useUserDetails();
  const [dailySlotReport, setDailySlotReport] = useState<SlotReport | null>(
    null
  );
  const formData = new FormData();
  formData.append("token", token);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGetReport = () => {
    setLoading(true);
    dailyInventoryReport(formData)
      .then((res) => {
        const data = res.data?.data?.[0];

        if (data) {
          setDailySlotReport(data);
        } else {
          setError("No inventory data found");
        }
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to fetch inventory report");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleGetReport();
  }, []);

  if (loading) {
    return (
      <Spin
        tip="Loading inventory report..."
        style={{ margin: "2rem auto", display: "block" }}
      />
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: "1rem" }}
      />
    );
  }

  return (
    <div className="inventory">
      <h2>INVENTORY</h2>
      {dailySlotReport && (
        <InventoryStats
          eve_slot_count={dailySlotReport.eve_slot_count || 0}
          mrng_slot_count={dailySlotReport.mrng_slot_count || 0}
          total_inventory_count={dailySlotReport.total_inventory_count || 0}
        />
      )}
      <div>
        <InventoryChart />
        <MilkRequiredReport />
        <InventoryList />
      </div>
    </div>
  );
};

export default Inventory;
