// src/Hooks/useDropdownData.ts
import { useEffect, useState } from "react";
import { getDecryptedCookie } from "../Utils/cookies";
import {
  getCustomer,
  getDistributor,
  getLinesDropDown,
} from "../Services/ApiService";
import { PriceTagData } from "../Utils/Data";
import { useDropdownOptions } from "./useDropdownOptions";
import { toast } from "react-toastify";

export function useDropdownData(userType?: number) {
  const [priceOptionsRaw, setPriceOptionsRaw] = useState([]);
  const [lineOptionsRaw, setLineOptionsRaw] = useState([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);
  const [customerRaw, setCustomerRaw] = useState([]);
  const [distributorRaw, setDistributorRaw] = useState([]);

  const priceDropdownOptions = useDropdownOptions({
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

  const SlotstatusDropDownOptions = [
    {
      label: "Given",
      value: 1,
    },
    {
      label: "Upcoming",
      value: 2,
    },
    {
      label: "Partially Given",
      value: 3,
    },
    {
      label: "Cancelled",
      value: 4,
    },
  ];

  const modeDropDownOptions = [
    {
      label: "Vendor",
      value: "1",
    },
    {
      label: "Distributor",
      value: "2",
    },
  ];

  useEffect(() => {
    fetchDropdownData();
  }, [userType]);

  const GetPayTagIDs = async () => {
    const prices = await PriceTagData();
    setPriceOptionsRaw(prices?.data || []);

    setIsLoadingDropdowns(false);
  };

  const loadLineDropdowns = async () => {
    const user = getDecryptedCookie("user_token");
    if (!user?.token || !userType) return;

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
        toast.error(
          error?.message || "Something went wrong while fetching line data."
        );
      });
  };

  const customerDropDown = async () => {
    const user = getDecryptedCookie("user_token");
    if (!user?.token || !userType) return;

    const type = "4";
    const formData = new FormData();
    formData.append("token", user.token);
    formData.append("type", type);

    const res = await getCustomer(formData);
    if (res.data.status === 1) {
      setCustomerRaw(res.data.data);
    } else {
      toast.error(res.data.msg || "Failed to fetch line data");
    }
  };

  const distributorDropDown = async () => {
    const user = getDecryptedCookie("user_token");
    if (!user?.token) return;

    const formData = new FormData();
    formData.append("token", user.token);

    const res = await getDistributor(formData);
    if (res.data.status === 1) {
      setDistributorRaw(res.data.data);
    } else {
      toast.error(res.data.msg || "Failed to fetch line data");
    }
  };

  const fetchDropdownData = async () => {
    setIsLoadingDropdowns(true);
    const hasUserType = !!userType;

    try {
      await Promise.all([
        GetPayTagIDs(),
        distributorDropDown(),
        customerDropDown(),
        hasUserType ? loadLineDropdowns() : Promise.resolve(),
      ]);
    } catch (error) {
      console.error("Dropdown loading error:", error);
      toast.error("Failed to load dropdown data");
    }
  };

  return {
    isLoadingDropdowns,
    priceDropdownOptions,
    lineDropdownOptions,
    CustomerDropdownOptions,
    distributorDropdownOptions,
    SlotstatusDropDownOptions,
    modeDropDownOptions,
  };
}
