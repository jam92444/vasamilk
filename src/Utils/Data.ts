import { getSlotDropDown } from "../Services/ApiService";
import { getDecryptedCookie } from "./cookies";
import { useMemo } from "react";

export const getUserToken = () => getDecryptedCookie("user_token")?.token;
export const getUserData = () => getDecryptedCookie("user_token");

// console.log(userToken);
const formData = new FormData();
formData.append("token", getUserToken());

export const useUserDetails = () => {
  const userDetails = useMemo(() => getDecryptedCookie("user_token"), []);
  return {
    token: userDetails?.token,
    userDetails,
    type: userDetails?.user_type,
  };
};

export const SlotData = async () => {
  try {
    const res = await getSlotDropDown(formData);
    return res.data;
  } catch (error) {
    console.error("Error fetching slot data:", error);
    return null;
  }
};

export const UserDropDown = [
  {
    label: "Admin",
    value: 2,
  },
  {
    label: "Vendor/logger",
    value: 3,
  },
  {
    label: "Distributor",
    value: 4,
  },
  {
    label: "Customer",
    value: 5,
  },
];

export const CustomerType = [
  { label: "Regular", value: 1 },
  { label: "Occasional", value: 2 },
];

export const payTypesOptions = [
  { label: "Daily", value: 1 },
  { label: "Monthly", value: 2 },
];

export const inOutOption = [
  {
    label: "In",
    value: 1,
  },
  {
    label: "Out",
    value: 2,
  },
];
