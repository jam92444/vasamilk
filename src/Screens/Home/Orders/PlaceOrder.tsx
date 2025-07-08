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

interface PriceOption {
  id: number;
  price_tag_value: number;
}

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

    const payload = {
      token: getUserToken(),
      customer_id: parseInt(values.customer_id),
      quantity: totalQuantity,
      payment_type: parseInt(values.paymentType),
      is_paid: values.paymentType === "2" ? 1 : 0,
      transaction_id: values.paymentType === "2" ? values.transactionId : null,
      is_monthly_paid: 0,
      monthly_id: 0,
      monthly_payment_type: null,
      monthly_transaction_id: null,
    };

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
          onChange={(value) =>
            formik.setFieldValue("customer_id", value ? value.toString() : "")
          }
          disabled={!isActiveSlot}
        />

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
                        {slotLabel} Quantity
                      </label>
                      <input
                        id={`slot-${slot.slot_id}`}
                        type="number"
                        min={0}
                        step="0.001"
                        value={value}
                        onChange={(e) =>
                          handleQuantityChange(
                            slot.slot_id,
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  );
                });
              })()}
            </div>

            {customerDetails.pay_type !== 2 && (
              <CustomSelect
                label="Payment Type"
                name="paymentType"
                className="select"
                value={formik.values.paymentType}
                options={paymentOptions}
                onChange={(value) =>
                  formik.setFieldValue("paymentType", value?.toString() || "1")
                }
              />
            )}

            {formik.values.paymentType === "2" &&
              customerDetails.pay_type !== 2 && (
                <>
                  <div className="qr-container">
                    <p>
                      UPI ID: <strong>vvasamilk@icici</strong>
                    </p>
                    <div className="QR">[ QR Code Image Here ]</div>
                  </div>
                  <div className="field">
                    <label htmlFor="transactionId">Transaction ID</label>
                    <CustomInput
                      id="transactionId"
                      name="transactionId"
                      value={formik.values.transactionId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.transactionId &&
                      formik.errors.transactionId && (
                        <div className="error">
                          {formik.errors.transactionId}
                        </div>
                      )}
                  </div>
                </>
              )}

            <div className="total-price">
              Total Price: <strong>₹ {totalPrice.toFixed(2)}</strong>
            </div>
          </div>
        )}

        <CustomButton
          text="Submit"
          className="submit-btn"
          htmlType="submit"
          disabled={!isActiveSlot}
        />

        {!isActiveSlot && (
          <p className="inactive">
            Can't Place Order, Slot is inactive at this moment. You can try
            again later.
          </p>
        )}
      </form>
    </div>
  );
};

export default PlaceOrder;
