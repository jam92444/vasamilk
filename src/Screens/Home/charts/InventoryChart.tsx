import ReactApexChart from "react-apexcharts";
import { getUserToken } from "../../../Utils/Data";
import { useEffect, useState } from "react";
import { dailyInventoryReport } from "../../../Services/ApiService";
import type { ApexOptions } from "apexcharts";
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

  const formData = new FormData();
  formData.append("token", getUserToken());
  const handleGetReport = () => {
    setLoading(true);
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
          new Set([...Array.from(mrngMap.keys()), ...Array.from(eveMap.keys())])
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
  };
  // parse first date for month name
  const firstDateStr = chartData.categories[0];
  let monthTitle = "Month";

  if (firstDateStr) {
    const parts = firstDateStr.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const date = new Date(`${year}-${month}-${day}`);
      monthTitle =
        date.toLocaleDateString("en-US", { month: "long" }) + " Month";
    }
  }

  useEffect(() => {
    handleGetReport();
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "line",
      toolbar: { show: false },
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
          if (!value) return ""; // handle undefined or empty

          const parts = value.split("-");
          if (parts.length !== 3) return value; // unexpected format, fallback to original

          const [day, month, year] = parts;
          const date = new Date(`${year}-${month}-${day}`);

          return date.toLocaleDateString("en-US", {
            day: "numeric",
          });
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
