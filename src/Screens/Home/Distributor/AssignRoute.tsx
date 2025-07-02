import { useEffect, useState } from "react";
import { DatePicker, Button, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useDropdownData } from "../../../Hooks/DropDowns";
import CustomSelect from "../../../Components/UI/CustomSelect";
import { getUserToken, useUserDetails } from "../../../Utils/Data";
import { assignRouteApi, getCustomer } from "../../../Services/ApiService";
import "../../../Styles/pages/_assignRoute.scss";
import CustomButton from "../../../Components/UI/CustomButton";

type AssignmentField =
  | "line_id"
  | "assign_type"
  | "customers"
  | "from_date"
  | "to_date";

interface Assignment {
  line_id: string;
  assign_type: string;
  customers: string[] | number[];
  from_date: string;
  to_date: string;
}

const AssignRoute = () => {
  const navigate = useNavigate();

  const {
    distributorDropdownOptions,
    assignTypeDropDown,
    slotDropDown,
    distributorDropDown,
  } = useDropdownData();

  const [distributor, setDistributor] = useState<string>("");
  const [slot, setSlot] = useState<string>("");
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      line_id: "",
      assign_type: "",
      customers: [],
      from_date: "",
      to_date: "",
    },
  ]);

  const [routesPerAssignment, setRoutesPerAssignment] = useState<
    Record<number, any[]>
  >({});
  const [customersPerAssignment, setCustomersPerAssignment] = useState<
    Record<number, any[]>
  >({});

  useEffect(() => {
    distributorDropDown();
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [slot, assignments]);

  const fetchRoutes = async () => {
    for (let index = 0; index < assignments.length; index++) {
      const item = assignments[index];
      const isTemporary = Number(item.assign_type) === 2;
      const hasDates = item.from_date && item.to_date;

      if (
        slot &&
        item.assign_type &&
        (!isTemporary || (isTemporary && hasDates))
      ) {
        try {
          const formData = new FormData();
          formData.append("token", getUserToken());
          formData.append("type", item.assign_type);
          formData.append("slot_id", slot);
          formData.append("for_assign_key", "0");

          if (isTemporary) {
            formData.append("from_date", item.from_date);
            formData.append("to_date", item.to_date);
          }

          const res = await assignRouteApi(formData);
          const data = res.data.data.map((route: any) => ({
            label: route.name,
            value: String(route.id),
          }));

          setRoutesPerAssignment((prev) => ({
            ...prev,
            [index]: data,
          }));
        } catch (err) {
          console.error("Failed to fetch routes", index, err);
        }
      }
    }
  };

  const handleAddAssignment = () => {
    setAssignments([
      ...assignments,
      {
        line_id: "",
        assign_type: "",
        customers: [],
        from_date: "",
        to_date: "",
      },
    ]);
  };

  const handleAssignmentChange = async (
    index: number,
    field: AssignmentField,
    value: string | number | string[] | number[]
  ) => {
    const updated = [...assignments];

    if (field === "customers") {
      updated[index][field] = value as string[];
    } else {
      updated[index][field] = value.toString();
    }

    const assignType = Number(updated[index].assign_type);

    if (field === "assign_type") {
      if (assignType === 1) {
        updated[index].from_date = "";
        updated[index].to_date = "";
      } else if (assignType === 2) {
        updated[index].line_id = "";
        updated[index].customers = [];
      }
    }

    if (field === "line_id") {
      const selectedLineId = value as string;
      const type = assignType === 1 ? 1 : assignType === 2 ? 2 : 4;
      const slotId = Number(slot);

      if (slotId && selectedLineId) {
        try {
          const formData = new FormData();
          formData.append("token", getUserToken());
          formData.append("type", type.toString());
          formData.append("slot_id", slotId.toString());
          formData.append("line_id", selectedLineId.toString());
          formData.append("for_assign_key", "0");

          const res = await getCustomer(formData);
          const customers = (res.data.data || []).map((c: any) => ({
            label: c.name,
            value: c.slot_map_id,
          }));

          setCustomersPerAssignment((prev) => ({
            ...prev,
            [index]: customers,
          }));
        } catch (err) {
          console.error("Failed to fetch customers", err);
          setCustomersPerAssignment((prev) => ({ ...prev, [index]: [] }));
        }
      }
    }

    setAssignments(updated);
  };

  const handleDateChange = (
    index: number,
    field: "from_date" | "to_date",
    date: any
  ) => {
    const updated = [...assignments];
    updated[index][field] = date ? dayjs(date).format("YYYY-MM-DD") : "";
    setAssignments(updated);
  };

  const handleSubmit = () => {
    const { token } = useUserDetails();

    const hasEmptyFields = assignments.some((item) => {
      const isTemp = Number(item.assign_type) === 2;
      return (
        !item.line_id ||
        !item.customers.length ||
        !item.assign_type ||
        (isTemp && (!item.from_date || !item.to_date))
      );
    });

    if (!distributor || !slot || hasEmptyFields) {
      alert("Please fill all required fields.");
      return;
    }

    const line_data = assignments.map((item) => ({
      line_id: item.line_id,
      assign_type: item.assign_type,
      slot_mapping_ids: item.customers,
      from_date: Number(item.assign_type) === 2 ? item.from_date : "",
      to_date: Number(item.assign_type) === 2 ? item.to_date : "",
    }));

    const payload = {
      token,
      distributorId: distributor,
      slot_id: slot,
      line_data,
    };

    console.log("SUBMIT DATA", payload);
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Assign Route</h2>
        <CustomButton
          onClick={() => navigate(-1)}
          className="backBtn"
          text="Back"
        />
      </div>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <CustomSelect
            label="Distributor"
            name="distributor"
            value={distributor}
            options={distributorDropdownOptions.map((opt) => ({
              label: opt.label,
              value: String(opt.value),
            }))}
            onChange={(val: any) => setDistributor(val.toString())}
          />
        </Col>

        <Col xs={24} md={12}>
          <CustomSelect
            label="Slot"
            name="slot"
            value={slot}
            options={slotDropDown.map((opt) => ({
              label: opt.label,
              value: String(opt.value),
            }))}
            onChange={(val: any) => setSlot(val.toString())}
          />
        </Col>
      </Row>

      {assignments.map((item, index) => {
        const isTemporary = Number(item.assign_type) === 2;
        const routeOptions = routesPerAssignment[index] || [];
        const customerOptions = customersPerAssignment[index] || [];

        const isDisabled =
          isTemporary &&
          (!item.from_date || !item.to_date || routeOptions.length === 0);

        return (
          <div key={index} className="assignmentBlock">
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <CustomSelect
                  label="Assign Type"
                  name={`assign_type_${index}`}
                  value={item.assign_type}
                  options={assignTypeDropDown.map((opt) => ({
                    label: opt.label,
                    value: opt.value.toString(),
                  }))}
                  onChange={(value: any) =>
                    handleAssignmentChange(
                      index,
                      "assign_type",
                      value.toString()
                    )
                  }
                />
              </Col>

              {isTemporary && (
                <>
                  <Col xs={24} md={8}>
                    <label>From Date</label>
                    <DatePicker
                      style={{ width: "100%" }}
                      value={item.from_date ? dayjs(item.from_date) : undefined}
                      onChange={(date) =>
                        handleDateChange(index, "from_date", date)
                      }
                    />
                  </Col>

                  <Col xs={24} md={8}>
                    <label>To Date</label>
                    <DatePicker
                      style={{ width: "100%" }}
                      value={item.to_date ? dayjs(item.to_date) : undefined}
                      onChange={(date) =>
                        handleDateChange(index, "to_date", date)
                      }
                    />
                  </Col>
                </>
              )}

              <Col xs={24} md={12}>
                <CustomSelect
                  label="Route/Line"
                  name={`line_${index}`}
                  value={item.line_id}
                  options={routeOptions}
                  onChange={(value: any) =>
                    handleAssignmentChange(index, "line_id", value.toString())
                  }
                  disabled={!slot || isDisabled}
                />
              </Col>

              <Col xs={24} md={12}>
                <CustomSelect
                  label="Customers"
                  name={`customers_${index}`}
                  value={item.customers}
                  mode="multiple"
                  options={customerOptions}
                  onChange={(value: any) =>
                    handleAssignmentChange(index, "customers", value)
                  }
                  disabled={!slot || isDisabled}
                />
              </Col>
            </Row>
          </div>
        );
      })}

      <div className="actions">
        <CustomButton
          text=" + Add Assignment"
          className="backBtn"
          style={{ fontSize: "13px" }}
          onClick={handleAddAssignment}
        />

        <CustomButton
          style={{ fontSize: "13px" }}
          text="Submit"
          className="submit-btn"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AssignRoute;
