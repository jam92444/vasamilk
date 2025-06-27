import axiosInstance from "./Axios";

export const loginUser = (payload: any) => {
  return axiosInstance.post("/milk-api/auth/login", payload);
};

export const forgetPassword = (payload: any) => {
  return axiosInstance.post("/milk-api/auth/forgot-password", payload);
};

export const verifyOTP = (payload: any) => {
  return axiosInstance.post("/milk-api/auth/otp-verification", payload);
};

export const resendOTP = (payload: any) => {
  return axiosInstance.post("/milk-api/auth/resend-otp", payload);
};
export const resetPassword = (payload: any) => {
  return axiosInstance.post("/milk-api/auth/reset-password", payload);
};

// gettting dropdown data

//Slot drop down
export const getSlotDropDown = (payload: any) => {
  return axiosInstance.post("/milk-api/drop-down/slot-drop-down", payload);
};
//Lines drop down
export const getLinesDropDown = (payload: any) => {
  return axiosInstance.post("/milk-api/drop-down/lines-drop-down", payload);
};
//Price Tag drop down
export const getPriceTagDropDown = (payload: any) => {
  return axiosInstance.post("/milk-api/drop-down/price-tag-drop-down", payload);
};
export const getDistributorDropDown = (payload: any) => {
  return axiosInstance.post("/milk-api/drop-down/customer-drop-down", payload);
};

// fetchUserList
export const fetchUserList = (
  page: number = 1,
  size: number = 10,
  data: any
) => {
  // const params = new URLSearchParams();

  return axiosInstance.post(
    `/milk-api/user/list-users?page=${page}&size=${size}`,
    data
  );
};

//delete or change status
export const changeUserStatus = (payload: any) => {
  return axiosInstance.post("/milk-api/user/change-status-user", payload);
};

//delete or change status
export const createUser = (payload: any) => {
  return axiosInstance.post("/milk-api/user/create-user", payload);
};

//get user by iD
export const getUserById = (payload: any) => {
  return axiosInstance.post("/milk-api/user/view-user", payload);
};

//update user
export const updateUser = (payload: any) => {
  return axiosInstance.post("/milk-api/user/edit-user", payload);
};

//Daily inventory report
export const dailyInventoryReport = (payload: any) => {
  return axiosInstance.post(
    "/milk-api/dashboard/daily-inventory-report",
    payload
  );
};

export const getInventoryList = (
  page: number = 1,
  size: number = 10,
  payload: any
) => {
  return axiosInstance.post(
    `/milk-api/inventorylist-inventory?page=${page}&size=${size}`,
    payload
  );
};

export const logout = (payload: any) => {
  return axiosInstance.post("/milk-api/auth/logout", payload);
};

//  listing the inventory
export const getlistInventoryLog = (
  page: number = 1,
  size: number = 10,
  payload: any
) => {
  return axiosInstance.post(
    `/milk-api/inventory/list-inventory-log?page=${page}&size=${size}`,
    payload
  );
};

// update inventory

export const updateInventory = (payload: any) => {
  return axiosInstance.post("/milk-api/inventory/update-inventory", payload);
};
export const addInventory = (payload: any) => {
  return axiosInstance.post("/milk-api/inventory/add-inventory", payload);
};

export const getdailyMilkRequired = (payload: any) => {
  return axiosInstance.post(
    "/milk-api/dashboard/daily-milk-required-report",
    payload
  );
};
//vendor milk report
export const getVendorMilkReport = (payload: any) => {
  return axiosInstance.post("/milk-api/dashboard/vendor-milk-report", payload);
};

//list slot mapping (to get how)
export const getSlotMapping = (
  page: number = 1,
  size: number = 10,
  payload: any
) => {
  return axiosInstance.post(
    `/milk-api/milk-sales/list-slot-mapping?page=${page}&size=${size}`,
    payload
  );
};

/-----------------------------------------DistributorAPI------------------------------------------------------/;
export const getDistributorList = (payload: any) => {
  return axiosInstance.post(
    "/milk-api/slot-assign/get-distributer-line",
    payload
  );
};
