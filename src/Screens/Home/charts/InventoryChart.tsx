import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Spin, Alert } from "antd";
import type { ApexOptions } from "apexcharts";

import { getUserToken } from "../../../Utils/Data";
import { dailyInventoryReport } from "../../../Services/ApiService";
import "../../../Styles/pages/_inventory.scss";

const InventoryChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{
    series: { name: string; data: number[] }[];
    categories: string[];
  }>({
    series: [],
    categories: [],
  });

  useEffect(() => {
    const token = getUserToken();
    if (!token) {
      setError("User token not found");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("token", token);

    dailyInventoryReport(formData)
      .then((res) => {
        const blocks = res.data?.data;
        if (!Array.isArray(blocks) || blocks.length === 0) {
          setError("No inventory data found");
          return;
        }

        const mrngMap = new Map<string, number>();
        const eveMap = new Map<string, number>();

        blocks.forEach((block) => {
          block.mrng_data?.forEach((item: any) => {
            const current = mrngMap.get(item.date) || 0;
            mrngMap.set(item.date, current + item.total_quantity);
          });

          block.evening_data?.forEach((item: any) => {
            const current = eveMap.get(item.date) || 0;
            eveMap.set(item.date, current + item.total_quantity);
          });
        });

        const allDates = Array.from(
          new Set([...mrngMap.keys(), ...eveMap.keys()])
        ).sort((a, b) => {
          const [da, ma, ya] = a.split("-").map(Number);
          const [db, mb, yb] = b.split("-").map(Number);
          return (
            new Date(ya, ma - 1, da).getTime() -
            new Date(yb, mb - 1, db).getTime()
          );
        });

        const morningQuantities = allDates.map(
          (date) => mrngMap.get(date) || 0
        );
        const eveningQuantities = allDates.map((date) => eveMap.get(date) || 0);

        setChartData({
          series: [
            { name: "Morning Slots", data: morningQuantities },
            { name: "Evening Slots", data: eveningQuantities },
          ],
          categories: allDates,
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch inventory report");
      })
      .finally(() => setLoading(false));
  }, []);

  const firstDateStr = chartData.categories[0];
  let monthTitle = "Month";

  if (firstDateStr) {
    const [day, month, year] = firstDateStr.split("-");
    const parsed = new Date(`${year}-${month}-${day}`);
    if (!isNaN(parsed.getTime())) {
      monthTitle =
        parsed.toLocaleDateString("en-US", { month: "long" }) + " Month";
    }
  }

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false }, // <-- disable zoom to avoid passive event warning
      animations: { enabled: true }, // optional, you can keep or remove
    },
    colors: ["#52c41a", "blue"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    title: {
      text: "Inventory Report - Morning vs Evening Slots",
      align: "left",
    },
    xaxis: {
      categories: chartData.categories,
      title: { text: monthTitle },
      labels: {
        formatter: (value: string | undefined) => {
          if (!value) return "";
          const [day, month, year] = value.split("-");
          const date = new Date(`${year}-${month}-${day}`);
          return isNaN(date.getTime())
            ? value
            : date.toLocaleDateString("en-US", { day: "numeric" });
        },
      },
    },
    yaxis: {
      title: { text: "Slot Quantity" },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  };

  if (loading) {
    return (
      <div
        className="inventory-graph"
        style={{ textAlign: "center", padding: "2rem" }}
      >
        <Spin tip="Loading inventory chart..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="inventory-graph" style={{ padding: "1rem" }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="inventory-graph">
      <ReactApexChart
        options={options}
        series={chartData.series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default InventoryChart;
