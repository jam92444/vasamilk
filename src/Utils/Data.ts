import {
  getLinesDropDown,
  getPriceTagDropDown,
  getSlotDropDown,
} from "../Services/ApiService";
import { getDecryptedCookie } from "./cookies";

export const userToken = getDecryptedCookie("user_token")?.token;
export const userdata = getDecryptedCookie("user_token");

console.log(userToken);
const formData = new FormData();
formData.append("token", userToken);

export const SlotData = async () => {
  try {
    const res = await getSlotDropDown(formData);
    return res.data;
  } catch (error) {
    console.error("Error fetching slot data:", error);
    return null;
  }
};

export const LineData = async (userType: number | string) => {
  try {
    const userToken = getDecryptedCookie("user_token")?.token;
    if (!userToken) throw new Error("User token missing");

    const formData = new FormData();
    formData.append("token", userToken);

    // Send actual integer (1 or 2)
    const numericType = parseInt(userType as string, 10);
    const type = numericType === 4 ? 2 : 1;
    formData.append("type", type.toString()); // still must append as string

    const res = await getLinesDropDown(formData);
    return res.data;
  } catch (error) {
    console.error("Error fetching line data:", error);
    return null;
  }
};

export const PriceTagData = async () => {
  try {
    const res = await getPriceTagDropDown(formData);
    return res.data;
  } catch (error) {
    console.error("Error fetching price tag data:", error);
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
