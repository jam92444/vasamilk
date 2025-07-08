import { Formik, Form } from "formik";
import * as Yup from "yup";
import CustomModal from "../Components/UI/CustomModal";
import CustomInput from "../Components/UI/CustomInput";
import CustomButton from "../Components/UI/CustomButton";
import CustomSelect from "../Components/UI/CustomSelect";

export interface ReasonFormValues {
  id?: number;
  name: string;
  type: number | string;
  status?: number;
}

interface ReasonFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: ReasonFormValues) => void;
  initialData?: ReasonFormValues;
}

// ---------------------------
// Options & Validation
// ---------------------------
const typeOptions = [
  { label: "Vendor / Logger", value: 1 },
  { label: "Distributor", value: 2 },
  { label: "Customer", value: 3 },
];

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  type: Yup.number()
    .required("Type is required")
    .oneOf(
      typeOptions.map((opt) => opt.value),
      "Invalid type selected"
    ),
});

const ReasonFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialData = { name: "", type: 1 },
}: ReasonFormModalProps) => {
  return (
    <CustomModal
      visible={visible}
      title={initialData?.id ? "Edit Reason" : "Add Reason"}
      onClose={onClose}
      width={500}
    >
      <Formik
        initialValues={initialData}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          onSubmit({
            ...values,
            type: Number(values.type), // ensure number
          });
          actions.setSubmitting(false);
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          touched,
          errors,
          setFieldValue,
          isSubmitting,
        }) => (
          <div className="reason">
            <Form className="reason-form" aria-label="Reason form">
              <CustomInput
                name="name"
                label="Reason Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.name}
                error={errors.name}
                required
              />

              <CustomSelect
                name="type"
                label="User Type"
                options={typeOptions}
                value={values.type}
                onChange={(value) => setFieldValue("type", value)}
                error={touched.type && errors.type ? errors.type : ""}
                required
              />

              <div className="form-actions">
                <CustomButton
                  text="Cancel"
                  type="default"
                  className="btn"
                  onClick={onClose}
                  disabled={isSubmitting}
                />
                <CustomButton
                  text="Save"
                  htmlType="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                />
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </CustomModal>
  );
};

export default ReasonFormModal;
