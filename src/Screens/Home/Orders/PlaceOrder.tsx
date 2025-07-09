import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getActiveSlots,
  getCustomer,
  getUserById,
  placeDirectCustomerLog,
} from "../../../Services/ApiService";
import { getUserToken } from "../../../Utils/Data";
import { useAuth } from "../../../Context/AuthContext";
import { useDropdownData } from "../../../Hooks/DropDowns";
import AppLoader from "../../../Components/UI/AppLoader";
import CustomSelect from "../../../Components/UI/CustomSelect";
import CustomButton from "../../../Components/UI/CustomButton";
import "../../../Styles/pages/_placeorder.scss";

import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CustomInput from "../../../Components/UI/CustomInput";

interface SlotQuantityMap {
  [slot_id: number]: number;
}

interface SlotDetail {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
}

const orderSchema = Yup.object().shape({
  customer_id: Yup.string().required("Customer is required"),
  paymentType: Yup.string().required("Payment type is required"),
  transactionId: Yup.string()
    .nullable()
    .when("paymentType", {
      is: "2",
      then: (schema) => schema.required("Transaction ID is required"),
    }),
  slotQuantities: Yup.object().test(
    "non-negative",
    "Slot quantities must be non-negative numbers",
    (value) =>
      value
        ? Object.values(value).every((v) => typeof v === "number" && v >= 0)
        : false
  ),
});

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { loading, setLoading } = useAuth();

  const { slotDropDown } = useDropdownData() as {
    slotDropDown: { value: string; label: string }[];
  };
  const [customerRaw, setCustomerRaw] = useState<any[]>([]);
  const [CustomerDropdownOptions, setCustomerDropDownOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [isActiveSlot, setIsActiveSlot] = useState<boolean>(true);
  const [slotDetail, setSlotDetails] = useState<SlotDetail | null>(null);
  const type = 1;

  const paymentOptions = [
    { label: "Cash", value: "1" },
    { label: "Online", value: "2" },
  ];

  const handleSubmit = (values: any) => {
    const totalQuantity = Object.values(values.slotQuantities).reduce(
      (sum: number, qty) => sum + (typeof qty === "number" ? qty : 0),
      0
    );
    const isMonthly = customerDetails?.pay_type === 2;
    const hasInvoice = customerDetails?.invoice_data?.length > 0;
    const invoice = hasInvoice ? customerDetails.invoice_data[0] : null;

    const payload: any = {
      token: getUserToken(),
      customer_id: parseInt(values.customer_id),
      quantity: totalQuantity, // quantity required for both daily and monthly users
      payment_type: isMonthly ? 0 : parseInt(values.paymentType), // only for daily
      is_paid: isMonthly ? 0 : values.paymentType === "2" ? 1 : 0,
      transaction_id: isMonthly
        ? null
        : values.paymentType === "2"
        ? values.transactionId
        : null,
      is_monthly_paid: isMonthly ? 1 : 0,
    };

    // Add monthly fields only if monthly user
    if (isMonthly && invoice) {
      payload.monthly_id = invoice.id;
      payload.monthly_payment_type = parseInt(values.paymentType);
      payload.monthly_transaction_id = values.transactionId;
    }

    placeDirectCustomerLog(payload)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success("Order Completed");
          formik.resetForm();
          setCustomerDetails(null);
        } else {
          toast.info(res.data.msg);
        }
      })
      .catch((error) => {
        console.error("Order error:", error);
      });
  };

  const formik = useFormik({
    initialValues: {
      customer_id: "",
      paymentType: "1",
      slotQuantities: {} as SlotQuantityMap,
      transactionId: "",
    },
    validationSchema: orderSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    handleGetActiveSlot();
    handleGetCustomerDropDown({ type });
  }, []);

  useEffect(() => {
    if (formik.values.customer_id) {
      handleGetUserDetails(formik.values.customer_id);
    }
  }, [formik.values.customer_id]);

  const handleGetActiveSlot = () => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    setLoading(true);

    getActiveSlots(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setIsActiveSlot(true);
          setSlotDetails(res.data.data);
        } else if (res.data.status === 2) {
          setIsActiveSlot(false);
        } else {
          console.info(res.data.msg);
        }
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  const handleGetCustomerDropDown = ({ type }: { type: number }) => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("type", type.toString());

    getCustomer(formData)
      .then((res) => {
        if (res.data.status === 1) {
          const rawData = res.data.data;
          setCustomerRaw(rawData);
          const dropdownData = rawData.map((item: any) => ({
            label: String(item.name),
            value: String(item.user_id),
          }));
          setCustomerDropDownOptions(dropdownData);
        } else {
          console.info(res.data.msg);
        }
      })
      .catch(console.log);
  };

  const handleGetUserDetails = (selectedUser: string) => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("user_id", selectedUser);
    setLoading(true);
    getUserById(formData)
      .then((res) => {
        if (res.data.status === 1) {
          const user = res.data.data;
          setCustomerDetails(user);
          const quantities: SlotQuantityMap = {};
          user.today_slot_data?.forEach((slot: any) => {
            quantities[slot.slot_id] = Number(slot.quantity);
          });
          formik.setFieldValue("slotQuantities", quantities);
        } else {
          console.info(res.data);
        }
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  const handleQuantityChange = (slot_id: number, value: number) => {
    formik.setFieldValue("slotQuantities", {
      ...formik.values.slotQuantities,
      [slot_id]: Number(value),
    });
  };

  const totalPrice = useMemo(() => {
    // Monthly customer with invoice
    if (
      customerDetails?.pay_type === 2 &&
      customerDetails.invoice_data?.length > 0
    ) {
      const amount = parseFloat(customerDetails.invoice_data[0]?.amount || "0");
      return isNaN(amount) ? 0 : amount;
    }

    // Daily customer price calculation
    if (
      !customerDetails?.today_slot_data ||
      !slotDetail ||
      !formik.values.customer_id
    ) {
      return 0;
    }

    const isMorning = slotDetail.id === 1;
    const isEvening = slotDetail.id === 2;

    const selectedCustomer = customerRaw.find(
      (cust) => cust.user_id.toString() === formik.values.customer_id
    );
    const unitPrice = selectedCustomer?.unit_price ?? 0;

    const relevantSlots = customerDetails.today_slot_data.filter(
      (slot: any) => {
        const slotInfo = slotDropDown.find(
          (drop) => parseInt(drop.value) === slot.slot_id
        );
        const label = slotInfo?.label?.toLowerCase() || "";
        return (
          (isMorning && label.includes("morning")) ||
          (isEvening && label.includes("evening"))
        );
      }
    );

    return relevantSlots.reduce((total: number, slot: any) => {
      const quantity = formik.values.slotQuantities[slot.slot_id] || 0;
      return total + quantity * unitPrice;
    }, 0);
  }, [
    formik.values.slotQuantities,
    customerDetails,
    customerRaw,
    slotDetail,
    formik.values.customer_id,
  ]);

  // Changed onChange handlers to accept value, not event
  const handleCustomerChange = (
    value: string | number | (string | number)[] | null
  ) => {
    formik.setFieldValue("customer_id", value ? value.toString() : "");
  };

  const handlePaymentTypeChange = (
    value: string | number | (string | number)[] | null
  ) => {
    formik.setFieldValue("paymentType", value ? value.toString() : "1");
  };

  return (
    <div className="masters placeorder">
      <div className="management-title">
        <aside>PLACE ORDER</aside>
        <CustomButton
          text="Back"
          onClick={() => navigate(-1)}
          className="btn"
        />
      </div>

      {loading && <AppLoader message="Loading please wait..." />}
      <form onSubmit={formik.handleSubmit}>
        <CustomSelect
          label="Customer Name"
          name="customer_id"
          className="select"
          value={formik.values.customer_id}
          options={CustomerDropdownOptions}
          onChange={handleCustomerChange}
          disabled={!isActiveSlot}
        />
        {!isActiveSlot && (
          <p className="inactive">
            Can't Place Order, Slot is inactive at this moment. You can try
            again later.
          </p>
        )}
        {isActiveSlot && (
          <p className="content">
            Can't Find Customer?{" "}
            <span
              className="add-user"
              onClick={() =>
                navigate("/add-user", {
                  state: { user_type: 5, from: "/place-order" },
                })
              }
            >
              Add new customer
            </span>
          </p>
        )}

        {customerDetails && (
          <div className="customer-info">
            <h3 className="section-title">Customer Details</h3>
            <div className="info-grid">
              <div className="info-field">
                <span className="label">Name:</span>
                <span className="value">{customerDetails.name}</span>
              </div>
              <div className="info-field">
                <span className="label">Phone:</span>
                <span className="value">{customerDetails.phone}</span>
              </div>
              <div className="info-field">
                <span className="label">Email:</span>
                <span className="value">{customerDetails.email}</span>
              </div>
              <div className="info-field">
                <span className="label">Line:</span>
                <span className="value">{customerDetails.line_name}</span>
              </div>
              <div className="info-field">
                <span className="label">Customer Type:</span>
                <span className="value">
                  {customerDetails.customer_type === 1
                    ? "Permanent"
                    : "Temporary"}
                </span>
              </div>
              <div className="info-field">
                <span className="label">Pay Type:</span>
                <span className="value">
                  {customerDetails.pay_type === 1 ? "Daily" : "Monthly"}
                </span>
              </div>
              <div className="info-field">
                <span className="label">Unit Price:</span>
                <span className="value">
                  ₹
                  {customerRaw.find(
                    (cust) =>
                      cust.user_id.toString() === formik.values.customer_id
                  )?.unit_price ?? "0.00"}
                </span>
              </div>
            </div>
            <h4 className="section-subtitle">Slot Quantities</h4>
            <div className="slots">
              {(() => {
                if (!slotDetail?.id || !customerDetails?.today_slot_data)
                  return null;

                const isMorning = slotDetail.id === 1;
                const isEvening = slotDetail.id === 2;

                const relevantSlots = customerDetails.today_slot_data.filter(
                  (slot: any) => {
                    const slotInfo = slotDropDown.find(
                      (drop) => parseInt(drop.value) === slot.slot_id
                    );
                    const label = slotInfo?.label?.toLowerCase() || "";
                    return (
                      (isMorning && label.includes("morning")) ||
                      (isEvening && label.includes("evening"))
                    );
                  }
                );

                if (relevantSlots.length === 0) {
                  return (
                    <p className="no-slot-msg">
                      {isMorning
                        ? "No morning slot found for the user."
                        : "No evening slot found for the user."}
                    </p>
                  );
                }

                return relevantSlots.map((slot: any) => {
                  const slotInfo = slotDropDown.find(
                    (drop) => parseInt(drop.value) === slot.slot_id
                  );
                  const slotLabel = slotInfo?.label || `Slot ${slot.slot_id}`;
                  const value = formik.values.slotQuantities[slot.slot_id] ?? 0;

                  return (
                    <div key={slot.slot_id} className="slot-entry">
                      <label htmlFor={`slot-${slot.slot_id}`}>
                        {slotLabel} (Available: {slot.quantity})
                      </label>
                      <input
                        type="number"
                        min={0}
                        id={`slot-${slot.slot_id}`}
                        value={value}
                        onChange={(e) =>
                          handleQuantityChange(
                            slot.slot_id,
                            Number(e.target.value)
                          )
                        }
                        disabled={customerDetails.pay_type === 2}
                      />
                      {formik.errors.slotQuantities &&
                        typeof formik.errors.slotQuantities === "string" && (
                          <div className="error">
                            {formik.errors.slotQuantities}
                          </div>
                        )}
                    </div>
                  );
                });
              })()}
            </div>
            {/* PAYMENT SECTION */}
            {(customerDetails.pay_type === 1 || // Daily
              (customerDetails.pay_type === 2 &&
                customerDetails.invoice_data?.length > 0)) && (
              <>
                <h4 className="section-subtitle">Payment</h4>
                {totalPrice > 0 && (
                  <CustomSelect
                    label="Payment Type"
                    name="paymentType"
                    className="select"
                    value={formik.values.paymentType}
                    options={paymentOptions}
                    onChange={handlePaymentTypeChange}
                    disabled={
                      customerDetails.pay_type === 2 &&
                      customerDetails.invoice_data?.length === 0
                    }
                  />
                )}

                {formik.values.paymentType === "2" && totalPrice > 0 && (
                  <div className="qr-container" style={{ marginTop: "20px" }}>
                    <p>
                      UPI ID: <strong>vvasamilk@icici</strong>
                    </p>
                    <div
                      className="qr-code-placeholder"
                      style={{
                        width: "180px",
                        height: "180px",
                        backgroundColor: "#eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        margin: "1.5rem 0",
                      }}
                    >
                      [ QR Code Image Here ]
                    </div>
                  </div>
                )}

                {formik.values.paymentType === "2" && totalPrice > 0 && (
                  <CustomInput
                    label="Transaction ID"
                    name="transactionId"
                    type="text"
                    value={formik.values.transactionId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.transactionId &&
                      formik.errors.transactionId
                        ? formik.errors.transactionId
                        : ""
                    }
                  />
                )}
              </>
            )}
            {/* TOTAL PRICE only if customer is daily OR monthly with invoice */}
            {(customerDetails.pay_type === 1 ||
              (customerDetails.pay_type === 2 &&
                customerDetails.invoice_data?.length > 0)) && (
              <>
                <h4 className="section-subtitle">Total Price</h4>
                <p className="total-price">₹ {totalPrice.toFixed(2)}</p>
              </>
            )}
            <div className="btn-set">
              <CustomButton
                text="Place Order"
                htmlType="submit"
                className="submit-btn"
                disabled={
                  !isActiveSlot || formik.isSubmitting || totalPrice === 0
                }
              />
              <CustomButton
                text="Reset"
                className="btn"
                htmlType="button"
                onClick={() => {
                  formik.resetForm();
                  setCustomerDetails(null);
                }}
              />
            </div>{" "}
          </div>
        )}
      </form>
    </div>
  );
};

export default PlaceOrder;
