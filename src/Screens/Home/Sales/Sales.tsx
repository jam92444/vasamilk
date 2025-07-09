import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CustomButton from "../../../Components/UI/CustomButton";
import CustomSelect from "../../../Components/UI/CustomSelect";
import CustomInput from "../../../Components/UI/CustomInput";
import {
  getListDistributorLog,
  getVendorMilkReport,
} from "../../../Services/ApiService";
import { getUserToken } from "../../../Utils/Data";
import dayjs from "dayjs";
import "../../../Styles/pages/_sales.scss";
import { useDropdownData } from "../../../Hooks/DropDowns";
import type { TablePaginationConfig } from "antd";
import { useAuth } from "../../../Context/AuthContext";
import AppLoader from "../../../Components/UI/AppLoader";
import CustomTable from "../../../Components/UI/CustomTable";
import type { ColumnsType } from "antd/es/table";

const Sales = () => {
  const navigate = useNavigate();
  const {
    distributorDropDown,
    distributorDropdownOptions,
    vendorDropDown,
    vendorDropdownOptions,
  } = useDropdownData();
  const { loading, setLoading } = useAuth();

  const [dataList, setDataList] = useState<any[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [milkReport, setMilkReport] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<string>("vendor");
  const [distributor, setDistributor] = useState<string | null>(null);
  const [vendor, setVendor] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState<string>(dayjs().format("YYYY-MM-DD"));

  const userTypeOptions = [
    { label: "Vendor", value: "vendor" },
    { label: "Distributor", value: "distributor" },
  ];

  const columns: ColumnsType<any> = [
    {
      title: "S.No",
      render: (_: any, __: any, index: number) =>
        ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 10) +
        index +
        1,
      width: 60,
    },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (value: any) => (value ? value : "-"),
    },
    {
      title: "Given By",
      dataIndex: "given_by_name",
      key: "given_by_name",
    },
    {
      title: "Slot",
      dataIndex: "slot_name",
      key: "slot_name",
    },
    {
      title: "Type",
      dataIndex: "type_name",
      key: "type_name",
    },
    {
      title: "Previous Qty",
      dataIndex: "pervious_quantity",
      key: "pervious_quantity",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Remaining Qty",
      dataIndex: "remaining_quantity",
      key: "remaining_quantity",
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm"),
    },
  ];

  const handleGetVendorMilkReport = () => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("from_date", fromDate);
    formData.append("to_date", toDate);

    const idValue =
      selectedType === "vendor"
        ? vendor
        : selectedType === "distributor"
        ? distributor
        : null;

    if (idValue) {
      formData.append("distributor_id", idValue); // key remains distributor_id
    }

    setLoading(true);
    getVendorMilkReport(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setMilkReport(res.data.data);
        } else {
          setMilkReport(null);
          console.info(res.data.msg);
        }
      })
      .catch((error) => {
        console.error("Milk Report Error:", error);
        setMilkReport(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGetDistributorList = () => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("from_date", fromDate);
    formData.append("to_date", toDate);
    formData.append("log_type", selectedType === "distributor" ? "1" : "2");

    const idValue =
      selectedType === "vendor"
        ? vendor
        : selectedType === "distributor"
        ? distributor
        : null;

    if (idValue) {
      formData.append("distributor_id", idValue); // unified key
    }

    setLoading(true);
    getListDistributorLog(
      pagination.current ?? 1,
      pagination.pageSize ?? 10,
      formData
    )
      .then((res) => {
        if (res.data.status === 1) {
          setDataList(res.data.data || []);
          setPagination((prev) => ({
            ...prev,
            total: res.data.total_count || 0,
            current: res.data.page || prev.current,
            pageSize: res.data.size || prev.pageSize,
          }));
        } else {
          setDataList([]);
          setPagination((prev) => ({ ...prev, total: 0 }));
          console.info(res.data.msg);
        }
      })
      .catch((err) => {
        console.error(err);
        setDataList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    distributorDropDown();
    vendorDropDown();
  }, []);

  useEffect(() => {
    handleGetVendorMilkReport();
  }, [selectedType, fromDate, toDate, distributor, vendor]);

  useEffect(() => {
    handleGetDistributorList();
  }, [
    pagination.current,
    pagination.pageSize,
    selectedType,
    distributor,
    vendor,
    fromDate,
    toDate,
  ]);

  const handleResetFilters = () => {
    setSelectedType("vendor");
    setDistributor(null);
    setVendor(null);
    const today = dayjs().format("YYYY-MM-DD");
    setFromDate(today);
    setToDate(today);
    setPagination({ current: 1, pageSize: 10, total: 0 });
  };

  const renderReportData = () => {
    if (!milkReport) {
      return (
        <p style={{ marginTop: 20, color: "#999", fontWeight: 500 }}>
          No data available for the selected filters.
        </p>
      );
    }

    const displayFields =
      selectedType === "vendor"
        ? [
            { label: "Vendor Sales Quantity", key: "vendor_sales_qty" },
            { label: "Remaining Quantity", key: "remaining_qty" },
          ]
        : [
            {
              label: "Distributor Sales Quantity",
              key: "distributor_sales_qty",
            },
            {
              label: "Distributor Taken Quantity",
              key: "distributor_taken_qty",
            },
            {
              label: "Distributor Return Quantity",
              key: "distributor_return_qty",
            },
          ];

    return (
      <div className="info-grid">
        {displayFields.map(({ label, key }) => (
          <div className="info-field" key={key}>
            <div className="label">{label}</div>
            <div className="value text-info">{milkReport[key] ?? "-"}</div>
          </div>
        ))}
      </div>
    );
  };

  return loading ? (
    <AppLoader message="Loading Report..." />
  ) : (
    <div className="masters sales-report-page">
      <div className="management-title">
        <aside>Sales Report</aside>
        <CustomButton
          text="Back"
          onClick={() => navigate(-1)}
          className="btn"
        />
      </div>

      <div className="filter-section">
        <div className="filters">
          <CustomSelect
            label="Select Type"
            name="userType"
            className="fields"
            value={selectedType}
            options={userTypeOptions}
            onChange={(value) => {
              setSelectedType(value?.toString() || "vendor");
              setDistributor(null);
              setVendor(null);
              setPagination((prev) => ({ ...prev, current: 1 }));
            }}
          />

          {selectedType === "distributor" && (
            <CustomSelect
              label="Distributor"
              name="distributor"
              className="fields"
              value={distributor}
              options={distributorDropdownOptions.map((opt) => ({
                label: opt.label,
                value: String(opt.value),
              }))}
              onChange={(val: any) => {
                setDistributor(val?.toString() || "");
                setPagination((prev) => ({ ...prev, current: 1 }));
              }}
            />
          )}

          {selectedType === "vendor" && (
            <CustomSelect
              label="Vendor"
              name="vendor"
              className="fields"
              value={vendor}
              options={vendorDropdownOptions}
              onChange={(val: any) => {
                setVendor(val?.toString() || "");
                setPagination((prev) => ({ ...prev, current: 1 }));
              }}
            />
          )}

          <CustomInput
            label="From Date"
            type="date"
            name="fromDate"
            className="fields"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPagination((prev) => ({ ...prev, current: 1 }));
            }}
          />

          <CustomInput
            label="To Date"
            type="date"
            name="toDate"
            className="fields"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPagination((prev) => ({ ...prev, current: 1 }));
            }}
          />

          <CustomButton
            text="Reset"
            onClick={handleResetFilters}
            className="btn btn-reset"
          />
        </div>
      </div>

      {renderReportData()}

      <div style={{ marginTop: "30px" }}>
        <h3
          style={{
            marginBottom: "16px",
            fontSize: "18px",
            fontWeight: 600,
            color: "#1e88e5",
          }}
        >
          {selectedType === "distributor"
            ? "Distributor Distribution Log"
            : "Vendor Distribution Log"}
        </h3>
        <CustomTable
          columns={columns}
          data={dataList}
          loading={loading}
          pagination={pagination}
          rowKey="id"
          onChange={(newPagination) => {
            setPagination((prev) => ({
              ...prev,
              current: newPagination.current,
              pageSize: newPagination.pageSize,
            }));
          }}
          scrollX={1000}
        />
      </div>
    </div>
  );
};

export default Sales;
