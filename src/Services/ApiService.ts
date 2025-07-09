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

// Distributor Drop Down
export const getDistributorDropDown = (payload: any) => {
  return axiosInstance.post(
    "/milk-api/drop-down/distributer-drop-down",
    payload
  );
};
export const getVendorDropDown = (payload: any) => {
  return axiosInstance.post("/milk-api/drop-down/vendor-drop-down", payload);
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

//Inventory list
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

// Logout
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

//add inventory
export const addInventory = (payload: any) => {
  return axiosInstance.post("/milk-api/inventory/add-inventory", payload);
};

// Daily milk required report
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

/-----------------------------------------DistributorAPI----------------------------------------------/;

export const addInventoryListData = (payload: any) => {
  return axiosInstance.post(
    "/milk-api/milk-sales/distributer-inventory-log",
    payload
  );
};
export const getDistributorList = (payload: any) => {
  return axiosInstance.post(
    "/milk-api/slot-assign/get-distributer-line",
    payload
  );
};

//  (drop down) - Customer  drop down
export const getCustomer = (payload: any) => {
  return axiosInstance.post("/milk-api/drop-down/customer-drop-down", payload);
};

export const getDistributor = (payload: any) => {
  return axiosInstance.post(
    "/milk-api/drop-down/distributer-drop-down",
    payload
  );
};

//route details of  a particular distributor
export const getRouteDetails = (
  page: number = 1,
  size: number = 10,
  payload: any
) => {
  return axiosInstance.post(
    `/milk-api/slot-assign/list-assigned-slot?page=${page}&size=${size}`,
    payload
  );
};

// Assign route Data drop down
export const assignRouteApi = (payload: any) => {
  return axiosInstance.post(
    "/milk-api/drop-down/assign-router-drop-down",
    payload
  );
};
export const assignSlot = (payload: any) => {
  return axiosInstance.post("/milk-api/slot-assign/assign-slot-map", payload);
};

export const dailyInventoryByDate = (payload: any) => {
  return axiosInstance.post(
    "/milk-api/dashboard/daily-inventory-report-by-date",
    payload
  );
};
export const getRouteOfDistributor = (payload: any) => {
  return axiosInstance.post("/milk-api/drop-down/lines-drop-down", payload);
};

//------------------------------------ MASTERS API -------------------------------------/

//--------SLOT management----------/
export const getSlotsList = (payload: any) => {
  return axiosInstance.post("/milk-api/masters/list-slot", payload);
};
export const updateSlots = (payload: any) => {
  return axiosInstance.post("/milk-api/masters/update-slot", payload);
};

//-----------LIST MANAGEMENT-------------------------------------//
export const getLineLists = (
  page: number = 1,
  size: number = 10,
  payload: any
) => {
  return axiosInstance.post(
    `/milk-api/masters/list-lines?page=${page}&size=${size}`,
    payload
  );
};
export const createList = (payload: any) => {
  return axiosInstance.post("/milk-api/masters/create-lines", payload);
};
export const inactiveList = (payload: any) => {
  return axiosInstance.post("/milk-api/masters/inactive-lines", payload);
};
export const updateLine = (payload: any) => {
  return axiosInstance.post("/milk-api/masters/update-lines", payload);
};
export const deleteLine = (payload: any) => {
  return axiosInstance.post("/milk-api/masters/delete-lines", payload);
};

//--------------PRICE TAG----------------------------------------------//
export const getPricetagList = (
  page: number = 1,
  pageSize: number = 10,
  payload: any
) => {
  return axiosInstance.post(
    `/milk-api/masters/list-price-tag?page=${page}&size=${pageSize}`,
    payload
  );
};

export const updatePriceTag = (payload: any) => {
  return axiosInstance.post("/milk-api/masters/update-price-tag", payload);
};
export const createPriceTag = (payload: any) => {
  return axiosInstance.post("/milk-api/masters/create-price-tag", payload);
};

export const deletePriceTag = (payload: any) => {
  return axiosInstance.post("/milk-api/masters/delete-price-tag", payload);
};

export const inactivePriceTag = (payload: any) => {
  return axiosInstance.post("/milk-api/masters/inactive-price-tag", payload);
};

//--------------REASON API----------------------------------------------//
export const listReason = (
  page: number = 1,
  pageSize: number = 10,
  payload: any
) => {
  return axiosInstance.post(
    `/milk-api/masters/list-reason?page=${page}&size=${pageSize}`,
    payload
  );
};

export const toggleReasonStatus = (payload: any) => {
  return axiosInstance.post("/milk-api/masters/inactive-reason", payload);
};

export const createReason = (payload: any) => {
  return axiosInstance.post("/milk-api/masters/create-reason", payload);
};

export const updateReason = (payload: any) => {
  return axiosInstance.post("/milk-api/masters/update-reason", payload);
};

export const deleteReason = (payload: any) => {
  return axiosInstance.post("/milk-api/masters/delete-reason", payload);
};

export const getActiveSlots = (payload: any) => {
  return axiosInstance.post("/milk-api/masters/get-active-slot", payload);
};

export const placeDirectCustomerLog = (payload: any) => {
  return axiosInstance.post(
    "/milk-api/milk-sales/direct-customer-log",
    payload
  );
};

//-------------------------------- SALES REPORT --------------------------------//
export const getListDistributorLog = (
  page: number = 1,
  pageSize: number = 50,
  payload: any
) => {
  return axiosInstance.post(
    `/milk-api/milk-sales/list-distributor-log?page=${page}&size=${pageSize}`,
    payload
  );
};
