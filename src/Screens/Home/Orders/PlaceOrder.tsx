import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveSlots, getUserById } from "../../../Services/ApiService";
import { getUserToken } from "../../../Utils/Data";
import { useAuth } from "../../../Context/AuthContext";
import { useDropdownData } from "../../../Hooks/DropDowns";
import AppLoader from "../../../Components/UI/AppLoader";
import CustomSelect from "../../../Components/UI/CustomSelect";
import CustomButton from "../../../Components/UI/CustomButton";
import "../../../Styles/pages/_placeorder.scss";

import { useFormik } from "formik";
import * as Yup from "yup";

// ---------------------------
// TYPES
// ---------------------------

interface PriceOption {
  id: number;
  price_tag_value: number;
}

interface SlotQuantityMap {
  [slot_id: number]: number;
}

// ---------------------------
// VALIDATION SCHEMA
// ---------------------------

const orderSchema = Yup.object().shape({
  customer_id: Yup.string().required("Customer is required"),
  selectedPriceTagId: Yup.number().nullable().required("Price tag is required"),
  paymentType: Yup.string().required("Payment type is required"),
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

  const {
    CustomerDropdownOptions,
    priceOptionsRaw,
    customerDropDown,
    slotDropDown,
    payTagIdDropDown,
    customerRaw,
  } = useDropdownData() as {
    CustomerDropdownOptions: any[];
    priceOptionsRaw: PriceOption[];
    customerDropDown: (arg: any) => void;
    slotDropDown: { value: string; label: string }[];
    payTagIdDropDown: () => void;
    customerRaw: any;
  };

  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [isActiveSlot, setIsActiveSlot] = useState<boolean>(true);
  const type = 1;

  const paymentOptions = [
    { label: "Cash", value: "1" },
    { label: "Online", value: "2" },
  ];

  // ---------------------------
  // FORMIK
  // ---------------------------

  const formik = useFormik({
    initialValues: {
      customer_id: "",
      selectedPriceTagId: null as number | null,
      paymentType: "1",
      slotQuantities: {} as SlotQuantityMap,
    },
    validationSchema: orderSchema,
    onSubmit: (values) => {
      const data = {
        ...values,
        token: getUserToken(),
      };
      console.log("Form Data:", JSON.stringify(data, null, 2));
    },
    enableReinitialize: true,
  });

  // ---------------------------
  // EFFECTS
  // ---------------------------

  useEffect(() => {
    handleGetActiveSlot();
    payTagIdDropDown();
    customerDropDown({ type });
  }, []);

  useEffect(() => {
    if (formik.values.customer_id) {
      handleGetUserDetails(formik.values.customer_id);
    }
  }, [formik.values.customer_id]);

  // ---------------------------
  // FETCH HANDLERS
  // ---------------------------

  const handleGetActiveSlot = () => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    setLoading(true);

    getActiveSlots(formData)
      .then((res) => {
        if (res.data.status === 1) {
          setIsActiveSlot(true);
        } else if (res.data.status === 2) {
          setIsActiveSlot(false);
        } else console.info(res.data.msg);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  const handleGetUserDetails = (selectedUser: string) => {
    const formData = new FormData();
    formData.append("token", getUserToken());
    formData.append("user_id", selectedUser);

    getUserById(formData)
      .then((res) => {
        if (res.data.status === 1) {
          const user = res.data.data;
          setCustomerDetails(user);
          formik.setFieldValue("selectedPriceTagId", user.price_tag_id || null);
          const quantities: SlotQuantityMap = {};
          user.slot_data?.forEach((slot: any) => {
            quantities[slot.slot_id] = slot.quantity;
          });
          formik.setFieldValue("slotQuantities", quantities);
        } else {
          console.info(res.data);
        }
      })
      .catch(console.log);
  };

  const handleQuantityChange = (slot_id: number, value: number) => {
    formik.setFieldValue("slotQuantities", {
      ...formik.values.slotQuantities,
      [slot_id]: value,
    });
  };

  const totalPrice = useMemo(() => {
    if (
      !customerDetails?.slot_data ||
      formik.values.selectedPriceTagId === null
    )
      return 0;

    const matchedPriceTag = customerRaw.find(
      (opt: any) => opt.user_id == formik.values.customer_id
    );
    const unitPrice = matchedPriceTag?.unit_price ?? 0;

    return customerDetails.slot_data.reduce((total: number, slot: any) => {
      const quantity = formik.values.slotQuantities[slot.slot_id] || 0;
      return total + quantity * unitPrice;
    }, 0);
  }, [
    formik.values.slotQuantities,
    customerDetails,
    formik.values.selectedPriceTagId,
    priceOptionsRaw,
  ]);

  return (
    <div className="masters placeorder">
      {loading && <AppLoader message="Loading please wait..." />}
      <div className="management-title">
        <aside>PLACE ORDER</aside>
        <CustomButton
          text="Back"
          onClick={() => navigate(-1)}
          className="btn"
        />
      </div>

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
        />

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

        {customerDetails && (
          <div className="customer-info">
            <div className="field">
              Name: <strong>{customerDetails.name}</strong>
            </div>
            <div className="field">
              Phone: <strong>{customerDetails.phone}</strong>
            </div>
            <div className="field">
              Email: <strong>{customerDetails.email}</strong>
            </div>
            <div className="field">
              Line: <strong>{customerDetails.line_name}</strong>
            </div>
            <div className="field">
              Customer Type:{" "}
              <strong>
                {customerDetails.customer_type === 1
                  ? "Permanent"
                  : "Temporary"}
              </strong>
            </div>
            <div className="field">
              Pay Type:{" "}
              <strong>
                {customerDetails.pay_type === 1 ? "Daily" : "Monthly"}
              </strong>
            </div>

            <div className="field">
              Unit Price:{" "}
              <strong>
                ₹
                {priceOptionsRaw.find(
                  (opt) => opt.id === formik.values.selectedPriceTagId
                )?.price_tag_value ?? "0.00"}
              </strong>
            </div>

            <div className="slots">
              {slotDropDown.map((slot) => {
                const slotId = parseInt(slot.value);
                const slotExists = customerDetails.slot_data?.some(
                  (s: any) => s.slot_id === slotId
                );

                const isEveningSlot = slot.label
                  .toLowerCase()
                  .includes("evening");
                if (isEveningSlot && !slotExists) return null;

                const value = formik.values.slotQuantities[slotId] ?? 0;

                return (
                  <div key={slot.value} className="slot-entry">
                    <label htmlFor={`slot-${slotId}`}>
                      {slot.label} Quantity
                    </label>
                    <input
                      id={`slot-${slotId}`}
                      type="number"
                      min={0}
                      value={value}
                      onChange={(e) =>
                        handleQuantityChange(
                          slotId,
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                );
              })}
            </div>

            {customerDetails.pay_type !== 2 && (
              <CustomSelect
                label="Payment Type"
                name="paymentType"
                className="select"
                value={formik.values.paymentType}
                options={paymentOptions}
                onChange={(value) => {
                  const selected = value?.toString() || "1";
                  formik.setFieldValue("paymentType", selected);
                }}
              />
            )}

            {formik.values.paymentType === "2" &&
              customerDetails.pay_type !== 2 && (
                <div className="qr-container">
                  <p>UPI : vvasamilk@icici</p>
                  <div className="QR">Sample QR</div>
                </div>
              )}

            <div className="total-price">
              Total Price: <strong>₹ {totalPrice.toFixed(2)}</strong>
            </div>
          </div>
        )}

        <CustomButton text="Submit" className="submit-btn" htmlType="submit" />
      </form>
    </div>
  );
};

export default PlaceOrder;
