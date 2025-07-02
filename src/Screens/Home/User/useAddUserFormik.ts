import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createUser,
  getUserById,
  updateUser,
} from "../../../Services/ApiService";
import { toast } from "react-toastify";
import { useUserDetails } from "../../../Utils/Data";

export const validationSchema = (isEdit: boolean) =>
  Yup.object().shape({
    user_name: Yup.string().required("Username is required"),
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").notRequired(),
    phone: Yup.string()
      .required("Phone is required")
      .matches(
        /^[6-9]\d{9}$/,
        "Phone number must be a valid 10-digit Indian number"
      ),

    alternative_number: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid alternate number")
      .notRequired(),

    password: isEdit
      ? Yup.string().notRequired()
      : Yup.string().required("Password is required"),

    user_type: Yup.number().required("User type is required"),

    customer_type: Yup.number().when("user_type", {
      is: 5,
      then: (schema) => schema.required("Customer type is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    line_id: Yup.string().when("user_type", {
      is: 5,
      then: (schema) => schema.required("Line is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    pay_type: Yup.number().when("user_type", {
      is: 5,
      then: (schema) => schema.required("Pay type is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    price_tag_id: Yup.string().when("user_type", {
      is: 5,
      then: (schema) => schema.required("Price tag is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    slot_data: Yup.array().when(["user_type", "customer_type"], {
      is: (user_type: number, customer_type: number) =>
        user_type === 5 && customer_type === 1,
      then: () =>
        Yup.array()
          .of(
            Yup.object().shape({
              slot_id: Yup.number(),
              quantity: Yup.number().nullable(),
              method: Yup.number().nullable(),
              start_date: Yup.string().nullable(),
            })
          )
          .test(
            "at-least-one-slot",
            "At least one slot (morning or evening) must be filled",
            (slots = []) =>
              slots.some((slot) => !!slot.quantity && !!slot.method)
          ),
      otherwise: () => Yup.mixed().notRequired(),
    }),
  });

const useAddUserFormik = () => {
  const { token } = useUserDetails();
  const navigate = useNavigate();
  const location = useLocation();
  const { user_id } = location.state || {};
  const [isSubmitting] = useState(false);
  const isEdit = !!user_id;

  const slotOptions = [
    { label: "Morning (09:15 - 13:00)", value: 1 },
    { label: "Evening (14:30 - 19:14)", value: 2 },
  ];

  const methodOptions = [
    { label: "Direct", value: 1 },
    { label: "Distributor", value: 2 },
  ];

  const handleAddUser = (values: any, { resetForm }: any) => {
    if (!token) {
      toast.error("Login to access any pages");
      navigate("/");
      return;
    }

    const onSuccess = (res: any) => {
      if (res.data.status === 1) {
        toast.success(res.data.msg);
        resetForm();
        navigate("/user");
      } else {
        toast.info(res.data.msg);
      }
    };

    const onError = (error: any) => {
      console.error(error.message);
      toast.error("Something went wrong!");
    };

    const payload = {
      token,
      user_name: values.user_name,
      name: values.name,
      phone: values.phone,
      user_type: values.user_type,

      // Optional fields
      ...(values.email && { email: values.email }),
      ...(values.alternative_number && {
        alternative_number: values.alternative_number,
      }),
      ...(!isEdit && { password: values.password }),

      // Fields for user_type === 5
      ...(values.user_type === 5 && {
        customer_type: values.customer_type,
        line_id: values.line_id,
        pay_type: values.pay_type,
        ...(values.price_tag_id && { price_tag_id: values.price_tag_id }),

        // Conditional slot_data only if customer_type === 1
        ...(values.customer_type === 1 && {
          slot_data: values.slot_data
            .filter((slot: any) => slot.quantity > 0 && slot.method > 0)
            .map((slot: any) => ({
              ...(isEdit && { id: slot.id }),
              slot_id: slot.slot_id,
              method: slot.method,
              quantity: slot.quantity,
              start_date: slot.start_date || values.start_date,
            })),
        }),
      }),
    };

    if (isEdit && user_id) {
      payload.id = Number(user_id);
      updateUser(payload).then(onSuccess).catch(onError);
    } else {
      createUser(payload).then(onSuccess).catch(onError);
    }
  };
  const today = new Date().toISOString().split("T")[0]; // e.g. "2025-06-26"
  const formik = useFormik({
    initialValues: {
      name: "",
      user_name: "",
      email: "",
      phone: "",
      alternative_number: "",
      password: "",
      user_type: 2,
      customer_type: "",
      price_tag_id: "",
      line_id: "",
      start_date: today,
      pay_type: "",
      slot_data: [
        {
          ...(isEdit && { id: 0 }),
          slot_id: 1,
          quantity: 0,
          method: 0,
          start_date: "",
        },
        {
          ...(isEdit && { id: 0 }),
          slot_id: 2,
          quantity: 0,
          method: 0,
          start_date: "",
        },
      ],
      isEdit,
    },
    validationSchema: validationSchema(isEdit),
    onSubmit: handleAddUser,
    enableReinitialize: true,
  });

  const { setFieldValue, setValues } = formik;

  useEffect(() => {
    if (!user_id || !token) return;

    (async () => {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("user_id", user_id.toString());
      const res = await getUserById(formData);

      if (res.data.status === 1) {
        const userData = res.data.data;

        const defaultSlotData = [
          { slot_id: 1, quantity: 0, method: 0, start_date: "" },
          { slot_id: 2, quantity: 0, method: 0, start_date: "" },
        ];

        const updatedSlots = [...defaultSlotData];
        if (Array.isArray(userData.slot_data)) {
          userData.slot_data.forEach((slot: any) => {
            const index = slot.slot_id - 1;
            if (index >= 0 && index < 2) {
              updatedSlots[index] = {
                ...(isEdit && { id: slot.id }),
                slot_id: slot.slot_id,
                quantity: slot.quantity,
                method: slot.method,
                start_date: slot.start_date,
              };
            }
          });
        }

        setValues({
          name: userData.name,
          user_name: userData.user_name,
          email: userData.email,
          phone: userData.phone,
          alternative_number: userData.alternative_number || "",
          password: "",
          user_type: userData.user_type,
          customer_type: userData.customer_type,
          price_tag_id: userData.price_tag_id,
          line_id: userData.line_id,
          pay_type: userData.pay_type,
          slot_data: updatedSlots,
          start_date:
            userData.slot_data?.find((s: any) => s.slot_id === 1)?.start_date ||
            "",

          isEdit: true,
        });
      } else {
        toast.error(res.data.msg || "Failed to fetch user data");
      }
    })();
  }, [user_id, token]);

  return {
    ...formik,
    isSubmitting,
    setFieldValue,
    slotOptions,
    isEdit,
    methodOptions,
  };
};

export default useAddUserFormik;
