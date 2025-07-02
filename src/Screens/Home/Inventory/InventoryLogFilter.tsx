import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { DatePicker, Button } from "antd";
import { useDropdownData } from "../../../Hooks/DropDowns";
import CustomSelect from "../../../Components/UI/CustomSelect";
import "../../../Styles/pages/inventoryFilter.scss";
const { RangePicker } = DatePicker;

const InventoryLogFilter = ({
  onFilter,
}: {
  onFilter: (filters: any) => void;
}) => {
  const {
    customerDropDown,
    distributorDropDown,
    CustomerDropdownOptions,
    distributorDropdownOptions,
    SlotstatusDropDownOptions,
    modeDropDownOptions,
  } = useDropdownData();

  const defaultFrom = dayjs();
  const defaultTo = dayjs();
  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);
  const [customerId, setCustomerId] = useState<string | number>("");
  const [distributorId, setDistributorId] = useState<string | number>("");
  const [status, setStatus] = useState<string | number>("");
  const [slotMode, setSlotMode] = useState<string[] | number[]>([]);

  useEffect(() => {
    customerDropDown(), distributorDropDown();
  }, []);
  //setting value
  const handleFilter = () => {
    onFilter({
      fromDate: fromDate.format("YYYY-MM-DD"),
      toDate: toDate.format("YYYY-MM-DD"),
      customerId: customerId || null,
      distributorId: distributorId || null,
      status: status || null,
      mode: slotMode || null,
    });
  };

  //reset the filter
  const handleReset = () => {
    setFromDate(defaultFrom);
    setToDate(defaultTo);
    setCustomerId("");
    setDistributorId("");
    setStatus("");
    setSlotMode([]);

    onFilter({
      fromDate: defaultFrom.format("YYYY-MM-DD"),
      toDate: defaultTo.format("YYYY-MM-DD"),
      customerId: null,
      distributorId: null,
      status: null,
      slotMode: null,
    });
  };

  return (
    <div className="inventory-filter">
      <div>
        <p>Range</p>
        <RangePicker
          title="From - to"
          value={[fromDate, toDate]}
          onChange={(dates) => {
            setFromDate(dates?.[0] || defaultFrom);
            setToDate(dates?.[1] || defaultTo);
          }}
          className="range"
          format="YYYY-MM-DD"
        />
      </div>

      <CustomSelect
        className="select"
        label="Customer"
        name="customer"
        value={customerId}
        options={CustomerDropdownOptions}
        onChange={(value: any) => setCustomerId(value)}
        placeholder="Select Customer"
      />

      <CustomSelect
        className="select"
        label="Distributor"
        name="distributor"
        value={distributorId}
        options={distributorDropdownOptions}
        onChange={(value: any) => {
          setDistributorId(value);
        }}
        placeholder="Select Distributor"
      />
      <CustomSelect
        className="select"
        label="Status"
        name="status"
        value={status}
        options={SlotstatusDropDownOptions}
        onChange={(value: any) => {
          setStatus(value);
        }}
        placeholder="Select Status"
      />
      <CustomSelect
        className="select"
        label="Mode"
        name="mode"
        value={slotMode}
        options={modeDropDownOptions}
        onChange={(value: any) => {
          setSlotMode(value);
        }}
        placeholder="Select Slot"
      />

      <div style={{ display: "flex", gap: 8 }}>
        <Button type="primary" onClick={handleFilter}>
          Filter
        </Button>
        <Button onClick={handleReset} danger>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default InventoryLogFilter;
