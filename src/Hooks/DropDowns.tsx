// src/Hooks/useDropdownData.ts
import { useEffect, useState } from "react";
import { message } from "antd";
import { getDecryptedCookie } from "../Utils/cookies";
import { getLinesDropDown } from "../Services/ApiService";
import { PriceTagData } from "../Utils/Data";
import { useDropdownOptions } from "./useDropdownOptions";

export function useDropdownData(userType?: number) {
  const [priceOptionsRaw, setPriceOptionsRaw] = useState([]);
  const [lineOptionsRaw, setLineOptionsRaw] = useState([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);

  const priceDropdownOptions = useDropdownOptions({
    data: priceOptionsRaw,
    labelKey: "price_tag_name",
    valueKey: "price_tag_value",
  });

  const lineDropdownOptions = useDropdownOptions({
    data: lineOptionsRaw,
    labelKey: "line_name", // adjust key according to actual API response
    valueKey: "id",
  });

  const GetPayTagIDs = async () => {
    try {
      const prices = await PriceTagData();
      setPriceOptionsRaw(prices?.data || []);
    } catch {
      message.error("Failed to load price tags");
    } finally {
      setIsLoadingDropdowns(false);
    }
  };

  const loadLineDropdowns = async () => {
    const user = getDecryptedCookie("user_token");
    if (!user?.token || !userType) return;

    const type = user.user_type === 4 ? "2" : "1";
    const formData = new FormData();
    formData.append("token", user.token);
    formData.append("type", type);

    try {
      const res = await getLinesDropDown(formData);
      if (res.data.status === 1) {
        setLineOptionsRaw(res.data.data);
        console.log(res.data.data);
      } else {
        message.error(res.data.msg || "Failed to fetch line data");
      }
    } catch (error) {
      console.error("Line dropdown error:", error);
      message.error("Error loading line data");
    }
  };

  useEffect(() => {
    GetPayTagIDs();
  }, []);

  useEffect(() => {
    if (userType) loadLineDropdowns();
  }, [userType]);

  return {
    isLoadingDropdowns,
    priceDropdownOptions,
    lineDropdownOptions,
  };
}
