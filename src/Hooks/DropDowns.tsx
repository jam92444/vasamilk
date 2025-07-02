import { useState } from "react";
import {
  assignRouteApi,
  getCustomer,
  getDistributor,
  getLinesDropDown,
  getPriceTagDropDown,
} from "../Services/ApiService";
import { useDropdownOptions } from "./useDropdownOptions";
import { toast } from "react-toastify";
import { getUserData, getUserToken } from "../Utils/Data";

interface CustomerDropDownParams {
  slot_id?: number;
  line_id?: number;
  type?: number;
}

export function useDropdownData() {
  const [priceOptionsRaw, setPriceOptionsRaw] = useState([]);
  const [lineOptionsRaw, setLineOptionsRaw] = useState([]);
  const [customerRaw, setCustomerRaw] = useState([]);
  const [distributorRaw, setDistributorRaw] = useState([]);
  const [assignRoute, setAssignRoute] = useState([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

  const priceTagDropdownOptions = useDropdownOptions({
    data: priceOptionsRaw,
    labelKey: "price_tag_name",
    valueKey: "price_tag_value",
  });

  const lineDropdownOptions = useDropdownOptions({
    data: lineOptionsRaw,
    labelKey: "line_name",
    valueKey: "id",
  });

  const CustomerDropdownOptions = useDropdownOptions({
    data: customerRaw,
    labelKey: "name",
    valueKey: "id",
  });

  const distributorDropdownOptions = useDropdownOptions({
    data: distributorRaw,
    labelKey: "name",
    valueKey: "id",
  });

  const assignRouteDropDownOptions = useDropdownOptions({
    data: assignRoute,
    labelKey: "name",
    valueKey: "id",
  });
  const SlotstatusDropDownOptions = [
    { label: "Given", value: 1 },
    { label: "Upcoming", value: 2 },
    { label: "Partially Given", value: 3 },
    { label: "Cancelled", value: 4 },
  ];

  const modeDropDownOptions = [
    { label: "Vendor", value: "1" },
    { label: "Distributor", value: "2" },
  ];

  const slotDropDown = [
    { label: "Morning", value: "1" },
    { label: "Evening", value: "2" },
  ];

  const assignTypeDropDown = [
    { label: "Permanent", value: "1" },
    { label: "Temporary", value: "2" },
  ];

  const payTagIdDropDown = () => {
    const formData = new FormData();
    formData.append("token", getUserToken());

    getPriceTagDropDown(formData)
      .then((res) => {
        setPriceOptionsRaw(res.data?.data || []);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load price tag data");
      });
  };

  const loadLineDropdowns = () => {
    const user = getUserData();
    if (!getUserToken() || !user?.user_type) return;

    const type = user.user_type === 4 ? "2" : "1";
    const formData = new FormData();
    formData.append("token", user.token);
    formData.append("type", type);

    getLinesDropDown(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setLineOptionsRaw(res.data.data);
        } else {
          toast.error(res.data.msg || "Failed to fetch line data");
        }
      })
      .catch((error) => {
        toast.error(error || "Error loading line data");
      });
  };

  const customerDropDown = async ({
    slot_id,
    line_id,
    type,
  }: CustomerDropDownParams = {}) => {
    const isType = type ? type.toString() : "4";
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("type", isType);
    formData.append("for_assign_key", "0");
    if (slot_id) formData.append("slot_id", slot_id.toString());
    if (line_id) formData.append("line_id", line_id.toString());

    try {
      const res = await getCustomer(formData);
      if (res.data.status === 1) {
        setCustomerRaw(res.data.data);
      } else {
        toast.error(res.data.msg || "Failed to fetch customer data");
      }
    } catch (err) {
      toast.error("Error loading customer data");
    }
  };

  const distributorDropDown = () => {
    const formData = new FormData();
    formData.append("token", getUserToken());

    getDistributor(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setDistributorRaw(res.data.data);
        } else {
          toast.error(res.data.msg || "Failed to fetch distributor data");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Error loading distributor data");
      });
  };

  const AssignRouteDropDown = async (
    type: number = 1,
    slot_id: number = 1,
    from?: string,
    to?: string
  ) => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("type", type.toString());
    formData.append("slot_id", slot_id.toString());
    formData.append("for_assign_key", "0");
    if (from) formData.append("from_date", from);
    if (to) formData.append("to_date", to);

    try {
      const res = await assignRouteApi(formData);
      console.log(res.data.data);
      setAssignRoute(res.data.data || []);
      return res.data.data || [];
    } catch (err) {
      console.error("Failed to load assign route", err);
      return []; // ✅ fail-safe return
    }
  };

  return {
    isLoadingDropdowns,
    priceTagDropdownOptions,
    lineDropdownOptions,
    CustomerDropdownOptions,
    distributorDropdownOptions,
    SlotstatusDropDownOptions,
    modeDropDownOptions,
    assignRoute,
    slotDropDown,
    assignTypeDropDown,
    assignRouteDropDownOptions,
    AssignRouteDropDown,
    customerDropDown,
    distributorDropDown,
    payTagIdDropDown,
    loadLineDropdowns,
  };
}
